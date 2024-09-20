import { Issue, LeadRuleData, PriorityRuleCause, PriorityRuleType } from "../types";
// add between, max, although its not in old rules
export async function interpretLead(rule: LeadRuleData, transmission: JSON): Promise<PriorityRuleCause | undefined> {

  if (rule['measurement'] == 'hvimpedance')
  {
    transmission['leadHVChannelMeasurements'].forEach(element => {
    return interpretLeadHvImpedance(rule, element)})
  } 

  transmission['leadChannelMeasurement'].forEach(element => {
       if (element['chamber'] && rule['chamber'].includes(element['chamber']))
       {
          switch (rule['measurement']) {
            case 'impedance':
              return interpretLeadImpedance(rule, element);
            case 'threshold':
              return interpretLeadThreshold(rule, element);
            case 'sensing':
                return interpretLeadSensing(rule, element);
            default:
              return undefined;
       }
    }
  });


  return undefined;
}


async function interpretLeadHvImpedance(rule: LeadRuleData, element: JSON): Promise<PriorityRuleCause | undefined> 
{
  let cause: PriorityRuleCause = {
    type: ['lead', 'hvimpedance'],
    issues: []
  }
  if (rule['valueRange'].valueMax && rule['valueRange'].valueMin)
  {
    if (element['impedance'].value < rule['valueRange'].valueMax && element['impedance'].value > rule['valueRange'].valueMin)
    {
      cause.issues.push({
        fieldName: 'impedance',
        value: element['impedance'].value
      });
    }
  }
  else if (rule['valueRange'].valueMax)
  {
    if (element['impedance'].value < rule['valueRange'].valueMax)
    {
      cause.issues.push({
        fieldName: 'impedance',
        value: element['impedance'].value
      });
    }
  }
  else if (rule['valueRange'].valueMin)
  {
    if (element['impedance'].value > rule['valueRange'].valueMin)
    {
      cause.issues.push({
        fieldName: 'impedance',
        value: element['impedance'].value
      });
    }
  }
  return (cause.issues.length > 0) ? cause : undefined;
}



async function interpretLeadImpedance(rule: LeadRuleData, element: JSON): Promise<PriorityRuleCause | undefined>{

  let cause: PriorityRuleCause = {
    type: ['lead', 'impedance'],
    issues: []
  }
  if (rule['valueRange'].valueMax && rule['valueRange'].valueMin)
  {
    if (element['impedance'].value > rule['valueRange'].valueMax && element['impedance'].value < rule['valueRange'].valueMin)
    {
      cause.issues.push( {
        fieldName: 'value',
        value: element['impedance'].value
      })
      return cause;
    }
  }
  else if (rule['valueRange'].valueMax)
  {
    if (element['impedance'].value < rule['valueRange'].valueMax)
    {
      cause.issues.push( {
        fieldName: 'value',
        value: element['impedance'].value
      })
      return cause;
    }
  }
  else if (rule['valueRange'].valueMin)
  {
    if (element['impedance'].value > rule['valueRange'].valueMin)
    {
      cause.issues.push( {
        fieldName: 'value',
        value: element['impedance'].value
      })
      return cause;
    }
  }
  return undefined;
}


// add other oeprators
async function interpretLeadThreshold(rule: LeadRuleData, element: JSON) : Promise<PriorityRuleCause | undefined>
{
  let cause: PriorityRuleCause = {
    type: ['lead', 'threshold'],
    issues: []
  }
  if (rule.valueRange.polarity && rule.valueRange?.polarity?.length != 0 && rule.valueRange.polarity[0] == element['pacingThreshold'].polarity){
    cause.issues.push({
      fieldName: 'polarity',
      value: element['pacingThreshold'].polarity
    });
  }
  
  if (rule['valueRange'].amplitude_Min && element['pacingThreshold'].amplitude < rule['valueRange'].amplitude_Min)
  {
    cause.issues.push({
      fieldName: 'amplitude',
      value: element['pacingThreshold'].amplitude
    });
  }
  if (rule['valueRange'].pulseWidth_min)
  {
    if (element['pacingThreshold'].pulseWidth > rule['valueRange'].pulseWidth_min){
      cause.issues.push({
        fieldName: 'pulseWidth',
        value: element['pacingThreshold'].pulseWidth
      });
    }
  }
  return (cause.issues.length > 0) ? cause : undefined;
}





function interpretLeadSensing(rule: LeadRuleData, element: any) : PriorityRuleCause | undefined{
  let cause: PriorityRuleCause = {
    type: ['lead', 'sensing'],
    issues: []
  }
  if (rule.valueRange.polarity && rule.valueRange?.polarity?.length != 0 && rule.valueRange.polarity[0] == element['pacingThreshold'].polarity){
    cause.issues.push({
      fieldName: 'polarity',
      value: element['pacingThreshold'].polarity
    });
  }
// TODO: add between, min, although its not in old rules
  if (rule['valueRange'].amplitude_Max){
    if (element['sensing'].intrinsicAmplitudeMean > rule['valueRange'].amplitude_Max){
      cause.issues.push({
        fieldName: 'amplitude',
        value: element['sensing'].intrinsicAmplitudeMean
      });
    }
  }
  return (cause.issues.length > 0) ? cause : undefined;
}
// // lead operators
// ImpedanceMaxOperator({
//   transmission: transmission,
//   value: rule['valueRange'].valueMax
// })

// // vs

// ImpedanceOperator({
//   operator: MaxOperator({
//     path: '',
//     value: '',
//   })
// })

// IterationOperator({
//   operators: [
//     MaxOperator(
//       path: '',
//       value: '',
//     ),
//     EqualsOperator(
//       path: 'type',
//       value: 'VT'
//     )
//   ],
//   path: transmission.episdoes
// })


// type transmission = {
//   episodes: [
//     {
//       duration: number?,
//       type: string
//     }
//   ]
// }

// // generic operators
// MaxOperator({
//   path: transmission.leadChannelMeasurement.impedance.value,
//   value: rule['valueRange'].valueMax
// })

// // max + min + between + equals
// [
//   GenericNumberOperator({
//     path: 'transmission.leadChannelMeasurement.impedance.value',
//   })
// ]
