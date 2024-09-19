import {
  InterrogationRequest,
  InterrogationRequestType,
  PatientRules,
} from "../types";
import { RuleCalculation } from "./core";

export interface StelRule {
  id: string;
  type: "stel";
  rules: {
    valueRange: {
      [key: string]: string | number;
    };
    filters?: {
      excludedPatients?: string[];
    };
  };
  patientRules?: PatientRules;
  priority: number;
}

function transformRanges(rule: StelRule) {
  return Object.entries(rule.rules.valueRange).reduce((acc, [key, value]) => {
    const [field, bound] = key.split("_");
    if (bound === "min" || bound === "max") {
      if (!acc[field]) {
        acc[field] = { min: -Infinity, max: Infinity };
      }
      acc[field][bound] = Number(value);
    }
    return acc;
  }, {} as Record<string, { min: number; max: number }>);
}

function calculateStelPriority(
  data: InterrogationRequestType,
  rule: StelRule
): RuleCalculation {
  let highestPriority = 3;

  const ranges = transformRanges(rule);
  let issues = [];
  const isAffected = checkAffected(data, ranges, rule, issues);

  if (isAffected) {
    const priority = Math.max(
      1,
      Math.min(rule.priority <= 0 ? 3 : rule.priority, 3)
    );
    highestPriority = priority;
  }

  return {
    ruleID: rule.id,
    priority: highestPriority,
    issues: issues,
  };
}

function checkAffected(
  data: InterrogationRequestType,
  ranges: Record<string, { min: number; max: number }>,
  rule: StelRule,
  issues: { field_path: string[]; message: string }[]
): boolean {
  // Check patient exclusion
  if (rule.patientRules?.excludedPatients?.includes(data.user_id)) {
    return false;
  }

  const measurements = data.transmission.measurements;
  if (!measurements) {
    return false;
  }

  for (const [key, range] of Object.entries(ranges)) {
    switch (key) {
      case "glucose":
        break;
      case "spo2":
        break;
      case "weight":
        break;
      case "dia":
      case "sys":
        // blood pressure measurements
        const bpMeasurement = measurements.leadChannelMeasurements.find(
          (m) => m.chamber === "RA" || m.chamber === "RV"
        );

        if (bpMeasurement?.sensing?.intrinsicAmplitude) {
          const value = bpMeasurement.sensing.intrinsicAmplitude;
          if (value < range.min) {
            issues.push({
              field_path: [key, "intrinsicAmplitude"],
              message:
                "Intrinsic amplitude is below the minimum range " +
                range.min +
                " it is " +
                value,
            });

            return true;
          } else if (value > range.max) {
            issues.push({
              field_path: [key, "intrinsicAmplitude"],
              message:
                "Intrinsic amplitude exceeds the maximum range " +
                range.max +
                " it is " +
                value,
            });

            return true;
          }
        }

        if (bpMeasurement?.impedance?.value) {
          const value = bpMeasurement.impedance?.value;
          if (value < range.min) {
            issues.push({
              field_path: [key, "value"],
              message:
                "Impedance value is below the minimum range " +
                range.min +
                " it is " +
                value,
            });

            return true;
          } else if (value > range.max) {
            issues.push({
              field_path: [key, "value"],
              message:
                "Impedance value exceeds the maximum range " +
                range.max +
                " it is " +
                value,
            });

            return true;
          }
        }

        break;
      case "bpm":
        // heart rate measurements
        const hrMeasurement = data.transmission.statistics?.heartRate?.[0];
        if (hrMeasurement) {
          const value = hrMeasurement.ventricularRateMean;
          if (value > range.min) {
            issues.push({
              field_path: [key, "ventricularRateMean"],
              message:
                "Ventricular rate mean is below the minimum range " +
                range.min +
                " it is " +
                value,
            });

            return true;
          } else if (value > range.max) {
            issues.push({
              field_path: [key, "ventricularRateMean"],
              message:
                "Ventricular rate mean exceeds the maximum range " +
                range.max +
                " it is " +
                value,
            });

            return true;
          }
        }
        break;
    }
  }

  return false;
}

export default calculateStelPriority;
