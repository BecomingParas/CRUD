import { z } from "zod";

export const createMovieSchema = z.object({
  title: z.string().min(1).max(25),
  description: z.string().min(10, "Description must be at least 10 characters"),
  genre: z.array(z.string()).min(1, "At least one genre is required"),
  cast: z.array(z.string()).min(1, "At least one cast member is required"),
  director: z.string().min(1, "Director name is required"),
  release_year: z.number().min(1990).max(2025),
  average_rating: z.number().min(1).max(10),
});
