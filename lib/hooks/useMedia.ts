"use client";

import { useQuery } from "@tanstack/react-query";

async function fetchMedia(id: string) {
  const res = await fetch(`/api/movie/${id}/media`);
  if (!res.ok) throw new Error("Failed media");
  return res.json();
}

export function useMedia(id: string) {
  return useQuery({
    queryKey: ["media", id],
    queryFn: () => fetchMedia(id),
  });
}