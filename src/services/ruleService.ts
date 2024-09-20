import { pathMapping } from '../pathMapping';
import { PriorityRepository } from '../repositories/priorityRepository';
import { IPCService } from './ipcService';


export class RuleService {
    // Process transmission data and evaluate all priority rules
    static async processTransmissions(transmissions: any[]) {
        const activeRules = await PriorityRepository.getAllActiveRules(); // Get all active rules
        console.log('Active Rules:', activeRules); // Log active rules

        let results = [];

        for (const transmission of transmissions) {
            let priorities: any = {};
            let triggeredReasons: any = {};

            // Process each transmission individually
            for (const rule of activeRules) {
                const ruleConditions = (rule.rules as { conditions: any[] }).conditions || [];

                // Check patient rules (exclude/include)
                const isExcluded = this.isPatientExcluded(rule.patientRules, transmission);
                console.log(`Is Patient Excluded? ${isExcluded}`);

                if (isExcluded) {
                    console.log(`Skipping rule due to exclusion: ${rule.id}`);
                    continue; // Skip this rule if the patient is excluded
                }

                // Process rule conditions for each transmission
                for (const condition of ruleConditions) {
                    const { path, operator, values } = condition;
                    const transmissionValue = this.resolvePath(transmission, path);

                    console.log(`Condition: ${JSON.stringify(condition)}, Transmission Value: ${transmissionValue}`);

                    if (this.evaluateCondition(operator, transmissionValue, values)) {
                        console.log(`Condition matched for rule: ${rule.id}`);
                        priorities[rule.type] = rule.priority;
                        triggeredReasons[rule.type] = `Triggered by rule: ${rule.id}`;
                        await IPCService.logPriorityCalculation(rule.id, transmission.id, `Triggered by rule: ${rule.id}`);
                        break;
                    }
                }
            }

            // Store result for the current transmission
            results.push({
                transmissionId: transmission.id,
                priority: priorities,
                reasons: triggeredReasons
            });
        }

        console.log('Final Results:', results);
        return results;
    }


    // Helper function to evaluate rule conditions array
    static evaluateConditions(conditions: any[], transmission: any): boolean {
        for (const condition of conditions) {
            const { path, operator, values } = condition;
            const transmissionValue = this.resolvePath(transmission, path);

            console.log(`Condition: ${JSON.stringify(condition)}, Transmission Value: ${transmissionValue}`);

            if (this.evaluateCondition(operator, transmissionValue, values)) {
                console.log(`Condition matched: ${JSON.stringify(condition)}`);
                return true; // If any condition matches, we return true (OR logic)
            }
        }
        return false; // No conditions matched
    }

    // Helper function to evaluate interrogation rules
    static evaluateInterrogationConditions(interrogationRules: any[], transmission: any): boolean {
        for (const interrogationRule of interrogationRules) {
            for (const key in interrogationRule) {
                const condition = interrogationRule[key];
                const transmissionValue = this.resolvePath(transmission, key);

                console.log(`Interrogation Condition: ${JSON.stringify(condition)}, Transmission Value: ${transmissionValue}`);

                if (this.evaluateCondition(condition.operator, transmissionValue, condition.value)) {
                    console.log(`Interrogation condition matched: ${key}`);
                    return true; // If interrogation rule matches, we return true (OR logic)
                }
            }
        }
        return false; // No interrogation rules matched
    }

    // Helper function to check if the patient is excluded
    static isPatientExcluded(patientRules: any, transmission: any): boolean {
        if (!patientRules || !patientRules.mode) {
            console.log('No patient rules, default include.');
            return false; // No patient rules, include by default
        }

        const { mode, conditions } = patientRules;

        // If the mode is "exclude", check the exclusion conditions
        if (mode === 'exclude') {
            const excluded = conditions.some((condition: any) => {
                const { field, operator, value } = condition;
                const transmissionValue = this.resolvePath(transmission, field);
                console.log(`Checking exclusion condition: ${JSON.stringify(condition)}, Transmission Value: ${transmissionValue}`);
                return this.evaluateCondition(operator, transmissionValue, value); // Exclude if any condition matches
            });
            console.log(`Exclude result: ${excluded}`);
            return excluded;
        }

        return false; // Default to not exclude
    }

    // Helper function to resolve path
    // Helper function to resolve path using pathMapping
    static resolvePath(obj: any, path: string) {
        const mappedPath = pathMapping[path as keyof typeof pathMapping];  // Get the mapped path
        const actualPath = mappedPath ? mappedPath : path; // If mapped path exists, use it, otherwise use the original path
        return actualPath.split('.').reduce((o, key) => (o ? o[key] : null), obj);
    }


    // Helper function to evaluate conditions
    static evaluateCondition(operator: string, actualValue: any, expectedValue: any) {
        const operators: { [key: string]: Function } = {
            'is': (a: any, b: any) => a === b,
            'less': (a: number, b: number) => a < b,
            'more': (a: number, b: number) => a > b,
        };

        const result = operators[operator](actualValue, expectedValue);
        console.log(`Evaluating condition - Operator: ${operator}, Actual: ${actualValue}, Expected: ${expectedValue}, Result: ${result}`);
        return result;
    }
}
