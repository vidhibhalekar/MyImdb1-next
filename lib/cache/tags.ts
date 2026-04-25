const tagMap = new Map<string, Set<string>>();

export function addTag(tag: string, key: string) {
  if (!tagMap.has(tag)) tagMap.set(tag, new Set());
  tagMap.get(tag)!.add(key);
}

export function invalidateTag(tag: string) {
  const keys = tagMap.get(tag);
  if (!keys) return;

  keys.forEach((k) => {
    // delete from memory cache
    // (hook into server cache layer)
  });

  tagMap.delete(tag);
}