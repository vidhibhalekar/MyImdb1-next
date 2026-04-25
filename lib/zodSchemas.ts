import { z } from "zod";

export const WatchlistItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  addedAt: z.number().optional(),
  updatedAt: z.number(),
  version: z.number(),
  vectorClock: z.record(z.string(), z.number()).optional(),
});

export type WatchItemDTO = z.infer<typeof WatchlistItemSchema>;