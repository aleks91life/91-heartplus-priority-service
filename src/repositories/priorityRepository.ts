import { PriorityRule, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();



export class PriorityRepository {
    // Get all active rules
    static async getAllActiveRules(): Promise<PriorityRule[]> {
        return prisma.priorityRule.findMany({
            where: { status: 'active' }
        });
    }

    // Create a new rule
    static async deactivateRules(id: string) {
        return prisma.priorityRule.update({
            where: { id },
            data: { status: 'inactive' }
        });
    }
    

    static async GetRuleById(id:string){
        return await prisma.priorityRule.findFirst({ where: { id } })
    }
    
    
        static async createRule(data: any) {
            return await prisma.priorityRule.create({
                data
            });
        }
    
    

    // Update a rule by creating a new rule and deactivating the old one
    static async updateRule(id: string, updatedData: any) {
        // Step 1: Deactivate the old rule (for history purposes)
        await this.deactivateRule(id);

        // Step 2: Create a new rule with the updated data and mark it active
        return await this.createRule({
            ...updatedData,  // Spread the updated data
            status: 'active',  // Ensure the new rule is marked active
            parentId: id  // Link the new rule to the old rule using parentId
        });
    }
    static async getRuleHistory(id: string) {
        return await prisma.priorityRule.findMany({
            where: {
                OR: [
                    { id },  // Fetch the original rule by its ID
                    { parentId: id }  // Fetch all rules with the original rule as their parent
                ]
            }
        });
    }

    // Deactivate the old rule by marking it inactive
    static async deactivateRule(id: string) {
        return prisma.priorityRule.update({
            where: { id },
            data: { status: 'inactive' }
        });
    }
}
