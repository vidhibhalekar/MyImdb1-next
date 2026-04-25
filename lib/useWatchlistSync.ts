"use client";

import { useEffect } from "react";
import { getChannel } from "@/lib/broadcast";
import { getWatchlist } from "@/lib/watchlistRepository";

export function useWatchlistSync(
  setAdded: (id: string, value: boolean) => void
) {
  useEffect(() => {
    const channel = getChannel();
    if (!channel) return;

    const handler = (event: MessageEvent) => {
      const data = event.data;
      if (!data?.type) return;

      switch (data.type) {
        case "ADD": {
          const id = data.payload?.id;
          if (id) setAdded(id, true);
          break;
        }

        case "REMOVE": {
          const id = data.payload?.id || data.payload;
          if (id) setAdded(id, false);
          break;
        }

        case "MERGE": {
          (async () => {
            const items = await getWatchlist();

            const id = data.payload?.id;
            if (!id) return;

            const exists = items.some((i) => i.id === id);
            setAdded(id, exists);
          })();


          break;
        }
      }
    };

    channel.addEventListener("message", handler);

    return () => {
      channel.removeEventListener("message", handler);
    };
  }, [setAdded]);
}