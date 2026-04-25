export function resolveConflict(local: any, remote: any) {
    // Last Write Wins
    return local.updatedAt > remote.updatedAt ? local : remote;
  }