import { FastifyInstance } from 'fastify';
import { InterrogationPriorityCalculationService } from '../services/InterrogationPriorityCalculationService';
import { InterrogationPriorityCalculationController } from '../controllers/InterrogationPriorityCalculation';
import { PrismaClient } from '@prisma/client';
import { CalculatePriorityRequest } from '../controllers/InterrogationPriorityCalculation';

interface BulkCalculatePriorityRequest {
  transmissions: CalculatePriorityRequest[];
}

export default async function interrogationPriorityCalculationRoutes(server: FastifyInstance) {
  const prisma = new PrismaClient();
  const interrogationPriorityCalculationService = new InterrogationPriorityCalculationService(prisma);
  const interrogationPriorityCalculationController = new InterrogationPriorityCalculationController(
    interrogationPriorityCalculationService,
    prisma
  );
  
  server.get<{ Params: { transmissionId: string } }>('/calculations/transmission/:transmissionId', async (request, reply) => {
    await interrogationPriorityCalculationController.getCalculationsByTransmissionId(request, reply);
  });

  server.get<{ Params: { ruleId: string } }>('/calculations/rule/:ruleId', async (request, reply) => {
    await interrogationPriorityCalculationController.getCalculationsByRuleId(request, reply);
  });

  server.post<{ Body: BulkCalculatePriorityRequest }>('/calculations', async (request, reply) => {
    await interrogationPriorityCalculationController.calculatePriorityAndCreate(request, reply);
  });  

  server.delete<{ Params: { id: string } }>('/calculations/:id', async (request, reply) => {
    await interrogationPriorityCalculationController.deleteCalculation(request, reply);
  });
}
