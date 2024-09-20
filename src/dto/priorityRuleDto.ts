export interface CreatePriorityRuleDTO {
    type: string;
    priority: number;
    patientRules: object;
    interrogationRules: object;
    rules: object;
    user: string;
    tags?: object;
}

export interface UpdatePriorityRuleDTO extends Partial<CreatePriorityRuleDTO> {}