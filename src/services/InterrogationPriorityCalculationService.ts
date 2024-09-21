import { PrismaClient, InterrogationPriorityCalculation } from '@prisma/client';
import { InterrogationPriorityCalculationRepository } from '../repositories/InterrogationPriorityCalculationRepository';
import { v4 as uuidv4 } from 'uuid'; 

export class InterrogationPriorityCalculationService {
  private interrogationPriorityCalculationRepository: InterrogationPriorityCalculationRepository;
  private prisma: PrismaClient; 

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.interrogationPriorityCalculationRepository = new InterrogationPriorityCalculationRepository(prisma);
  }

  async getCalculationsByTransmissionId(transmissionId: string): Promise<InterrogationPriorityCalculation[]> { 
    const calculations = await this.interrogationPriorityCalculationRepository.findByTransmissionId(transmissionId);
    console.log(calculations);
    if (calculations.length === 0) {
        console.log('No calculations found for transmission ID:', transmissionId);
        return []; 
    }

    console.log('Calculations:', calculations);

    const highestPriority = calculations.reduce((max, calculation) => {
        if (calculation.highestPriority === 'HIGH') {
            return 'HIGH';
        }
        if (calculation.highestPriority === 'MEDIUM' && max !== 'HIGH') {
            return 'MEDIUM';
        }
        return max; // Default is 'LOW'
    }, 'LOW');

    console.log('Highest Priority:', highestPriority);

    const filteredCalculations = calculations.filter(calculation => calculation.highestPriority === highestPriority);

    console.log('Filtered Calculations:', filteredCalculations);

    return filteredCalculations;
}



  async getCalculationsByRuleId(ruleId: string): Promise<InterrogationPriorityCalculation[]> {
    return this.interrogationPriorityCalculationRepository.findByRuleId(ruleId);
  }

  async createCalculation(data: {
    id: string,
    transmission_id: string;
    rule_id: string;
    cause: string;
    highestPriority: string;
    status: 'ACTIVE' | 'DEACTIVE';
  }): Promise<InterrogationPriorityCalculation> {
    return this.prisma.interrogationPriorityCalculation.create({
      data: {
        id: uuidv4(), 
        transmission_id: data.transmission_id,
        rule_id: data.rule_id,
        cause: data.cause,
        highestPriority: data.highestPriority,
        status: data.status,
      },
    });
  }

  async updateCalculation(id: string, data: Partial<InterrogationPriorityCalculation>): Promise<InterrogationPriorityCalculation> {
    return this.interrogationPriorityCalculationRepository.update(id, data);
  }

  async deleteCalculation(id: string): Promise<InterrogationPriorityCalculation> {
    return this.interrogationPriorityCalculationRepository.delete(id);
  }
  
}
