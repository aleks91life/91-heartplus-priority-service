import { get } from "lodash";
import {
  ComparisonOperator,
  FilterRow,
  FilterRule,
  InterrogationRequestType,
  Rule,
} from "../types";

export async function filterRulesByInterrogations(
  interrogations: InterrogationRequestType[],
  rules: Rule[]
): Promise<Rule[]> {
  return rules.filter((rule) => {
    // Check if the rule has no filters or empty filters
    if (
      !rule.interrogationRules ||
      !rule.interrogationRules.conditions ||
      rule.interrogationRules.conditions.length === 0 ||
      (rule.interrogationRules.conditions.length === 1 &&
        isEmptyFilterRow(rule.interrogationRules.conditions[0] as FilterRow))
    ) {
      return true;
    }

    const result = applyFilterRule(
      interrogations,
      rule.interrogationRules,
      rule.id
    );
    return result;
  });
}

function isEmptyFilterRow(filterRow: FilterRow): boolean {
  return (
    (!filterRow.fieldName ||
      filterRow.fieldName.length === 0 ||
      filterRow.fieldName[0] === "") &&
    (!filterRow.value ||
      filterRow.value.length === 0 ||
      filterRow.value[0] === "") &&
    filterRow.operator === "eq"
  );
}

function applyFilterRule(
  interrogations: InterrogationRequestType[],
  filterRule: FilterRule,
  ruleId: string
): boolean {
  const { operator, conditions } = filterRule;

  const results = conditions.map((condition, index) => {
    if (isFilterRule(condition)) {
      return applyFilterRule(interrogations, condition, ruleId);
    } else {
      return applyFilterRow(interrogations, condition, ruleId);
    }
  });

  const finalResult =
    operator === "and"
      ? results.every((result) => result)
      : results.some((result) => result);
  return finalResult;
}

function isFilterRule(
  condition: FilterRule | FilterRow
): condition is FilterRule {
  return "operator" in condition && "conditions" in condition;
}

function applyFilterRow(
  interrogations: InterrogationRequestType[],
  filterRow: FilterRow,
  ruleId: string
): boolean {
  const result = interrogations.some((interrogation) => {
    const fieldValue = get(interrogation, filterRow.fieldName);

    // Check if the field exists in the interrogation
    if (fieldValue === undefined) {
      return true;
    }

    const comparisonResult = compareValues(
      fieldValue,
      filterRow.operator,
      filterRow.value
    );
    return comparisonResult;
  });

  return result;
}

function compareValues(
  fieldValue: any,
  operator: ComparisonOperator,
  compareValue: any[]
): boolean {
  switch (operator) {
    case "eq":
      return fieldValue === compareValue[0];
    case "neq":
      return fieldValue !== compareValue[0];
    case "gt":
      return fieldValue > compareValue[0];
    case "gte":
      return fieldValue >= compareValue[0];
    case "lt":
      return fieldValue < compareValue[0];
    case "lte":
      return fieldValue <= compareValue[0];
    case "between":
      return fieldValue >= compareValue[0] && fieldValue <= compareValue[1];
    case "in":
      return compareValue.includes(fieldValue);
    case "nin":
      return !compareValue.includes(fieldValue);
    case "contains":
      return (
        typeof fieldValue === "string" && fieldValue.includes(compareValue[0])
      );
    case "ncontains":
      return (
        typeof fieldValue === "string" && !fieldValue.includes(compareValue[0])
      );
    case "startswith":
      return (
        typeof fieldValue === "string" && fieldValue.startsWith(compareValue[0])
      );
    case "endswith":
      return (
        typeof fieldValue === "string" && fieldValue.endsWith(compareValue[0])
      );
    case "isnull":
      return fieldValue === null;
    case "notnull":
      return fieldValue !== null;
    default:
      console.warn(`Unsupported operator: ${operator}`);
      return false;
  }
}
