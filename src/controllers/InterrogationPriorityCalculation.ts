import { FastifyReply, FastifyRequest } from 'fastify';
import { InterrogationPriorityCalculationService } from '../services/InterrogationPriorityCalculationService';
import { PrismaClient } from '@prisma/client';
import { determinePriorityAndLog } from '../services/priorityCalculator';
import { Priority } from '../entities/Priority';
import { v4 as uuidv4 } from 'uuid';

interface GetCalculationsByTransmissionIdParams {
  transmissionId: string;
}

interface GetCalculationsByRuleIdParams {
  ruleId: string;
}

interface DeleteCalculationParams {
  id: string;
}

export interface CalculatePriorityRequest {
  transmissions: any;
}

interface BulkCalculatePriorityRequest {
  transmissions: CalculatePriorityRequest[];
}


export class InterrogationPriorityCalculationController {
  private interrogationPriorityCalculationService: InterrogationPriorityCalculationService;
  private prisma: PrismaClient;

  constructor(interrogationPriorityCalculationService: InterrogationPriorityCalculationService, prisma: PrismaClient) {
    this.interrogationPriorityCalculationService = interrogationPriorityCalculationService;
    this.prisma = prisma;
  }

  async getCalculationsByTransmissionId(
    request: FastifyRequest<{ Params: GetCalculationsByTransmissionIdParams }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const { transmissionId } = request.params;
      const calculations = await this.interrogationPriorityCalculationService.getCalculationsByTransmissionId(transmissionId);
      reply.send(calculations);
    } catch (error) {
      reply.status(500).send({ error: 'Failed to fetch calculations' });
    }
  }

  async getCalculationsByRuleId(
    request: FastifyRequest<{ Params: GetCalculationsByRuleIdParams }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const { ruleId } = request.params;
      const calculations = await this.interrogationPriorityCalculationService.getCalculationsByRuleId(ruleId);
      reply.send(calculations);
    } catch (error) {
      reply.status(500).send({ error: 'Failed to fetch calculations' });
    }
  }

  async calculatePriorityAndCreate(
    request: FastifyRequest<{ Body: BulkCalculatePriorityRequest }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const transmissions = request.body;
  
      if (!Array.isArray(transmissions)) {
        reply.status(400).send({ error: 'Invalid input: transmissions must be an array' });
        return;
      }
  
      const rulesTable = await this.prisma.priority.findMany();
  
      const typedRulesTable = rulesTable.map(rule => ({
        ...rule,
        patient_rules: rule.patient_rules as { [key: string]: any; excludedPatients?: string[]; includedPatients?: string[]; qualifier: 'any' | 'all'; },
        interrogation_rules: rule.interrogation_rules as { [key: string]: any; qualifier: 'any' | 'all'; },
        rules: rule.rules as { [key: string]: any }
      })) as Priority[];
  
      for (const transmissionObj of transmissions) {
        const transmission = transmissionObj.transmission;
        console.log('Calculating priority for transmission:', transmission);
        if (!transmission || !transmission.patient || !transmission.patient.id) {
          console.error('Invalid transmission structure:', JSON.stringify(transmission, null, 2));
          continue; // Skip to the next iteration
      }
        const priorityCalculations = await determinePriorityAndLog(transmission, typedRulesTable, this.interrogationPriorityCalculationService);
        console.log('Priority Calculations:', priorityCalculations);
  
        console.log('Priority Calculations before processing:', priorityCalculations);

        for (const calculation of priorityCalculations) {
          console.log(`Processing calculation: ${JSON.stringify(calculation)}`);
          if (!calculation) {
            console.error('Calculation is undefined for this transmission');
            continue; // Skip to the next iteration if calculation is undefined
          }
          if (!calculation || !calculation.id || !calculation.transmission_id || !calculation.rule_id) {
            console.error('Missing data in calculation:', calculation);
            continue; // Skip this calculation
          }
          
          // Check which IDs are present
          console.log(`calculation.id: ${calculation.id}`);
          console.log(`calculation.transmission_id: ${calculation.transmission_id}`);
          console.log(`calculation.rule_id: ${calculation.rule_id}`);
  
          // Ensure id is assigned
          calculation.id = calculation.id || uuidv4();
  
          if (!calculation.transmission_id || !calculation.rule_id) {
            throw new Error('Missing transmission_id or rule_id in calculation');
          }
  
          await this.interrogationPriorityCalculationService.createCalculation({
            id: calculation.id,
            transmission_id: calculation.transmission_id,
            rule_id: calculation.rule_id,
            cause: calculation.cause || 'Some cause', // Ensure cause is defined
            status: calculation.status || 'ACTIVE', // Default to ACTIVE if not defined
            highestPriority: calculation.highestPriority || 'LOW', // Default value if not defined
          });
        }
      }
  
      reply.status(201).send({ message: 'Priority calculations created successfully' });
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error in calculatePriorityAndCreate:', error.message);
        reply.status(500).send({ error: 'Failed to calculate priority and create entries', details: error.message });
      } else {
        console.error('Unknown error in calculatePriorityAndCreate:', error);
        reply.status(500).send({ error: 'Failed to calculate priority and create entries', details: 'Unknown error occurred' });
      }
    }
  }

  async deleteCalculation(
    request: FastifyRequest<{ Params: DeleteCalculationParams }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const { id } = request.params;
      const calculation = await this.interrogationPriorityCalculationService.deleteCalculation(id);
      reply.send(calculation);
    } catch (error) {
      reply.status(500).send({ error: 'Failed to delete calculation' });
    }
  }
}