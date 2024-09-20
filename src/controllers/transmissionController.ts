import { Request, Response } from 'express';
import { PriorityRepository } from '../repositories/priorityRepository';
import { RuleService } from '../services/ruleService'; // Using RuleService to evaluate
import { IPCService } from '../services/ipcService'; // Using IPCService to log reasons

// POST process transmission and trigger priorities
export const processTransmission = async (req: Request, res: Response) => {
    try {
        const result = await RuleService.processTransmission(req.body); // Calls RuleService to evaluate rules
        res.json(result); // Returns the evaluated result (priority triggered and reasons)
    } catch (error) {
        console.error('Error processing transmission:', error);
        res.status(500).json({ error: error || "Failed to process transmission." });
    }
};


