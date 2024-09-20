enum RuleStatus {
    Active = 'active',
    Deactive = 'deactive',
}

enum PriorityLevel {
    High = 'High',
    Medium = 'Medium',
}

export interface RuleConditions {
    field: string;
    operator: string;
    value: any;
}

export interface PatientRules {
    age: number;
    condition: string;
}

export interface InterrogationRules {
    heartRate: number;
}

export class InterrogationPriorityCalculation {
    ruleId: string;
    transmissionId: string;
    cause: string;
    status: RuleStatus;

    constructor(
        ruleId: string,
        transmissionId: string,
        cause: string,
        status: RuleStatus = RuleStatus.Active
    ) {
        this.ruleId = ruleId;
        this.transmissionId = transmissionId;
        this.cause = cause;
        this.status = status;
    }
}

export class PriorityRule {
    id: string;
    patientRules: PatientRules;
    interrogationRules: InterrogationRules;
    rules: RuleConditions[];
    type: string; // e.g., Episode, Lead, Battery
    userId: string;
    status: RuleStatus;
    parentId: string | null;
    createdAt: Date;
    updatedAt: Date;
    priority: PriorityLevel;

    constructor(
        id: string,
        patientRules: PatientRules = {} as PatientRules,
        interrogationRules: InterrogationRules = {} as InterrogationRules,
        rules: RuleConditions[] = [],
        type: string,
        userId: string,
        priority: PriorityLevel
    ) {
        this.id = id;
        this.patientRules = patientRules;
        this.interrogationRules = interrogationRules;
        this.rules = rules;
        this.type = type;
        this.userId = userId;
        this.status = RuleStatus.Active;
        this.parentId = null;
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.priority = priority;
    }
}
