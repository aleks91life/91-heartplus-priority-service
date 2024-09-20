import {prisma} from '../db/index';
import { PriorityRuleType } from '../types';

export async function createPriorityRule(data: PriorityRuleType) {
    return prisma.priorityRules.create({
      data,
    });
  }
  
 export async function getActivePriorityRules() {
    return prisma.priorityRules.findMany({
      where: {
        status: 'ACTIVE',
      },
    });
  }


  export async function deleteRule(ruleId: string) {
    try {
      await prisma.priorityRules.update({
        where: { id: ruleId },
        data: { status: 'HISTORICAL' },
      });
    } catch (error) {
      throw new Error(`Failed to delete rule: ${error}`);
    }
  }

  export async function getRuleById(ruleId: string) {
    return prisma.priorityRules.findUnique({
      where: { id: ruleId },
    });
  }

  export async function updateRule(ruleId: string, updatedData: PriorityRuleType) {
    try {

      await prisma.$transaction([

        prisma.priorityRules.update({
          where: { id: ruleId },
          data: { status: 'HISTORICAL' },
        }),
  

        prisma.priorityRules.create({
          data: updatedData,
        }),
      ]);
    } catch (error) {
      throw new Error(`Transaction failed: ${error}`);
    }
  }