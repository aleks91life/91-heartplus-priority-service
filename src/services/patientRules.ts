import { getValueByPath, evaluateCondition } from '../utils/utils';

export function isPatientIncluded(patientId: string, PatientRules: any): boolean {
  console.log('Checking patient inclusion:', patientId, PatientRules);
  if (PatientRules.excludedPatients && PatientRules.excludedPatients.includes(patientId)) {
    return false;
  }
  if (PatientRules.includedPatients && !PatientRules.includedPatients.includes(patientId)) {
    return false;
  }
  return true;
}

export function filterTransmission(transmission: any, rules: any, fieldPathMapping: { [key: string]: string }): boolean {
  for (const [field, condition] of Object.entries(rules)) {
    const path = fieldPathMapping[field];
    if (path) {
      const fieldValue = getValueByPath(transmission, path);
      if (!evaluateCondition(fieldValue, condition)) {
        return false;
      }
    }
  }
  return true;
}
