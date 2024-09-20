import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class IPCRepository {
    static async logPriorityCalculation(ruleId: string, transmissionId: string, cause: string) {
        return prisma.interrogationPriorityCalculation.create({
            data: {
                ruleId,
                transmissionId,
                cause,
                status: 'active'
            }
        });
    }
}
