import { PrismaClient, Priority, Prisma } from '@prisma/client';

export class PriorityRepository {
  constructor(public prisma: PrismaClient) {}

  async findByUser(user: string): Promise<Priority[]> {
    return this.prisma.priority.findMany({ where: { user } });
  }

  async findByStatus(status: 'ACTIVE' | 'DEACTIVE'): Promise<Priority[]> {
    return this.prisma.priority.findMany({ where: { status } });
  }

  async create(data: Prisma.PriorityCreateInput): Promise<Priority> {
    return this.prisma.priority.create({ data });
  }

  async update(id: string, data: Prisma.PriorityUpdateInput): Promise<Priority> {
    return this.prisma.priority.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Priority> {
    return this.prisma.priority.delete({ where: { id } });
  }
}
