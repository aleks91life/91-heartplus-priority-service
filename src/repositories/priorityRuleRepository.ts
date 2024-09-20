import prisma from '../utils/prismaClient';
import { PriorityRule, Prisma } from '@prisma/client';

export class PriorityRuleRepository {
    async createPriorityRule(data: Prisma.PriorityRuleCreateInput): Promise<PriorityRule> {
        return await prisma.priorityRule.create({ data });
    }

  async getPriorityRule(id: string): Promise<PriorityRule | null> {
    return await prisma.priorityRule.findUnique({ where: { id } });
  }


  async markRuleAsHistorical(id: string): Promise<PriorityRule> {
    try {
        const existingRule = await prisma.priorityRule.findUnique({
          where: { id },
        });
      
        if (!existingRule) {
          throw new Error(`PriorityRule with ID ${id} not found.`);
        }



        return await prisma.priorityRule.update({
            where: { id },
            data: { status: 'historical' },
        });
    } catch (error) {
        console.error('Error marking rule as historical:', error);
        throw error; // Rethrow the error to be caught by the service layer
    }
}


async createUpdatedPriorityRule(parentId: string, data: Prisma.PriorityRuleCreateInput): Promise<PriorityRule> {
  try {
      return await prisma.priorityRule.create({
          data: {
              ...data,
              clone: {
                  connect: { id: parentId }, // Properly referencing the parent rule using the relation syntax
              },
          },
      });
  } catch (error) {
      console.error('Error creating updated priority rule:', error);
      throw error; // Rethrow the error to be caught by the service layer
  }
}





async checkRuleStatus(id: string): Promise<boolean> {
  const rule = await prisma.priorityRule.findUnique({
      where: { id },
      select: { status: true },
  });

  if (!rule) {
      throw new Error(`PriorityRule with ID ${id} not found.`);
  }

  return rule.status === 'active';
}


  // async updatePriorityRule(id: string, data: Prisma.PriorityRuleUpdateInput): Promise<PriorityRule> {
  //   return await prisma.priorityRule.update({ where: { id }, data });
  // }

  // async deletePriorityRule(id: string): Promise<PriorityRule> {
  //   return await prisma.priorityRule.delete({ where: { id } });
  // }

  async getAllPriorityRules(): Promise<PriorityRule[]> {
    return await prisma.priorityRule.findMany();
  }

  // async getActivePriorityRulesByType(type: string): Promise<PriorityRule[] | null> {
  //   return await prisma.priorityRule.findMany({ where: { type, status: 'active' } });
  // }

  async getActivePriorityRules(): Promise<PriorityRule[] | null> {
    return await prisma.priorityRule.findMany({
        where: {
            // type: {
            //     equals: type,
            //     mode: 'insensitive' // Case-insensitive comparison
            // },
            status: {
                equals: 'active',
                mode: 'insensitive' // Case-insensitive comparison
            }
        }
    });
}



}
