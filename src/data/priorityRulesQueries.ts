import {prisma} from '../db/index';

export async function createPriorityRule(data) {
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


  export async function deleteRule(ruleId) {
    try {
      await prisma.priorityRules.update({
        where: { id: ruleId },
        data: { status: 'HISTORICAL' },
      });
    } catch (error) {
      throw new Error(`Failed to delete rule: ${error}`);
    }
  }

  export async function updateRule(ruleId, updatedData) {
    try {
    
      const oldRule = await prisma.priorityRules.findUnique({
        where: { id: ruleId },
      });
  
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
        status: 'ACTIVE',
        patientSpecific: updatedData.patientSpecific ?? oldRule.patientSpecific,
        priority: updatedData.priority ?? oldRule.priority,
        parentId: ruleId, 
      };
  

      await prisma.$transaction([

        prisma.priorityRules.update({
          where: { id: ruleId },
          data: { status: 'historical' },
        }),
  

        prisma.priorityRules.create({
          data: newRuleData,
        }),
      ]);
    } catch (error) {
      throw new Error(`Transaction failed: ${error}`);
    }
  }