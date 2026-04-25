const history = new Map<string, any[]>();

export function saveRevision(id: string, oldText: string, newText: string) {
  if (!history.has(id)) {
    history.set(id, []);
  }

  history.get(id)?.push({
    from: oldText,
    to: newText,
    at: Date.now(),
  });
}

export function getRevisions(id: string) {
  return history.get(id) || [];
}