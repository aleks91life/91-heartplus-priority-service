import { mapPriorityToLabel } from '../utils/helpers';
import { PriorityRuleService } from '../services/priorityRuleService';
import { PriorityRule } from '@prisma/client';

const priorityRuleService = new PriorityRuleService();

type Transmission = {
  statistics?: {
    crt?: { lvPercentPaced?: number };
    brady?: Array<{ raPercentPaced?: number; rvPercentPaced?: number }>;
  };
  device?: { type: string };
  patient?: { id: string };
  measurements?: {
    batteryMeasurements?: Array<{
      date: string;
      status: string;
      voltage?: number;
      remainingLongevity?: number;
      impedance?: number;
      remainingPercentage?: number;
    }>;
  };
};

type ValueRange = {
  [key: string]: { min?: number; max?: number };
};

type Rule = {
  type: string;
  priority: number;
  patientRules: Record<string, any>; 
  interrogationRules: Record<string, any>; 
  rules: {
    position: Record<string, any>; 
    valueRange: ValueRange; 
  };
};

type PacingRule = Rule & {
  rules: {
    position: { chamber: string[] };
    valueRange: { pacing?: { min?: number; max?: number } };
  };
};

type BatteryRule = Rule & {
  rules: {
    position: { status: string[] };
    valueRange: {
      voltage?: { min?: number; max?: number };
      remainingLongevity?: { min?: number; max?: number };
      impedance?: { min?: number; max?: number };
      remainingPercentage?: { min?: number; max?: number };
    };
  };
};


const testRule = {
  type: 'pacing',
  priority: 1,
  patientRules: null, // Placeholder for future use
  interrogationRules: null, // Placeholder for future use
  rules: {
    position: {chamber: ['LV']}, // Generic position field
    valueRange: {pacing:{min:30,max:100}} // Generalized valueRange
  }
}

function parsePriorityRule(priorityRule: PriorityRule): Rule {
  let parsedValueRange: ValueRange = {};

  // First, ensure that the rules are parsed correctly from the database
  let rules: any = {};
  if (typeof priorityRule.rules === 'string') {
    try {
      rules = JSON.parse(priorityRule.rules);
    } catch (error) {
      console.error('Error parsing rules JSON:', error);
      rules = { position: {}, valueRange: {} }; // Fallback structure in case of error
    }
  } else {
    rules = priorityRule.rules ?? { position: {}, valueRange: {} };
  }

  // Parsing valueRange based on the rule type
  if (priorityRule.type === 'pacing') {
    parsedValueRange = {
      pacing: {
        min: rules.valueRange?.pacing?.min ?? rules.valueRange?.value_min,
        max: rules.valueRange?.pacing?.max ?? rules.valueRange?.value_max,
      },
    };
  } else if (priorityRule.type === 'battery') {
    parsedValueRange = {
      voltage: {
        min: rules.valueRange?.voltage?.min ?? rules.valueRange?.voltage_min,
        max: rules.valueRange?.voltage?.max ?? rules.valueRange?.voltage_max,
      },
      remainingLongevity: {
        min: rules.valueRange?.remainingLongevity?.min ?? rules.valueRange?.remainingLongevity_min,
        max: rules.valueRange?.remainingLongevity?.max ?? rules.valueRange?.remainingLongevity_max,
      },
      impedance: {
        min: rules.valueRange?.impedance?.min ?? rules.valueRange?.impedance_min,
        max: rules.valueRange?.impedance?.max ?? rules.valueRange?.impedance_max,
      },
      remainingPercentage: {
        min: rules.valueRange?.remainingPercentage?.min ?? rules.valueRange?.remainingPercentage_min,
        max: rules.valueRange?.remainingPercentage?.max ?? rules.valueRange?.remainingPercentage_max,
      },
    };
  }

  // Returning the parsed rule
  return {
    type: priorityRule.type,
    priority: priorityRule.priority,
    patientRules: typeof priorityRule.patientRules === 'string'
      ? JSON.parse(priorityRule.patientRules)
      : priorityRule.patientRules ?? {},
    interrogationRules: typeof priorityRule.interrogationRules === 'string'
      ? JSON.parse(priorityRule.interrogationRules)
      : priorityRule.interrogationRules ?? {},
    rules: {
      position: rules.position ?? {}, 
      valueRange: parsedValueRange,  
    },
  };
}



  

type InterpretationResult = {
  causes: any[];
  priority: number;
};

type FinalResult = {
  causes: any[];
  priority: number;
  priorityLabel: string;
};

const interpreters = {
  checkRange: (actualValue: number, { min, max }: { min?: number; max?: number }, field: string) => {
    const results: any[] = [];

    if ((min !== undefined && min !== 0) && (max !== undefined && max !== 0)) {
      if (actualValue >= min && actualValue <= max) {
        results.push({
          message: `${field} is within the specified range`,
          expected: `between ${min} and ${max}`,
          actual: actualValue,
        });
      }
    } else {
      if (min !== undefined && actualValue >= min) {
        results.push({
          message: `${field} exceeds the minimum allowed`,
          expected: `>= ${min}`,
          actual: actualValue,
        });
      }
      if (max !== undefined && actualValue <= max) {
        results.push({
          message: `${field} is less than the maximum allowed`,
          expected: `<= ${max}`,
          actual: actualValue,
        });
      }
    }

    return results;
  },
};

function interpretPacingRule(rule: PacingRule, transmission: Transmission) {
  const results: any[] = [];
  const { chamber } = rule.rules.position;
  const { pacing } = rule.rules.valueRange;

  if (!pacing) return { causes: results, priority: 3 };

  // Apply pacing rules for each specified chamber
  for (const currentChamber of chamber) {
    let actualPacing: number | undefined;

    // Determine the correct chamber and get the pacing value
    if (currentChamber === 'LV') {
      actualPacing = transmission.statistics?.crt?.lvPercentPaced;
    } else if (currentChamber === 'RV') {
      actualPacing = transmission.statistics?.brady?.[0]?.rvPercentPaced;
    } else if (currentChamber === 'RA') {
      actualPacing = transmission.statistics?.brady?.[0]?.raPercentPaced;
    }

    // If actual pacing is not found, skip this chamber
    if (actualPacing === undefined) continue;

    // Apply the generic range check for pacing
    const checkResults = interpreters.checkRange(actualPacing, pacing, currentChamber);
    results.push(...checkResults);
  }

  return {
    causes: results,
    priority: results.length > 0 ? rule.priority : 3,
  };
}

function interpretBatteryRule(rule: BatteryRule, transmission: Transmission) {
  const results: any[] = [];
  const { status } = rule.rules.position;
  const { valueRange } = rule.rules;

  const batteryMeasurements = transmission.measurements?.batteryMeasurements ?? [];

  for (const measurement of batteryMeasurements) {
    if (status.includes(measurement.status)) {
      for (const [key, range] of Object.entries(valueRange)) {
        const actualValue = measurement[key as keyof typeof measurement];
        if (actualValue !== undefined && typeof actualValue === 'number') {
          const checkResults = interpreters.checkRange(actualValue, range, key);
          results.push(...checkResults);
        }
      }
    }
  }

  return {
    causes: results,
    priority: results.length > 0 ? rule.priority : 3,
  };
}

export async function priorityEngine2(transmission: Transmission): Promise<FinalResult> {
  let allCauses: any[] = [];
  let highestPriority = 3;

  try {
    const priorityRules = await priorityRuleService.getActivePriorityRules();

    if (priorityRules !== null) {
      for (const priorityRule of priorityRules) {
        const rule = parsePriorityRule(priorityRule);
        //const rule = testRule;

        let interpretationResult: InterpretationResult | null = null;

        if (rule.type === 'pacing') {
          interpretationResult = interpretPacingRule(rule as unknown as PacingRule, transmission);
        } else if (rule.type === 'battery') {
          interpretationResult = interpretBatteryRule(rule as unknown as BatteryRule, transmission);
        }

        if (interpretationResult) {
          allCauses = allCauses.concat(interpretationResult.causes);
          highestPriority = Math.min(highestPriority, interpretationResult.priority);
        }
      }
    }

    const priorityLabel = mapPriorityToLabel(highestPriority);

    return {
      causes: allCauses,
      priority: highestPriority,
      priorityLabel: priorityLabel,
    };
  } catch (error) {
    console.error('Error fetching rules or interpreting transmission:', error);
    throw new Error('Failed to interpret priority rules');
  }
}
