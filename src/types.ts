import { Static, Type } from '@sinclair/typebox';

export enum Status {
    active = 'ACTIVE',
    historical = 'HISTORICAL',
}
export const InterrogationRequest = Type.Object({
    InterrogationId: Type.String({ maxLength: 34 }),
    Data: Type.Any(),
});


export const PriorityRule = Type.Object({
    user: Type.String(),
    type: Type.String(),
    name: Type.String(),
    description: Type.String(),
    rules: Type.Any(), 
    patientRules: Type.Any(), 
    interrogationRules: Type.Any(), 
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.String({ format: 'date-time' }),
    status: Type.Enum(Status),
    patientSpecific: Type.Boolean(),
    priority: Type.String(),
    parentId: Type.Optional(Type.String()),
  });


 export type Issue = {
    fieldName: string,
    value: string
  }
 export type PriorityRuleCause = {
    type: string[],
    issues: Issue[]
  }


  export interface EpisodeRule  {
    type: 'episode',
    rules: EpisodeRuleData
}

export interface RuleData {
    position: any,
    valueRange: any,
}


export interface LeadRuleData extends RuleData 
{
    position: {
        chamber?: string[]
        measurement?: string
    },
    valueRange: {
        duration_min?: number,
        duration_max?: number,
        amplitude_Min?: number,
        amplitude_Max?: number,
        pulseWidth_min?: number,
        pulseWidth_max?: number,
        valueMin?: number,
        valueMax?: number
        polarity?: string
    },

}
export interface EpisodeRuleData extends RuleData {
    position: {
        episode?: string[]
    },
    valueRange: {
        duration_min?: string,
        duration_max?: string,
        treated?: boolean,
        excludeNullDuration?: boolean,
        detectionTherapy?: StringOperation | StringOperation[]
        episodeID?: StringOperation | StringOperation[]
    },
}

export interface StringOperation {
    operator: "not" | "is" | "contains" | "not contains",
    content: string
}
export type PriorityRuleType = Static<typeof PriorityRule>;
export const PartialPriorityRule = Type.Partial(PriorityRule);
export type InterrogationRequestType = Static<typeof InterrogationRequest>;
