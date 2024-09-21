import { PrismaClient } from '@prisma/client';

type PrismaModels = {
  [K in keyof PrismaClient]: PrismaClient[K] extends {
    findUnique: Function;
    findMany: Function;
    create: Function;
    update: Function;
    delete: Function;
  } ? K : never
}[keyof PrismaClient];

export class GenericRepository<Model extends PrismaModels> {
  protected prisma: PrismaClient;
  protected model: Model;

  constructor(prisma: PrismaClient, model: Model) {
    this.prisma = prisma;
    this.model = model;
  }

  async findById(id: string) {
    return (this.prisma[this.model] as any).findUnique({
      where: { id },
    });
  }

  async findAll() {
    return (this.prisma[this.model] as any).findMany();
  }

  async create(data: any) {
    console.log('Data to create:', data); 
    return (this.prisma[this.model] as any).create({
      data,
    });
  }

  async update(id: string, data: any) {
    return (this.prisma[this.model] as any).update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return (this.prisma[this.model] as any).delete({
      where: { id },
    });
  }
}