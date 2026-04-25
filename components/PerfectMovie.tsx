"use client";

import { useQueryClient } from "@tanstack/react-query";

export function PrefetchMovie({ id }: { id: string }) {
  const queryClient = useQueryClient();

  const prefetch = async () => {
    await queryClient.prefetchQuery({
      queryKey: ["movie", id],
      queryFn: async () => {
        const res = await fetch(`/api/movie/${id}`);
        return res.json();
      },
    });
  };

  return (
    <a href={`/movie/${id}`} onMouseEnter={prefetch}>
      View Movie
    </a>
  );
}