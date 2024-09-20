import { getActivePriorityRules } from "../data/priorityRulesQueries";
import { EpisodeRule, PriorityRule, PriorityRuleCause, RuleData } from "../types";
import { interpretEpisodes } from "./interpretEpisodes";
import { interpretLead } from "./interpretLead";


export async function calculatePriority(transmission: JSON): Promise<PriorityRuleCause[] | undefined > {
    // create PriorityRuleCause array
    const rulesApplied: PriorityRuleCause[] = [];
    const rules = await getActivePriorityRules();
    for (const rule of rules) { 
        const ruleData = rule.rules as unknown as RuleData;
        switch (rule.type) {
            case 'lead':
                const leadResult = await interpretLead(ruleData, transmission);
                if (leadResult) rulesApplied.push(leadResult); 

            case 'episode':
                for (const episode of transmission['episodes']) {
                    const episodeResult = await interpretEpisodes(ruleData, episode);
                    if (episodeResult) rulesApplied.push(episodeResult); 
                }

        }
    }
    return rulesApplied.length > 0 ? rulesApplied : undefined;

}