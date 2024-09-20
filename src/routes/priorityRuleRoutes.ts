import fp from 'fastify-plugin';
import { FastifyPluginCallback } from 'fastify';
import { PriorityRuleService } from '../services/priorityRuleService';
import { Prisma, PriorityRule } from '@prisma/client';
import { logger } from '../utils';
import { CreatePriorityRuleSchema, UpdatePriorityRuleSchema, CreatePriorityRuleType, UpdatePriorityRuleType } from '../types';

const priorityRuleService = new PriorityRuleService(); //   IOC

// Type guard to check if the input data matches Prisma.PriorityRuleCreateInput
// function isPriorityRuleCreateInput(data: any): data is Prisma.PriorityRuleCreateInput {
//     return (
//         typeof data.type === 'string' &&
//         typeof data.priority === 'number' &&
//         typeof data.patientRules === 'object' &&
//         typeof data.interrogationRules === 'object' &&
//         typeof data.rules === 'object' &&
//         (typeof data.status === 'string' || data.status === undefined) &&
//         (typeof data.user === 'string' || data.user === undefined) &&
//         (typeof data.patientSpecific === 'boolean' || data.patientSpecific === undefined) &&
//         (typeof data.tags === 'object' || data.tags === undefined)
//     );
// }

const priorityRuleRoutes: FastifyPluginCallback = async (server, opts) => {
    // POST: Create a new priority rule
    server.route<{ Body: CreatePriorityRuleType }>({
        url: '/priority-rule',
        method: 'POST',
        schema: {
            body: CreatePriorityRuleSchema,
        },
        async handler(request, reply) {
            try {

                // const priorityRuleData = {
                //     ...request.body,
                //     status: 'active',
                // };


                const priorityRule = await priorityRuleService.createPriorityRule(request.body);
                return reply.status(201).send(priorityRule);
            } catch (error) {
                logger.error('Error creating priority rule:', error);
                return reply.status(500).send('Internal Server Error');
            }
        },
    });

    // PUT: Update a priority rule
    server.route<{ Params: { id: string }; Body: UpdatePriorityRuleType }>({
        url: '/priority-rule/:id',
        method: 'PUT',
        schema: {
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                },
                required: ['id'],
            },
            body: UpdatePriorityRuleSchema,
        },
        async handler(request, reply) {
            try {
                const updatedPriorityRule = await priorityRuleService.updatePriorityRule(request.params.id, request.body);
                return reply.send(updatedPriorityRule);
            } catch (error) {
                logger.error('Error updating priority rule:', error);
                return reply.status(500).send('Internal Server Error');
            }
        },
    });

    // GET: Retrieve a priority rule by ID
    server.route<{ Params: { id: string } }>({
        url: '/priority-rule/:id',
        method: 'GET',
        schema: {
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                },
                required: ['id'],
            },
        },
        async handler(request, reply) {
            try {
                const priorityRule = await priorityRuleService.getPriorityRule(request.params.id);
                if (priorityRule) {
                    return reply.send(priorityRule);
                }
                return reply.status(404).send('Priority rule not found');
            } catch (error) {
                server.log.error('Error retrieving priority rule:', error);
                return reply.status(500).send('Internal Server Error');
            }
        },
    });

    // DELETE: Delete a priority rule
    server.route<{ Params: { id: string } }>({
        url: '/priority-rule/:id',
        method: 'DELETE',
        schema: {
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                },
                required: ['id'],
            },
        },
        async handler(request, reply) {
            try {
                const deletedPriorityRule = await priorityRuleService.deletePriorityRule(request.params.id);
                return reply.send(deletedPriorityRule);
            } catch (error) {
                server.log.error('Error deleting priority rule:', error);
                return reply.status(500).send('Internal Server Error');
            }
        },
    });

    // GET: Retrieve all priority rules
    server.route({
        url: '/priority-rules',
        method: 'GET',
        async handler(request, reply) {
            try {
                const priorityRules = await priorityRuleService.getAllPriorityRules();
                return reply.send(priorityRules);
            } catch (error) {
                server.log.error('Error retrieving priority rules:', error);
                return reply.status(500).send('Internal Server Error');
            }
        },
    });
};

export default fp(priorityRuleRoutes);
