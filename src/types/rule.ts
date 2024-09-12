import { InterrogationRequestType } from "../types";
import {
  MDC_IDC_DISC_CHAMBER,
  MDC_IDC_ENUM_BATTERY_STATUS,
  ENUM_EPISODE_VIRTUAL_TYPE,
  MDC_IDC_ENUM_EPISODE_TYPE,
} from "./enums";

const ruleTypes = [
  "episode",
  "lead",
  "battery",
  "other",
  "pacing",
  "stel",
] as const;
export type RuleType = (typeof ruleTypes)[number];

export interface RuleBasic {
  id: string;
  name: string;
  description: string;
  hospitalId: string;
  active: boolean;
  type: RuleType;
  data: {
    filters: {
      excludedPatients?: string[];
      prisma: any;
    };
    valueRange?: any;
    position?: any;
    tags?: string[];
  };
  patientId: { id: string };
  patientSpecific?: boolean;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PacingRule extends RuleBasic {
  type: "pacing";
  data: {
    filters: {
      excludedPatients?: string[];
      prisma: any;
    };
    valueRange: {
      value_min?: string;
      value_max?: string;
    };
    position: {
      chamber: string[];
    };
    tags?: string[];
  };
}

export interface StringOperation {
  operator: "not" | "is" | "contains" | "not contains";
  content: string;
}
export interface OtherRule extends RuleBasic {
  type: "other";
}
export interface EpisodeRule extends RuleBasic {
  type: "episode";
  data: {
    filters: RuleBasic["data"]["filters"] & {
      firstEpisode?: boolean;
    };
    valueRange: {
      duration_min?: string;
      duration_max?: string;
      treated?: boolean;
      excludeNullDuration?: boolean;
      detectionTherapy?: StringOperation | StringOperation[];
      episodeID?: StringOperation | StringOperation[];
    };
    position: {
      episode:
        | (MDC_IDC_ENUM_EPISODE_TYPE | ENUM_EPISODE_VIRTUAL_TYPE)[]
        | MDC_IDC_ENUM_EPISODE_TYPE
        | ENUM_EPISODE_VIRTUAL_TYPE;
    };
    tags?: string[];
  };
}

export interface BatteryRule extends RuleBasic {
  type: "battery";
  data: {
    filters: RuleBasic["data"]["filters"];
    valueRange: {
      voltage_min?: string;
      voltage_max?: string;
      impedance_min?: string;
      impedance_max?: string;
      remainingPercentage_min?: string;
      remainingPercentage_max?: string;
      remainingLongevity_min?: string;
      remainingLongevity_max?: string;
    };
    position: {
      status: MDC_IDC_ENUM_BATTERY_STATUS[];
    };
    tags?: string[];
  };
}

export interface LeadThresholdRule extends RuleBasic {
  type: "lead";
  data: {
    filters: RuleBasic["data"]["filters"];
    valueRange: {
      amplitude_min?: string;
      amplitude_max?: string;
      pulseWidth_min?: string;
      pulseWidth_max?: string;
      polarity: string[];
    };
    position: {
      chamber: MDC_IDC_DISC_CHAMBER[];
      measurement: "threshold";
    };
    tags?: string[];
  };
}

export interface LeadImpedanceRule extends RuleBasic {
  type: "lead";
  data: {
    filters: RuleBasic["data"]["filters"];
    valueRange: {
      value_min?: string;
      value_max?: string;
      polarity: string[];
    };
    position: {
      chamber: MDC_IDC_DISC_CHAMBER[];
      measurement: "impedance";
    };
    tags?: string[];
  };
}

export interface LeadSensingRule extends RuleBasic {
  type: "lead";
  data: {
    filters: RuleBasic["data"]["filters"];
    valueRange: {
      amplitude_min?: string;
      amplitude_max?: string;
      polarity: string[];
    };
    position: {
      chamber: MDC_IDC_DISC_CHAMBER[];
      measurement: "sensing";
    };
    tags?: string[];
  };
}

export interface LeadHVImpedanceRule extends RuleBasic {
  type: "lead";
  data: {
    filters: RuleBasic["data"]["filters"];
    valueRange: {
      impedance_min?: string;
      impedance_max?: string;
    };
    position: {
      chamber: MDC_IDC_DISC_CHAMBER[];
      location?: string[]; // ("RV" | "SVC" | "null")[],
      measurement: "hvimpedance";
    };
    tags?: string[];
  };
}

export interface StelRule extends RuleBasic {
  type: "stel";
  data: {
    filters: RuleBasic["data"]["filters"];
    valueRange: {
      glucose_min?: string | number;
      glucose_max?: string | number;
      spo2_min?: string | number;
      spo2_max?: string | number;
      weight_min?: string | number;
      weight_max?: string | number;
      dia_min?: string | number;
      dia_max?: string | number;
      sys_min?: string | number;
      sys_max?: string | number;
      bpm_min?: string | number;
      bpm_max?: string | number;
    };
    tags?: string[];
  };
}

export type LeadRule =
  | LeadHVImpedanceRule
  | LeadImpedanceRule
  | LeadSensingRule
  | LeadThresholdRule;

export type RuleObject =
  | LeadRule
  | EpisodeRule
  | BatteryRule
  | PacingRule
  | OtherRule
  | StelRule;

export interface FilterRow {
  fieldName?: string[];
  operator?: "between" | " " | "_gt" | "_lt" | "_not";
  value?: string;
}

export interface FilterRule {
  qualifier: "any" | "all";
  searchState: FilterRow[];
}

type RuleCalculation = {
  ruleID: string;
  interrogationID: string;
  priority: 1 | 2 | 3;
  issues: {
    field_path: string[];
    value: any;
  }[];
};

export interface InterpretRule<TRule extends RuleObject = RuleObject> {
  (rule: TRule, interrogations?: InterrogationRequestType[]): Promise<
    RuleCalculation[]
  >;
}
