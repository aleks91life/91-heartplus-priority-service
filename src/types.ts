import { Static, Type } from '@sinclair/typebox';

export const InterrogationRequest = Type.Object({
    InterrogationId: Type.String({ maxLength: 34 }),
    Data: Type.Any(),
});

export type InterrogationRequestType = Static<typeof InterrogationRequest>;
