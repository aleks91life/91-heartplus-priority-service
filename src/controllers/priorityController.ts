import { Request, Response } from 'express';
import { PriorityRepository } from '../repositories/priorityRepository';
import { prisma } from '@prisma/client';

// Get all active priority rules
export const getAllPriorityRules = async (req: Request, res: Response) => {
    try {
        const rules = await PriorityRepository.getAllActiveRules();
        res.json(rules);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch priority rules." });
    }
};

// Get history of a rule by fetching all inactive versions linked to a specific rule (via parentId)
export const getRuleHistory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;  // Get the rule ID from the URL parameters
        const history = await PriorityRepository.getRuleHistory(id);  // Fetch history from repository
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: `Failed to fetch history for rule.` });
    }
};


// Create a new priority rule

// POST create a new priority rule
export const createPriorityRule = async (req: Request, res: Response) => {
    try {
        const newRule = await PriorityRepository.createRule(req.body);
        res.status(201).json(newRule);
    } catch (error) {
        console.error("Failed to create priority rule:");
        res.status(500).json({ error: "Failed to create priority rule." });
    }
};




// Update an existing priority rule with versioning
export const updatePriorityRule = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;  // Get the old rule's ID from the URL parameters
        const updatedData = req.body;  // The new data for the updated rule

        let priorityRule = await PriorityRepository.GetRuleById(id);
        // Step 1: Deactivate the old rule (for history purposes)
        await PriorityRepository.deactivateRule(id);  // Mark the old rule as inactive

        

        

        
        // Step 2: Create a new rule with the updated data and link to the old rule via parentId
        const newRule = await PriorityRepository.createRule({
            ...updatedData,  // Spread the updated data
            status: 'active',  // Ensure the new rule is marked as active
            parentId: id  // Link the new rule to the old rule by setting parentId to the old rule's ID
        });

        res.json(newRule);  // Return the newly created rule
    } catch (error) {
        res.status(500).json({ error: `Failed to update priority rule with id.` });
    }
};



// Delete or deactivate a priority rule
export const deactivatePriorityRule = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await PriorityRepository.deactivateRule(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: `Failed to deactivate priority rule.` });
    }
};
