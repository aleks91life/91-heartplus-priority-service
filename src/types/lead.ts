import _ from "lodash";
import {
  LeadRule,
  InterpretRule,
  LeadHVImpedanceRule,
  LeadImpedanceRule,
  LeadSensingRule,
  LeadThresholdRule,
} from "./rule";
import { MAX_VALUE, MIN_VALUE, notEmpty } from "../types";

import crypto from "crypto";

function generateHash(data: string): string {
  return crypto.createHash("sha256").update(data).digest("hex");
}

export interface ValueInterval {
  min: number;
  max: number;
}

export const interpretLead: InterpretRule<LeadRule> = async (
  rule,
  interrogations
) => {
  try {
    const measurement = rule.data.position.measurement;
    switch (measurement) {
      case "hvimpedance":
        return hvImpedanceLead(rule as LeadHVImpedanceRule, interrogations);
      case "threshold":
        return thresholdLead(rule as LeadThresholdRule, interrogations);
      case "sensing":
        return sensingLead(rule as LeadSensingRule, interrogations);
      case "impedance":
        return impedanceLead(rule as LeadImpedanceRule, interrogations);
      default:
        console.error(`Wrong type of lead measurement: ${measurement}`);
        throw new Error(`Wrong type of lead measurement: ${measurement}`);
    }
  } catch (error) {
    console.error(`Error while interpreting lead rule`, {
      rule,
      error,
    });
    throw error;
  }
};

export const catchError = (err) => {
  console.error(err);
  return [] as any[];
};

const thresholdLead: InterpretRule<LeadThresholdRule> = async function (
  rule,
  interrogations
) {
  const polarityRange: string[] = (
    Array.isArray(rule.data.valueRange.polarity)
      ? rule.data.valueRange.polarity
      : [rule.data.valueRange.polarity]
  ).filter(Boolean);
  const amplitudeRange: ValueInterval = {
    min: parseFloat(rule.data.valueRange.amplitude_min!) || MIN_VALUE,
    max: parseFloat(rule.data.valueRange.amplitude_max!) || MAX_VALUE,
  };
  const pulseRange: ValueInterval = {
    min: parseFloat(rule.data.valueRange.pulseWidth_min!) || MIN_VALUE,
    max: parseFloat(rule.data.valueRange.pulseWidth_max!) || MAX_VALUE,
  };
  const issues: { field_name: string[]; value: number }[] = [];
  const affected = interrogations
    ?.filter(notEmpty)
    .map((interrogation) => {
      try {
        if (!interrogation || !interrogation.measurements) {
          return null;
        }

        const affectedIDs = (
          interrogation.measurements!.leadChannelMeasurements || []
        )
          .map((measurement = <any>{}) => {
            const chamber: string[] = rule.data.position.chamber;
            const pacingThreshold = measurement.pacingThreshold || <any>{};
            if (
              measurement.chamber &&
              chamber.indexOf(measurement.chamber) < 0
            ) {
              return false;
            }

            const amplitude: number = parseFloat(pacingThreshold.amplitude);
            const pulseWidth: number = parseFloat(pacingThreshold.pulseWidth);

            if (!amplitude || !pulseWidth) return false;

            const polarityAllowed: boolean = polarityRange.length
              ? polarityRange.includes(pacingThreshold.polarity)
              : true;

            if (
              amplitudeRange.min >= amplitude ||
              amplitudeRange.max <= amplitude
            ) {
              issues.push({
                field_name: ["pacingThreshold", "amplitude"],
                value: amplitude,
              });
            }
            if (pulseRange.min >= pulseWidth || pulseRange.max <= pulseWidth) {
              issues.push({
                field_name: ["pacingThreshold", "pulseWidth"],
                value: pulseWidth,
              });
            }
            if (!polarityAllowed) {
              issues.push({
                field_name: ["pacingThreshold", "polarity"],
                value: pacingThreshold.polarity,
              });
            }

            if (
              issues.length === 0 &&
              amplitudeRange.min < amplitude &&
              amplitudeRange.max > amplitude &&
              pulseRange.min < pulseWidth &&
              pulseRange.max > pulseWidth &&
              polarityAllowed
            ) {
              const measurementData = JSON.stringify({
                chamber: measurement.chamber,
                amplitude,
                pulseWidth,
                polarity: pacingThreshold.polarity,
              });
              return generateHash(measurementData);
            }
          })
          .filter(Boolean);

        if (affectedIDs.length > 0) {
          const interrogationHash = generateHash(JSON.stringify(interrogation));

          return {
            interrogationID: interrogationHash,
            affectedIDs,
            issues,
          };
        }
      } catch (err) {
        console.error(
          `Threshold lead, interrogation id: ${generateHash(
            JSON.stringify(interrogation)
          )}`,
          err
        );
        return null;
      }
    })
    .filter(notEmpty);

  const ids = affected?.map((interr) => interr.interrogationID) || [];
  const issuesD = _.flatten(affected?.map((interr) => interr.issues));

  return ids.map((id) => ({
    ruleID: rule.id,
    interrogationID: id,
    priority: rule.priority as 1 | 2 | 3,
    issues: issuesD,
  }));
};

const impedanceLead: InterpretRule<LeadImpedanceRule> = async function (
  rule,
  interrogations
) {
  const chamber: string[] = rule.data.position.chamber;
  const impedanceRange: ValueInterval = {
    min: parseFloat(rule.data.valueRange.value_min!) || MIN_VALUE,
    max: parseFloat(rule.data.valueRange.value_max!) || MAX_VALUE,
  };
  const polarityRange: string[] = (
    Array.isArray(rule.data.valueRange.polarity)
      ? rule.data.valueRange.polarity
      : [rule.data.valueRange.polarity]
  ).filter(notEmpty);
  const issues: { field_name: string[]; value: any }[] = [];
  const affected = interrogations
    ?.filter(notEmpty)
    .map((interrogation) => {
      try {
        if (!interrogation || !interrogation.measurements) {
          return null;
        }
        const affectedIDs = (
          interrogation.measurements!.leadChannelMeasurements || []
        )
          .map((measurement) => {
            if (
              measurement.chamber &&
              chamber.indexOf(measurement.chamber) < 0
            ) {
              return false;
            }
            if (!measurement.impedance) return false;
            const impedance = <number>measurement.impedance!.value;
            if (impedance === null) return false;
            const polarity = measurement.impedance
              ? measurement.impedance.polarity
              : "";
            const polarityAllowed: boolean = polarityRange.length
              ? polarityRange.indexOf(polarity!) >= 0
              : true;

            if (
              impedanceRange.min >= impedance ||
              impedanceRange.max <= impedance
            ) {
              issues.push({ field_name: ["impedance"], value: impedance });
            }
            if (!polarityAllowed) {
              issues.push({ field_name: ["polarity"], value: polarity });
            }

            if (
              issues.length === 0 &&
              impedanceRange.min < impedance &&
              impedanceRange.max > impedance &&
              polarityAllowed
            ) {
              // Generate a hash for the measurement data
              const measurementData = JSON.stringify({
                chamber: measurement.chamber,
                impedance,
                polarity,
              });

              return generateHash(measurementData);
            }
          })
          .filter(Boolean);
        if (affectedIDs.length > 0) {
          const interrogationHash = generateHash(JSON.stringify(interrogation));
          return {
            interrogationID: interrogationHash,
            affectedIDs,
            issues,
          };
        }
      } catch (err) {
        return null;
      }
    })
    .filter(notEmpty);
  const ids = affected?.map((interr) => interr.interrogationID) || [];
  const issuesD = _.flatten(affected?.map((interr) => interr.issues)) || [];

  return ids.map((id) => ({
    ruleID: rule.id,
    interrogationID: id,
    priority: rule.priority as 1 | 2 | 3,
    issues: issuesD,
  }));
};

const sensingLead: InterpretRule<LeadSensingRule> = async function (
  rule,
  interrogations
) {
  const chamber: string[] = rule.data.position.chamber;
  const amplitudeRange: ValueInterval = {
    min: parseFloat(rule.data.valueRange.amplitude_min!) || MIN_VALUE,
    max: parseFloat(rule.data.valueRange.amplitude_max!) || MAX_VALUE,
  };
  const polarityRange: string[] = (
    Array.isArray(rule.data.valueRange.polarity)
      ? rule.data.valueRange.polarity
      : [rule.data.valueRange.polarity]
  ).filter(Boolean);
  const issues: { field_name: string[]; value: any }[] = [];
  const affected = interrogations
    ?.filter(notEmpty)
    .map((interrogation) => {
      try {
        if (!interrogation || !interrogation.measurements) {
          return null;
        }
        const affectedIDs = (
          interrogation.measurements!.leadChannelMeasurements || []
        )
          .map((measurement = <any>{}) => {
            if (
              measurement.chamber &&
              chamber.indexOf(measurement.chamber) < 0
            ) {
              return false;
            }
            const amplitude: number =
              _.get(measurement, "sensing.intrinsicAmplitudeMean") ||
              _.get(measurement, "sensing.intrinsicAmplitude");
            if (!amplitude) return false;
            const polarity = measurement.sensing
              ? measurement.sensing.polarity
              : "";
            const polarityAllowed: boolean = polarityRange.length
              ? polarityRange.indexOf(polarity!) >= 0
              : true;

            if (
              amplitudeRange.min >= amplitude ||
              amplitudeRange.max <= amplitude
            ) {
              issues.push({
                field_name: ["sensing", "intrinsicAmplitude"],
                value: amplitude,
              });
            }
            if (!polarityAllowed) {
              issues.push({
                field_name: ["sensing", "polarity"],
                value: polarity,
              });
            }

            if (
              issues.length === 0 &&
              amplitudeRange.min < amplitude &&
              amplitudeRange.max > amplitude &&
              polarityAllowed
            ) {
              // Generate a hash for the measurement data
              const measurementData = JSON.stringify({
                chamber: measurement.chamber,
                amplitude,
                polarity,
              });

              return generateHash(measurementData);
            }
          })
          .filter(Boolean);
        if (affectedIDs.length > 0) {
          const interrogationHash = generateHash(JSON.stringify(interrogation));
          return {
            interrogationID: interrogationHash,
            affectedIDs,
            issues,
          };
        }
      } catch (err) {
        console.error(
          `Sensing lead, interrogation id: ${generateHash(
            JSON.stringify(interrogation)
          )}`,
          err
        );
        return null;
      }
    })
    .filter(notEmpty);
  const ids = affected?.map((interr) => interr.interrogationID) || [];
  const issuesD = _.flatten(affected?.map((interr) => interr.issues)) || [];

  return ids.map((id) => ({
    ruleID: rule.id,
    interrogationID: id,
    priority: rule.priority as 1 | 2 | 3,
    issues: issuesD,
  }));
};

const hvImpedanceLead: InterpretRule<LeadHVImpedanceRule> = async function (
  rule,
  interrogations
) {
  const chamber: string[] = rule.data.position.chamber;
  const impedanceRange: ValueInterval = {
    min: parseFloat(rule.data.valueRange.impedance_min!) || MIN_VALUE,
    max: parseFloat(rule.data.valueRange.impedance_max!) || MAX_VALUE,
  };
  const location = rule.data.position.location;
  const issues: { field_name: string[]; value: number }[] = [];
  const affected = interrogations
    ?.filter(notEmpty)
    .map((interrogation) => {
      try {
        if (!interrogation || !interrogation.measurements) {
          return null;
        }
        const affectedIDs = (
          interrogation.measurements!.leadHVChannelMeasurements || []
        )
          .map((measurement) => {
            if (!measurement || measurement.status === null) return false;
            const impedance = <number>measurement.impedance;
            if (!impedance) return false;
            if (
              location?.length &&
              location.indexOf(measurement.location || "null") < 0
            )
              return false;

            if (
              impedanceRange.min >= impedance ||
              impedanceRange.max <= impedance
            ) {
              issues.push({ field_name: ["impedance"], value: impedance });
            }

            if (
              issues.length === 0 &&
              impedanceRange.min < impedance &&
              impedanceRange.max > impedance
            ) {
              // Generate a hash for the measurement data
              const measurementData = JSON.stringify({
                location: measurement.location,
                impedance,
              });

              return generateHash(measurementData);
            }
          })
          .filter(Boolean);
        if (affectedIDs.length > 0) {
          const interrogationHash = generateHash(JSON.stringify(interrogation));
          return {
            interrogationID: interrogationHash,
            affectedIDs,
            issues,
          };
        }
      } catch (err) {
        console.error(
          `Hv Impedance lead, interrogation id: ${generateHash(
            JSON.stringify(interrogation)
          )}`,
          err
        );
        return null;
      }
    })
    .filter(notEmpty);
  const ids = affected?.map((interr) => interr.interrogationID) || [];
  const issuesD = _.flatten(affected?.map((interr) => interr.issues)) || [];

  return ids.map((id) => ({
    ruleID: rule.id,
    interrogationID: id,
    priority: rule.priority as 1 | 2 | 3,
    issues: issuesD,
  }));
};
