"use client";

import { useEffect, useState } from "react";
import { subscribe, getState } from "@/lib/watchlistStore";

export function useWatchlist() {
  const [items, setItems] = useState(getState());

  useEffect(() => {
    const unsubscribe = subscribe(setItems);
    return unsubscribe;
  }, []);

  const isInWatchlist = (id: string) => {
    return items.some((i) => i.id === id);
  };

  return {
    items,
    isInWatchlist,
  };
}