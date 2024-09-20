// import {mapPriorityToLabel} from '../utils/helpers'
// import {PriorityRuleService} from '../services/priorityRuleService'
// import { PriorityRule } from '@prisma/client';

// const priorityRuleService = new PriorityRuleService();

// ["test"].includes("value");


// type Transmission = {
//     statistics?: {
//       crt?: { lvPercentPaced?: number; };
//       brady?: Array<{ raPercentPaced?: number; rvPercentPaced?: number; }>;
//     };
//     device?: { type: string; };
//     patient?: { id: string; };
//   };
  
//   type Rule = {
//     type: string;
//     priority: number;
//     patientRules: { includedPatients: string[]; excludedPatients: string[]; };
//     interrogationRules: { deviceType?: { _in: string[]; }; };
//     rules: { position:{chamber: string[]}; valueRange:{value_min?: number; value_max?: number; }};
//   };

//   function parsePriorityRule(priorityRule: PriorityRule): Rule {
//     return {
//         type: priorityRule.type,
//         priority: priorityRule.priority,
//         patientRules: typeof priorityRule.patientRules === 'string'
//             ? JSON.parse(priorityRule.patientRules)
//             : priorityRule.patientRules ?? { includedPatients: [], excludedPatients: [] },
//         interrogationRules: typeof priorityRule.interrogationRules === 'string'
//             ? JSON.parse(priorityRule.interrogationRules)
//             : priorityRule.interrogationRules ?? {},
//         rules: typeof priorityRule.rules === 'string'
//             ? JSON.parse(priorityRule.rules)
//             : {position: {chamber: []}, valueRange: {}},
//     };
// }




//   type InterpretationResult = {
//     causes: any[];
//     priority: number;
    
//   };


//   type finalResult = {
//     causes: any[];
//     priority: number;
//     priorityLabel: string;
//   };







  
//   const pacingInterpreters = {
//     value_min: (minValue: number, actualValue: number, chamber: string) => {
//       if (actualValue < minValue) {
//         return {
//           message: `${chamber} pacing is less than the minimum allowed`,
//           expected: `>= ${minValue}`,
//           actual: actualValue,
//         };
//       }
//       return null;
//     },
//     value_max: (maxValue: number, actualValue: number, chamber: string) => {
//       if (actualValue > maxValue) {
//         return {
//           message: `${chamber} pacing exceeds the maximum allowed`,
//           expected: `<= ${maxValue}`,
//           actual: actualValue,
//         };
//       }
//       return null;
//     },
//     between: (minValue: number, maxValue: number, actualValue: number, chamber: string) => {
//       if (actualValue >= minValue && actualValue <= maxValue) {
//         return {
//           message: `${chamber} pacing is within the specified range`,
//           expected: `between ${minValue} and ${maxValue}`,
//           actual: actualValue,
//         };
//       }
//       return null;
//     },
//     _in: (field: string, array : string[]) =>{
//       if(array.includes(field)){
//         return{
//           message: `${field}  is in`,
//           expected: ` This is the excected values: ${array}`,
//           actual: field
//         };
//       }
//       return null;
//     }
//   };




  
//   export function interpretPacingRule(rule: Rule, transmission: Transmission) {
//     const { patientRules, interrogationRules, rules } = rule;
//     const results: any[] = [];
  
  
//     // 3. Apply pacing rules for each specified chamber
//     for (const chamber of rules.position.chamber) {
//       let actualPacing: number | undefined;
      
//       // Determine the correct chamber and get the pacing value
//       if (chamber === "LV") {
//         actualPacing = transmission.statistics?.crt?.lvPercentPaced;
//       } else if (chamber === "RV") {
//         actualPacing = transmission.statistics?.brady?.[0]?.rvPercentPaced;
//       } else if (chamber === "RA") {
//         actualPacing = transmission.statistics?.brady?.[0]?.raPercentPaced;
//       }
  
//       // If actual pacing is not found, skip this chamber
//       if (actualPacing === undefined) continue;
  
//       // 4. Apply value_min, value_max, and between checks
//       if (rules.valueRange.value_min !== undefined && rules.valueRange.value_max !== undefined) {
//         // Between check
//         const result = pacingInterpreters.between(rules.valueRange.value_min, rules.valueRange.value_max, actualPacing, chamber);
//         if (result) {
//           results.push(result);
//         }
//       } else {
//         // Individual checks for value_min and value_max
//         if (rules.valueRange.value_min !== undefined) {
//           const result = pacingInterpreters.value_min(rules.valueRange.value_min, actualPacing, chamber);
//           if (result) {
//             results.push(result);
//           }
//         }
//         if (rules.valueRange.value_max !== undefined) {
//           const result = pacingInterpreters.value_max(rules.valueRange.value_max, actualPacing, chamber);
//           if (result) {
//             results.push(result);
//           }
//         }
//       }
//     }
  
//     return {
//       causes: results,
//       priority: results.length > 0 ? rule.priority : 3,
//     };
//   }












//   // Priority Engine
// export async function priorityEngine(transmission: Transmission): Promise<finalResult> {
//   let allCauses: any[] = [];
//   let highestPriority = 3;

//   try{

//     // Fetch active pacing rules from the database
//     const priorityRules = await priorityRuleService.getActivePriorityRules();

//     if(priorityRules !== null){
//       for (const priorityRule of priorityRules) {

//         const rule = parsePriorityRule(priorityRule);

//         let interpretationResult: InterpretationResult | null = null;

//         // Determine the rule type and call the appropriate interpreter
//         if (rule.type === 'pacing') {
//           interpretationResult = interpretPacingRule(rule, transmission);
//         }
//         // Todo: more rule types and interpreters here as needed (e.g., battery, episode, etc.)

//         if (interpretationResult) {
//           // Only update causes and priority if there are valid causes returned
//           allCauses = allCauses.concat(interpretationResult.causes);
//           highestPriority = Math.min(highestPriority, interpretationResult.priority);
//         }
//       }
//     }

//     const priorityLabel = mapPriorityToLabel(highestPriority);

//     return {
//       causes: allCauses,
//       priority: highestPriority,
//       priorityLabel: priorityLabel,
//     };
//   }catch(error){
//     console.error('Error fetching rules or interpreting transmission:', error);
//     throw new Error('Failed to interpret priority rules');
//   }
// }
  

// // export async function interpretInterrogation(transm : Transmission, rule : Rule) {

// //   const results: any[] = [];
// //   // todo 
// //   if(transm.device?.type){
// //     let include = rule.interrogationRules.deviceType?._in.includes(transm.device?.type);
// //     if(include){
// //       let result = {
// //         message: `${rule} pacing is less than the minimum allowed`,
// //         expected: `>= ${rule.interrogationRules.deviceType}`,
// //         actual: transm.device?.type,
// //       };

// //     results.push(result);
// //     }

// //   }

// // }