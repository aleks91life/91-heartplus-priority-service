import { FastifyInstance } from 'fastify';
import { PriorityService } from '../services/PriorityService';
import { PriorityController } from '../controllers/PriorityController';
import { PrismaClient } from '@prisma/client';
import { request } from 'http';

export default async function priorityRoutes(server: FastifyInstance) {
  const prisma = new PrismaClient();
  const priorityService = new PriorityService(prisma);
  const priorityController = new PriorityController(priorityService);

  server.get<{ Params: { user: string } }>('/priorities/user/:user', async (request, reply) => {
    await priorityController.getPrioritiesByUser(request, reply);
  });

  server.get<{ Params: { status: 'ACTIVE' | 'DEACTIVE' } }>('/priorities/status/:status', async (request, reply) => {
    await priorityController.getPrioritiesByStatus(request, reply);
  });

  server.post('/priorities', async (request, reply) => {
    await priorityController.createPriority(request, reply);
  });

  server.patch<{ Params: { id: string } }>('/priorities/:id', async (request, reply) => {
    await priorityController.updatePriority(request, reply);
  });

  server.delete<{ Params: { id: string } }>('/priorities/:id', async (request, reply) => {
    await priorityController.deletePriority(request, reply);
  });
}
