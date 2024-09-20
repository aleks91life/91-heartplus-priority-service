import { Static, Type } from '@sinclair/typebox';

export const InterrogationRequest = Type.Object({
    InterrogationId: Type.String({ maxLength: 34 }),
    Data: Type.Any(),
});

export type InterrogationRequestType = Static<typeof InterrogationRequest>;





export const CreatePriorityRuleSchema = Type.Object({
    type: Type.String(),
    priority: Type.Number(),
    patientRules: Type.Object({}, { additionalProperties: true }),
    interrogationRules: Type.Object({}, { additionalProperties: true }),
    rules: Type.Object({}, { additionalProperties: true }),
    user: Type.String(),
    tags: Type.Optional(Type.Object({}, { additionalProperties: true })),
});

export const UpdatePriorityRuleSchema = Type.Partial(CreatePriorityRuleSchema);

export type CreatePriorityRuleType = Static<typeof CreatePriorityRuleSchema>;
export type UpdatePriorityRuleType = Static<typeof UpdatePriorityRuleSchema>;