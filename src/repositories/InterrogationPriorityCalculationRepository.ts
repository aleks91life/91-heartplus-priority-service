import { PrismaClient, InterrogationPriorityCalculation } from '@prisma/client';
import { GenericRepository } from './GenericRepository';

export class InterrogationPriorityCalculationRepository extends GenericRepository<'interrogationPriorityCalculation'> {
  constructor(prisma: PrismaClient) {
    super(prisma, 'interrogationPriorityCalculation');
  }

  async findByTransmissionId(transmissionId: string): Promise<InterrogationPriorityCalculation[]> {
    console.log('Transmission ID passed to method:', transmissionId);
    return this.prisma.interrogationPriorityCalculation.findMany({
        where: {
            transmission_id: transmissionId,
        },
    });
    
}

  async findByRuleId(ruleId: string): Promise<InterrogationPriorityCalculation[]> {
    return this.prisma.interrogationPriorityCalculation.findMany({
      where: { rule_id: ruleId },
    });
  }
}
