import { v4 as uuidv4 } from 'uuid';
import { Priority } from '../entities/Priority';
import { InterrogationPriorityCalculationService } from '../services/InterrogationPriorityCalculationService';
import { filterTransmission, isPatientIncluded } from './patientRules';
import { fieldPathMapping } from '../fieldPathMapping';
import { evaluateCondition, getValueByPath } from '../utils/utils';
import { InterrogationPriorityCalculation } from '../entities/InterrogationPriorityCalculation';

const generateUniqueId = () => uuidv4();

export async function determinePriorityAndLog(
  transmission: any,
  rulesTable: Priority[],
  priorityCalculationService: InterrogationPriorityCalculationService
): Promise<InterrogationPriorityCalculation[]> {
  let highestPriority: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  const causes: string[] = [];

  const transmissionId = generateUniqueId();
  console.log('determinePriorityAndLog function started');

  console.log('Transmission ID:', transmissionId);
  console.log('Transmission Data:', JSON.stringify(transmission, null, 2));
  console.log('Rules Table:', JSON.stringify(rulesTable, null, 2));

  for (const rule of rulesTable) {
    console.log('Processing Rule:', rule);
    console.log('determinePriorityAndLog function started');
    

    if (!isPatientIncluded(transmission.patient.id, rule.patient_rules)) {
      console.log('Patient not included for rule:', rule.id);
      continue;
    }

    const qualifier = rule.patient_rules.qualifier;
    if (qualifier !== rule.interrogation_rules.qualifier) {
      console.log('Qualifiers do not match for rule:', rule.id);
      continue;
    }

    const patientRulesPassed = filterTransmission(transmission, rule.patient_rules, fieldPathMapping);
    const interrogationRulesPassed = filterTransmission(transmission, rule.interrogation_rules, fieldPathMapping);

    console.log('Patient Rules Passed:', patientRulesPassed);
    console.log('Interrogation Rules Passed:', interrogationRulesPassed);
    console.log('determinePriorityAndLog function started');

    if ((qualifier === 'any' && (patientRulesPassed || interrogationRulesPassed)) ||
        (qualifier === 'all' && patientRulesPassed && interrogationRulesPassed)) {
          console.log('determinePriorityAndLog function started');

        for (const [field, condition] of Object.entries(rule.rules)) {
          console.log('determinePriorityAndLog function started');
          console.log(`Field: ${field}, Path: ${fieldPathMapping[field]}`);
          const path = fieldPathMapping[field];
          
          console.log( `path: ${path}`)
          if (path) {
            const fieldValue = getValueByPath(transmission, path);
            console.log(`Field Value for path ${path}:`, fieldValue);
            console.log(`Evaluating condition: ${condition.operator} ${condition.value} against field value ${fieldValue}`);
            if (fieldValue !== undefined && evaluateCondition(fieldValue, condition)) {
              causes.push(`Field ${field} matched condition ${condition.operator} ${condition.value}`);
              if (rule.priority === 'HIGH') {
                highestPriority = 'HIGH';
              } else if (rule.priority === 'MEDIUM' && highestPriority !== 'HIGH') {
                highestPriority = 'MEDIUM';
              } else if (rule.priority !=="MEDIUM" && highestPriority !=="MEDIUM" ){
                highestPriority = 'LOW'
              }

              await priorityCalculationService.createCalculation({
                id:uuidv4(),
                transmission_id: transmissionId,
                rule_id: rule.id,
                cause: `Field ${field} matched condition ${condition.operator} ${condition.value}`,
                highestPriority: highestPriority,
                status: 'ACTIVE',
              });
            }
          }
        }
    }
  }

  console.log(`Log Entries: ${JSON.stringify(causes, null, 2)}`);
  return await priorityCalculationService.getCalculationsByTransmissionId(transmissionId);
}
