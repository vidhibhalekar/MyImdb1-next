export function diff(oldText: string, newText: string) {
    return {
      before: oldText,
      after: newText,
      changedAt: Date.now(),
    };
  }