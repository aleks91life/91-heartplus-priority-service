import { InterrogationRequestType, Rule } from "../types";
import { RuleCalculation } from "./core";

export function calculateOtherPriority(
  data: InterrogationRequestType,
  rule: Rule
): RuleCalculation | undefined {
  const issues: { field_path: string[]; message: string }[] = [];

  let rulePassed = true;

  if (rule.patientRules) {
    if (rule.patientRules.excludedPatients) {
      if (rule.patientRules.excludedPatients.includes(data.user_id)) {
        rulePassed = true;
        return {
          ruleID: rule.id,
          priority: 0,
          type: rule.type,
          issues: [],
        };
      }
    }

    if (
      rule.patientRules.includedPatients &&
      rule.patientRules.includedPatients.length > 0
    ) {
      if (!rule.patientRules.includedPatients.includes(data.user_id)) {
        rulePassed = true;
        return {
          ruleID: rule.id,
          priority: 0,
          type: rule.type,
          issues: [],
        };
      }
    }

    if (rule.interrogationRules) {
    }

    const calculatedPriority = rulePassed ? rule.priority ?? 0 : 0;

    return {
      ruleID: rule.id,
      priority: calculatedPriority,
      type: rule.type,
      issues,
    };
  }
}
