import { FastifyReply, FastifyRequest } from 'fastify';
import { PriorityService } from '../services/PriorityService';
import { Priority, Prisma } from '@prisma/client';

interface GetPrioritiesByUserParams {
  user: string;
}

interface GetPrioritiesByStatusParams {
  status: 'ACTIVE' | 'DEACTIVE';
}

interface DeletePriorityParams {
  id: string;
}

export class PriorityController {
  private priorityService: PriorityService;

  constructor(priorityService: PriorityService) {
    this.priorityService = priorityService;
  }

  async getPrioritiesByUser(request: FastifyRequest<{ Params: GetPrioritiesByUserParams }>, reply: FastifyReply): Promise<void> {
    try {
      const { user } = request.params;
      const priorities = await this.priorityService.getPrioritiesByUser(user);
      reply.send(priorities);
    } catch (error) {
      reply.status(500).send({ error: 'Failed to fetch priorities' });
    }
  }

  async getPrioritiesByStatus(request: FastifyRequest<{ Params: GetPrioritiesByStatusParams }>, reply: FastifyReply): Promise<void> {
    try {
      const { status } = request.params;
      const priorities = await this.priorityService.getPrioritiesByStatus(status);
      reply.send(priorities);
    } catch (error) {
      reply.status(500).send({ error: 'Failed to fetch priorities' });
    }
  }

  async createPriority(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const data = request.body as Omit<Priority, 'id' | 'created_at' | 'updated_at'>;

      const priority = await this.priorityService.createPriority(data);
      reply.status(201).send(priority);
    } catch (error) {
      console.error('Create Priority Error:', error);
      reply.status(500).send({ error: 'Failed to create priority', details: error instanceof Error ? error.message : '' });    }
  }

  async updatePriority(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply): Promise<void> {
    try {
      const { id } = request.params;
      const data = request.body as Partial<Priority>;

       if (!data.priority) {
        reply.status(400).send({ error: 'Priority level is required' });
        return;
      }

      const updatedPriority = await this.priorityService.updatePriority(id, data);
      console.log('Updating priority with data:', updatedPriority);

      reply.send(updatedPriority);
    } catch (error) {
      reply.status(500).send({ error: 'Failed to update priority', details: error instanceof Error ? error.message : '' });
    }
  }

  async deletePriority(request: FastifyRequest<{ Params: DeletePriorityParams }>, reply: FastifyReply): Promise<void> {
    try {
      const { id } = request.params;
      const priority = await this.priorityService.deletePriority(id);
      reply.send(priority);
    } catch (error) {
      reply.status(500).send({ error: 'Failed to delete priority' });
    }
  }
}
