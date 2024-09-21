import { InterrogationPriorityCalculation } from './InterrogationPriorityCalculation';

export interface PatientRules {
  excludedPatients?: string[];
  includedPatients?: string[];
  qualifier: 'any' | 'all';
  [key: string]: any;
}

export interface Priority {
  id: string;
  patient_rules: PatientRules;
  interrogation_rules: {
    qualifier: 'any' | 'all';
    [key: string]: any;
  };
  rules: {
    [key: string]: {
      [fieldName: string]: {
        operator: string;
        value: any;
      }
    };
  };
  type: string;
  user: string;
  status: 'ACTIVE' | 'DEACTIVE';
  parent?: string;
  created_at: Date;
  updated_at: Date;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  InterrogationPriorityCalculations?: InterrogationPriorityCalculation[];
}
