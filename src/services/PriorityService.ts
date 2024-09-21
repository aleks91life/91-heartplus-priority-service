import { PrismaClient, Priority, Prisma, PriorityLevel } from '@prisma/client';
import { PriorityRepository } from '../repositories/PriorityRepository';
import { PatientRules } from '../entities/Priority';

export class PriorityService {
  private priorityRepository: PriorityRepository;

  constructor(prisma: PrismaClient) {
    this.priorityRepository = new PriorityRepository(prisma);
  }

  async getPrioritiesByUser(user: string): Promise<Priority[]> {
    return this.priorityRepository.findByUser(user);
  }

  async getPrioritiesByStatus(status: 'ACTIVE' | 'DEACTIVE'): Promise<Priority[]> {
    return this.priorityRepository.findByStatus(status);
  }

  async createPriority(data: Omit<Priority, 'id' | 'created_at' | 'updated_at'>): Promise<Priority> {
    return this.priorityRepository.create(data as Prisma.PriorityCreateInput);
  }

  async updatePriority(id: string, data: Partial<Priority>): Promise<Priority> {
    return this.priorityRepository.prisma.$transaction(async (prisma) => {
      // Deactivate the existing rule (A)
      const updatedPriority = await this.priorityRepository.update(id, { status: 'DEACTIVE' } as Prisma.PriorityUpdateInput);

      if (!updatedPriority) {
        throw new Error('Priority not found');
      }

      // Create a new rule (B) with the parent field set to the ID of rule (A)
      const newPriorityData: Omit<Priority, 'id' | 'created_at' | 'updated_at'> = {
        parent: id,
        status: 'ACTIVE', 
        type: updatedPriority.type, 
        user: updatedPriority.user, 
        priority: data.priority as PriorityLevel ?? updatedPriority.priority,
        patient_rules: data.patient_rules as Prisma.JsonValue 
        ? {
          excludedPatients: data.patient_rules ? (data.patient_rules as PatientRules).excludedPatients : null,
          includedPatients: data.patient_rules ? (data.patient_rules as PatientRules).includedPatients : null,
          qualifier:data.patient_rules ? (data.patient_rules as PatientRules).qualifier : null,
        } 
        : updatedPriority.patient_rules,
        interrogation_rules: data.interrogation_rules as Prisma.JsonValue ?? updatedPriority.interrogation_rules,
        rules: data.rules as Prisma.JsonValue ?? updatedPriority.rules,
      };
      const newPriority = await this.priorityRepository.create(newPriorityData as Prisma.PriorityCreateInput);

      return newPriority;
    });
  }





  async deletePriority(id: string): Promise<Priority> {
    return this.priorityRepository.delete(id);
  }
}
