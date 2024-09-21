export function getValueByPath(obj: any, path: string): any {
  const parts = path.split('.');
  return parts.reduce((acc, part) => {
    console.log(`Evaluating part: ${part}, Current value:`, acc);
    if (!acc) return undefined;

    const match = part.match(/(\w+)\[(\d+)\]/);
    if (match) {
      const arrayPart = match[1];
      const indexPart = match[2];
      console.log(`Accessing array part: ${arrayPart}[${indexPart}]`);
      return acc[arrayPart] && acc[arrayPart][parseInt(indexPart, 10)];
    }

    console.log(`Accessing property: ${part}`);
    return acc[part];
  }, obj);
}
 
  export function evaluateCondition(fieldValue: any, condition: any): boolean {
    switch (condition.operator) {
      // Equals and Is
      case "equals":
      case "is":
        return fieldValue === condition.value;
  
      // Is Not
      case "isNot":
        return fieldValue !== condition.value;
  
      // Contains
      case "contains":
        return typeof fieldValue === 'string' && fieldValue.includes(condition.value);
  
      // Does Not Contain
      case "doesNotContain":
        return typeof fieldValue === 'string' && !fieldValue.includes(condition.value);
  
      // Between
      case "between":
        if (Array.isArray(condition.value) && condition.value.length === 2) {
          const [min, max] = condition.value;
          return fieldValue >= min && fieldValue <= max;
        }
        return false;
  
      // More Than
      case "moreThan":
        return fieldValue > condition.value;
  
      // Less Than
      case "lessThan":
        return fieldValue < condition.value;
  
      // Begins With
      case "beginsWith":
        return typeof fieldValue === 'string' && fieldValue.startsWith(condition.value);
  
      // Ends With
      case "endsWith":
        return typeof fieldValue === 'string' && fieldValue.endsWith(condition.value);
  
      // Default case for unsupported operators
      default:
        return false;
    }
  }