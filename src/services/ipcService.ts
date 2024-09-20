import { IPCRepository } from '../repositories/ipcRepository';

export class IPCService {
    static async logPriorityCalculation(ruleId: string, transmissionId: string, cause: string) {
        try {
            await IPCRepository.logPriorityCalculation(ruleId, transmissionId, cause);
        } catch {
            console.error(`Failed to log priority calculation.`);
        }
    }
}