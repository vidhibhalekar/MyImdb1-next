export async function batchFetch<T>(
    requests: (() => Promise<T>)[]
  ): Promise<T[]> {
    return Promise.all(requests.map((r) => r()));
  }
