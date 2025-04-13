import { z } from "zod";

export const createMovieSchema = z.object({
  title: z.string().max(25),
  description: z.string().min(10, "Description must be atleast 10 charcters"),
  genre: z.string(),
  cast: z.string(),
  release_year: z.number().min(1990).max(2025),
  average_rating: z.number().min(1).max(10),
});
