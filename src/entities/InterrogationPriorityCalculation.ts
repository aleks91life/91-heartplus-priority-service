export interface InterrogationPriorityCalculation {
  id: string;
  transmission_id: string;
  rule_id: string;
  cause: string;
  status: 'ACTIVE' | 'DEACTIVE';
  highestPriority:string;
}
