import { FilterRow } from "../types";

export function evaluateCondition(condition: FilterRow, data: any): boolean {
  let fieldValue = data;
  for (const field of condition.fieldName) {
    fieldValue = fieldValue?.[field] ?? {};
  }

  const operator = condition.operator;
  const conditionValue = condition.value.length > 0 ? condition.value[0] : null;

  switch (operator) {
    case "eq":
      return fieldValue === conditionValue;
    case "neq":
      return fieldValue !== conditionValue;
    case "gt":
      return fieldValue > conditionValue;
    case "gte":
      return fieldValue >= conditionValue;
    case "lt":
      return fieldValue < conditionValue;
    case "lte":
      return fieldValue <= conditionValue;
    case "in":
      return condition.value.includes(fieldValue);
    case "nin":
      return !condition.value.includes(fieldValue);
    case "contains":
      return fieldValue.includes(conditionValue);
    case "ncontains":
      return !fieldValue.includes(conditionValue);
    case "startswith":
      return fieldValue.startsWith(conditionValue);
    case "endswith":
      return fieldValue.endsWith(conditionValue);
    case "isnull":
      return fieldValue === null;
    case "notnull":
      return fieldValue !== null;
    case "between":
      return (
        condition.value[0] <= fieldValue && fieldValue <= condition.value[1]
      );
    default:
      return false;
  }
}

export interface RuleCalculation {
  ruleID: string;
  priority: number;
  type?: string;
  issues?: {
    field_path: string[];
    message: string;
  }[];
}

export interface ValueInterval {
  min: number;
  max: number;
}

export function transformRanges<TRange>(
  valueRange: Record<string, string>
): TRange {
  return Object.keys(valueRange).reduce((acc, key) => {
    const match = key.match(/(\w+)_(min|max)/);
    if (match) {
      const [, id, type] = match;
      const value = parseFloat(valueRange[key]);
      acc[id] = {
        min: Number.MIN_SAFE_INTEGER,
        max: Number.MAX_SAFE_INTEGER,
        ...acc[id],
        ...(Number.isFinite(value) && { [type]: value }),
      };
    }
    return acc;
  }, {} as TRange);
}
