
export function removeUndefinedProperties<T extends Record<string, unknown>>(obj: T): Partial<T> {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, v]) => v !== undefined)
    ) as Partial<T>;
  }
  

 export function mapPriorityToLabel(priority: number): string {
    switch (priority) {
      case 1:
        return "high";
      case 2:
        return "medium";
      case 3:
        return "low";
      default:
        return "unknown";
    }
  }
  