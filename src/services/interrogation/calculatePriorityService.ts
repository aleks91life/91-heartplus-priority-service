import { RuleCalculation } from "../../engine/core";
import { InterrogationRequestType, Rule } from "../../types";
import { calculateBatteryPriority } from "../../engine/battery-calculation";
import calculateStelPriority, { StelRule } from "../../engine/stel-calculation";
import { logger } from "../../utils";
import { getRules } from "./rulesService";
import { filterRulesByInterrogations } from "../../engine/filter-calculation";
import { calculateOtherPriority } from "../../engine/other-calculation";
import { calculateEpisodePriority } from "../../engine/episode.calculation";

async function startCalculatingPriority(
  data: InterrogationRequestType[]
): Promise<RuleCalculation[]> {
  let rules: Rule[] = (await getRules("ck5eb4pd9tb0609108davwr6b")) as Rule[];

  let filteredRules = await filterRulesByInterrogations(data, rules);
  logger.info(
    "[x] System has filtered " +
      filteredRules.length +
      " rules" +
      " from " +
      rules.length +
      " rules"
  );

  let priorityA: RuleCalculation[] = [];

  for (let rule of filteredRules) {
    switch (rule.type) {
      case "battery":
        {
          let rul = rule as unknown as Rule;
          for (let item of data) {
            const priority = calculateBatteryPriority(item, rul);
            if (priority.priority > 0) {
              priorityA.push(priority);
            }
          }
        }
        break;
      case "stel":
        {
          let rul = rule as unknown as StelRule;
          for (let item of data) {
            const priority = calculateStelPriority(item, rul);
            if (priority.priority > 0) {
              if (priority && priority.priority > 0) {
                priorityA.push(priority);
              }
            }
          }
        }
        break;
      case "other":
        {
          let rul = rule as unknown as Rule;
          for (let item of data) {
            const priority = calculateOtherPriority(item, rul);
            if (priority && priority.priority > 0) {
              priorityA.push(priority);
            }
          }
        }
        break;
      case "episode":
        {
          let rul = rule as unknown as Rule;
          for (let item of data) {
            const priority = calculateEpisodePriority(item, rul);
            if (priority && priority.priority > 0) {
              priorityA.push(priority);
            }
          }
        }
        break;
      default:
        break;
    }
  }

  return priorityA;
}

export async function calculatePriority(
  data: InterrogationRequestType[]
): Promise<any> {
  try {
    let results: RuleCalculation[] = await startCalculatingPriority(data);

    const minPriority = results.reduce((acc, cur) => {
      if (cur.priority === 1) {
        return 1;
      }
      return Math.min(acc, cur.priority);
    }, 0);

    const affectedRules = results.map((rule) => rule.ruleID);

    return {
      affectedRules: affectedRules,
      finalPriority: minPriority,
      results: results,
    };
  } catch (e: any) {
    logger.error("Error saving interrogation to database: ", e);
  }
}
