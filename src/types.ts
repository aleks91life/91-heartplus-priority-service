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

  
export type PriorityRuleType = Static<typeof PriorityRule>;
export const PartialPriorityRule = Type.Partial(PriorityRule);
export type InterrogationRequestType = Static<typeof InterrogationRequest>;
