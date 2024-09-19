import { stat } from "fs";
import { InterrogationRequestType, Rule } from "../types";
import { MDC_IDC_ENUM_BATTERY_STATUS } from "../types/enums";
import { RuleCalculation, transformRanges, ValueInterval } from "./core";

interface BatteryRanges {
  impedance: ValueInterval;
  voltage: ValueInterval;
  remainingPercentage: ValueInterval;
  remainingLongevity: ValueInterval;
}

export function calculateBatteryPriority(
  data: InterrogationRequestType,
  rule: Rule
): RuleCalculation {
  const status = rule.rules?.position?.status || [];
  const ranges = transformRanges<BatteryRanges>(rule.rules?.valueRange || {});
  const rangeKeys = Object.keys(ranges);
  const issues: { field_path: string[]; message: string }[] = [];
  const batteryMeasurements =
    data.transmission.measurements?.batteryMeasurements || [];

  const affectedMeasurements = batteryMeasurements
    .filter((battery) => {
      const batteryStatus = battery.status as MDC_IDC_ENUM_BATTERY_STATUS;

      if (!status.includes(batteryStatus) && !status.includes("Unknown")) {
        return false;
      }

      if (batteryStatus == "RRT") {
        issues.push({
          field_path: ["status"],
          message: "Battery status is on Recommended Replacement Time",
        });
      }

      return rangeKeys.every((key) => {
        const value = battery[key];
        const range = ranges[key];

        if (!(key in battery)) {
          return false;
        }

        if (value === undefined || value === null) {
          return false;
        }

        const numValue = Number(value);

        if (numValue < range.min) {
          issues.push({
            field_path: [key],
            message:
              "Value is smaller than the minimum range " +
              range.min +
              " it is " +
              numValue,
          });
        } else if (numValue > range.max) {
          issues.push({
            field_path: [key],
            message:
              "Value exceeds the maximum range " +
              range.max +
              " it is " +
              numValue,
          });
        }

        return !(
          Number.isFinite(numValue) &&
          (!Number.isFinite(range.min) || numValue >= range.min) &&
          (!Number.isFinite(range.max) || numValue <= range.max)
        );
      });
    })
    .map((battery) => battery.date);

  const calculatedPriority =
    affectedMeasurements.length > 0 ? rule.priority ?? 0 : 0;

  return {
    ruleID: rule.id,
    priority: calculatedPriority,
    type: rule.type,
    issues,
  };
}
