// priorityCalculationRoute.ts
import { FastifyPluginCallback } from 'fastify';
import { calculatePriority } from '../services/calculatePriority'; // Adjust this path to where calculatePriority is located
import { PriorityRuleCause } from '../types';

export const priorityCalculationRoute: FastifyPluginCallback = async (server, opts) => {
    server.route<{ Body: JSON }>({
        url: '/priority-calculate',
        method: 'POST',
        schema: {
            body: { type: 'object' }, // Define the schema for the transmission payload if needed
        },
        async handler(request, reply) {
            const transmission = request.body;
            try {
                const result: undefined | PriorityRuleCause[] = await calculatePriority(transmission);
                if (result) {
                    return reply.status(200).send(result);
                } else {
                    return reply.status(404).send({ message: 'No applicable priority rule found' });
                }
            } catch (e: any) {
                server.log.error('Error calculating priority', e);
                return reply.status(500).send('Internal Server Error');
            }
        },
    });
};

export default priorityCalculationRoute;
