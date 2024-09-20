import { PriorityRuleRepository } from '../repositories/priorityRuleRepository';
import { PriorityRule, Prisma } from '@prisma/client';
import { removeUndefinedProperties } from '../utils/helpers';
import { CreatePriorityRuleDTO, UpdatePriorityRuleDTO } from '../dto/priorityRuleDto';

const priorityRuleRepository = new PriorityRuleRepository();

export class PriorityRuleService {


  async createPriorityRule(data: CreatePriorityRuleDTO): Promise<PriorityRule> {
    return await priorityRuleRepository.createPriorityRule(data);
  }

  async getPriorityRule(id: string): Promise<PriorityRule | null> {
    return await priorityRuleRepository.getPriorityRule(id);
  }

  // async updatePriorityRule(id: string, data: Prisma.PriorityRuleUpdateInput): Promise<PriorityRule> {
  //   return await priorityRuleRepository.updatePriorityRule(id, data);
  // }


  async updatePriorityRule(id: string, data: UpdatePriorityRuleDTO): Promise<PriorityRule> {
    try {
        // Fetch the existing rule to check its status
        const existingRule = await this.getPriorityRule(id);
        if (!existingRule) {
            throw new Error(`PriorityRule with ID ${id} not found.`);
        }

        if (existingRule.status === 'historical') {
            throw new Error(`Cannot update a historical rule.`);
        }


        // Remove undefined properties from the data
        const cleanData: CreatePriorityRuleDTO = removeUndefinedProperties(data) as CreatePriorityRuleDTO;
        if (!cleanData.type || !cleanData.priority || !cleanData.patientRules || !cleanData.interrogationRules || !cleanData.rules) {
          throw new Error('Missing required fields in the updated data.');
        }
        

        // Mark the existing rule as historical
        await priorityRuleRepository.markRuleAsHistorical(id);

        // Create a new rule with updated data
        return await priorityRuleRepository.createUpdatedPriorityRule(id, cleanData);
    } catch (error) {
        console.error('Error updating priority rule:', error);
        throw new Error('Failed to update priority rule');
    }
}


  // async deletePriorityRule(id: string): Promise<PriorityRule> {
  //   return await priorityRuleRepository.deletePriorityRule(id);
  // }

  async deletePriorityRule(id: string): Promise<PriorityRule> {
    try {
        // Instead of deleting, mark the rule as historical
        return await priorityRuleRepository.markRuleAsHistorical(id);
    } catch (error) {
        console.error('Error deleting (marking as historical) priority rule:', error);
        throw error;
    }
  }

  async getAllPriorityRules(): Promise<PriorityRule[]> {
    return await priorityRuleRepository.getAllPriorityRules();
  }


  async getActivePriorityRules(): Promise<PriorityRule[] | null> {
    return await priorityRuleRepository.getActivePriorityRules();
  }




  
  
}







