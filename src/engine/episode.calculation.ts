import { InterrogationRequestType, Rule } from "../types";
import {
  MDC_IDC_ENUM_EPISODE_TYPE,
  ENUM_EPISODE_VIRTUAL_TYPE,
  MDC_IDC_ENUM_EPISODE_VENDOR_TYPE,
} from "../types/enums";
import { RuleCalculation, transformRanges, ValueInterval } from "./core";

interface StringOperation {
  operator: "not" | "is" | "contains" | "not contains";
  content: string;
}
interface EpisodeRanges {
  duration: ValueInterval;
  treated?: boolean;
  excludeNullDuration?: boolean;
  detectionTherapy?: StringOperation[];
  episodeID?: StringOperation[];
}

function transformRanges2<TRange>(valueRange: Record<string, string>): TRange {
  return Object.keys(valueRange).reduce((acc, key) => {
    const match = key.match(/(\w+)_(min|max)/);
    if (match) {
      const [, id, type] = match;
      const value = parseFloat(valueRange[key]);
      if (!acc[id]) {
        acc[id] = {
          min: Number.MIN_SAFE_INTEGER,
          max: Number.MAX_SAFE_INTEGER,
        };
      }
      if (Number.isFinite(value)) {
        acc[id][type] = value;
      }
    }
    return acc;
  }, {} as TRange);
}

export function calculateEpisodePriority(
  data: InterrogationRequestType,
  rule: Rule
): RuleCalculation {
  const episodeTypes = Array.isArray(rule.rules?.position?.episode)
    ? rule.rules?.position?.episode
    : [rule.rules?.position?.episode];
  const ranges = transformRanges2<EpisodeRanges>(rule.rules?.valueRange || {});
  const issues: { field_path: string[]; message: string }[] = [];
  const episodes = data.transmission?.episodes || [];

  const affectedEpisodes = episodes
    .filter((episode) => {
      const episodeType = episode.type as
        | MDC_IDC_ENUM_EPISODE_TYPE
        | ENUM_EPISODE_VIRTUAL_TYPE;

      if (!episodeTypes.includes(episodeType)) {
        return false;
      }

      if (
        ranges &&
        ranges.duration &&
        (ranges.duration.min === undefined || ranges.duration.max === undefined)
      ) {
        return false;
      }

      if (episodeTypes.includes(episodeType)) {
        issues.push({
          field_path: ["type"],
          message: `Type ${episodeType} is not allowed for this rule, allowed types are ${episodeTypes.join(
            ", "
          )}`,
        });
      }

      const duration = episode.duration;
      const durationRange = ranges?.duration || null;
      const excludeNulls = ranges.excludeNullDuration || false;

      if (
        duration === undefined ||
        duration === null ||
        durationRange === null
      ) {
        if (excludeNulls) {
          return false;
        }
      } else {
        const numDuration = Number(duration);

        if (numDuration < durationRange.min) {
          issues.push({
            field_path: ["duration"],
            message: `Duration is smaller than the minimum range ${durationRange.min}, it is ${numDuration}`,
          });
        } else if (numDuration > durationRange.max) {
          issues.push({
            field_path: ["duration"],
            message: `Duration exceeds the maximum range ${durationRange.max}, it is ${numDuration}`,
          });
        }
      }

      const detectionTherapyDetails = episode.detectionTherapyDetails || "";
      const detectionTherapy = ranges.detectionTherapy || [];

      if (!stringOperationApplies(detectionTherapy, detectionTherapyDetails)) {
        issues.push({
          field_path: ["detectionTherapyDetails"],
          message: `Detection therapy details do not match the required criteria`,
        });
      }

      if (ranges.treated !== undefined && ranges.treated !== null) {
        const therapyResult = episode.therapyResult === "Successful";
        if (therapyResult !== ranges.treated) {
          issues.push({
            field_path: ["therapyResult"],
            message: `Therapy result does not match the required criteria`,
          });
        }
      }

      if (
        ranges.episodeID &&
        !stringOperationApplies(ranges.episodeID, episode.episodeId)
      ) {
        issues.push({
          field_path: ["episodeId"],
          message: `Episode ID does not match the required criteria`,
        });
      }

      return true;
    })
    .map((episode) => episode.date);

  const calculatedPriority =
    affectedEpisodes.length > 0 ? rule.priority ?? 0 : 0;

  return {
    ruleID: rule.id,
    priority: calculatedPriority,
    type: rule.type,
    issues,
  };
}

function stringOperationApplies(
  operations: StringOperation | StringOperation[],
  str: string
): boolean {
  if (!operations) return true;
  if (!Array.isArray(operations)) operations = [operations];
  operations = operations.filter(
    (operator) => operator?.operator && operator?.content
  );
  if (!str || !str.toLowerCase || !operations.length) {
    return true;
  }

  str = str.toLowerCase();
  const result = operations.reduce((result, operator) => {
    const applies = stringOperationItemApplies(operator, str);
    if (result !== true && result !== false) {
      return applies;
    } else {
      if (operator.operator === "not" || operator.operator === "not contains") {
        return result && applies;
      } else {
        return result || applies;
      }
    }
  }, {});
  return !!result;
}

function stringOperationItemApplies(
  operation: StringOperation,
  str: string
): boolean {
  if (
    !operation ||
    !operation.content ||
    !operation.operator ||
    !str ||
    !str.toLowerCase ||
    !operation.content.toLowerCase
  ) {
    return true;
  }
  const content = operation.content.toLowerCase();
  const splitContent = content.split(";").filter(Boolean);
  switch (operation.operator) {
    case "is":
      return splitContent.some((content) => str === content.trim());
    case "not":
      return splitContent.every((content) => str !== content.trim());
    case "contains":
      return splitContent.some((content) => str.indexOf(content.trim()) >= 0);
    case "not contains":
      return splitContent.every((content) => str.indexOf(content.trim()) < 0);
  }
}
