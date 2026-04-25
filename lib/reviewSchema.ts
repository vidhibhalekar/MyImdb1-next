import { z } from "zod";

export const ReviewSchema = z.object({
  id: z.string(),
  movieId: z.string(),
text: z.string().min(1),
  rating: z.number().min(1).max(10),
  createdAt: z.number(),
  up: z.number().optional(),
  down: z.number().optional(),
});