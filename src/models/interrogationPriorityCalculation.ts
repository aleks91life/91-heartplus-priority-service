export class InterrogationPriorityCalculation {
    ruleId: string;
    transmissionId: string;
    cause: string;
    status: 'active' | 'deactive';

    constructor(
        ruleId: string,
        transmissionId: string,
        cause: string,
        status: 'active' | 'deactive'
    ) {
        this.ruleId = ruleId;
        this.transmissionId = transmissionId;
        this.cause = cause;
        this.status = status;
    }
}
