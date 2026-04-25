import { z } from "zod";

export const ReviewSchema = z.object({
  id: z.string().optional(),
  text: z.string().min(5),
  rating: z.number().min(1).max(10),
  movieId: z.any(), // 🔥 IMPORTANT (your movieId is not strictly typed)
});