import fp from 'fastify-plugin';
import { PriorityRule, PriorityRuleType, PartialPriorityRule, Status } from '../types';
import { createPriorityRule, deleteRule, getActivePriorityRules, updateRule, getRuleById } from '../data/priorityRulesQueries';
import { FastifyPluginCallback } from 'fastify';
import { getPriority } from 'os';

export default fp(async (server, opts) => {
    server.route<{ Body: PriorityRuleType }>({
        url: '/priority-rule',
        method: 'POST',
        schema: {
            body: PriorityRule,  
        },
        async handler(request, reply) {
            const body = request.body;
            try {
                const createdRule = await createPriorityRule(body); 
                return reply.status(201).send(createdRule);
            } catch (e: any) {
                server.log.error('Error creating priority rule', e);
                return reply.status(500).send( e);
            }
        },
    });

    server.route({
        url: '/priority-rules/active',
        method: 'GET',
        async handler(_request, reply) {
            try {
                const activeRules = await getActivePriorityRules(); 
                return reply.status(200).send(activeRules);
            } catch (e: any) {
                server.log.error('Error fetching active priority rules', e);
                return reply.status(500).send('Internal Server Error');
            }
        },
    });

    server.route<{ Params: { ruleId: string }, Body: Partial<PriorityRuleType> }>({
        url: '/priority-rule/:ruleId',
        method: 'PUT',
        schema: {
          params: {
            type: 'object',
            properties: {
              ruleId: { type: 'string' },
            },
            required: ['ruleId'],
          },
          body: PartialPriorityRule, 
        },
        async handler(request, reply) {
          const { ruleId } = request.params;
          const updatedData = request.body;
          try {
              const oldRule = await getRuleById(ruleId);
          
              if (!oldRule) {
                throw new Error('Rule not found');
              }
              const newRuleData = {
                user: updatedData.user ?? oldRule.user,
                type: updatedData.type ?? oldRule.type,
                name: updatedData.name ?? oldRule.name,
                description: updatedData.description ?? oldRule.description,
                rules: updatedData.rules ?? oldRule.rules,
                patientRules: updatedData.patientRules ?? oldRule.patientRules,
                interrogationRules: updatedData.interrogationRules ?? oldRule.interrogationRules,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                status: Status.active,
                patientSpecific: updatedData.patientSpecific ?? oldRule.patientSpecific,
                priority: updatedData.priority ?? oldRule.priority,
                parentId: ruleId, 
              };
          
            await updateRule(ruleId, newRuleData);
            return reply.status(200).send({ message: 'Rule updated successfully' });
          } catch (e: any) {
            server.log.error('Error updating priority rule', e);
            return reply.status(500).send(e.message); 
          }
        },
      });

      server.route<{ Params: { ruleId: string } }>({
        url: '/priority-rule/:ruleId',
        method: 'DELETE',
        schema: {
          params: {
            type: 'object',
            properties: {
              ruleId: { type: 'string' },
            },
            required: ['ruleId'],
          },
        },
        async handler(request, reply) {
          const { ruleId } = request.params;
          try {
            await deleteRule(ruleId);
            return reply.status(200).send({ message: 'Rule deleted successfully' });
          } catch (e: any) {
            server.log.error('Error deleting priority rule', e);
            return reply.status(500).send(e.message); 
          }
        },
      });

}) as FastifyPluginCallback;
