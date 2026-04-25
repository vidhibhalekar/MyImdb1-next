let clients = new Set<ReadableStreamDefaultController<Uint8Array>>();

export function addClient(controller: ReadableStreamDefaultController<Uint8Array>) {
  clients.add(controller);
}

export function removeClient(controller: ReadableStreamDefaultController<Uint8Array>) {
  clients.delete(controller);
}

export function broadcastReviewsUpdate() {
  const payload = new TextEncoder().encode(
    `data: ${JSON.stringify({ type: "REFRESH_REVIEWS" })}\n\n`
  );

  for (const client of clients) {
    try {
      client.enqueue(payload);
    } catch {
      clients.delete(client);
    }
  }
}