import fp from 'fastify-plugin';
import { InterrogationRequest, InterrogationRequestType } from '../types';
import { debug, logger } from '../utils';
import { FastifyPluginCallback } from 'fastify';

export default fp(async (server, opts) => {
    return server.route<{ Body: InterrogationRequestType }>({
        url: '/interrogation',
        logLevel: 'warn',
        method: ['POST'],
        schema: {
            body: InterrogationRequest,
        },
        async handler(request, reply) {
            const body = request.body;

            const interrogationId = body.InterrogationId;
            try {
                return reply.send(`Interrogation ${interrogationId} received`);
            } catch (e: any) {
                logger.error('Error calculating priority for interrogation ID ' + interrogationId, e);
                return reply.status(500).send('Internal Server Error');
            }
        },
    });
}) as FastifyPluginCallback;
