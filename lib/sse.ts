const clients = new Set<ReadableStreamDefaultController<Uint8Array>>();

export function addClient(controller: ReadableStreamDefaultController<Uint8Array>) {
  clients.add(controller);
}

export function removeClient(controller: ReadableStreamDefaultController<Uint8Array>) {
  clients.delete(controller);
}

// ✅ SAFE BROADCAST (no fake backpressure logic)
export function broadcast(event: string, data: any) {
  const encoder = new TextEncoder();

  const payload = encoder.encode(
    `data: ${JSON.stringify({ event, data })}\n\n`
  );

  for (const client of clients) {
    try {
      client.enqueue(payload);
    } catch {
      clients.delete(client);
    }
  }
}