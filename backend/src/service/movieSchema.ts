import { z } from "zod";

export const createMovieSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title cannot exceed 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description cannot exceed 500 characters"),
  genre: z
    .array(z.string())
    .min(1, "At least one genre is required")
    .max(5, "Maximum 5 genres allowed"),
  cast: z
    .array(z.string())
    .min(1, "At least one cast member is required")
    .max(10, "Maximum 10 cast members allowed"),
  director: z
    .string()
    .min(1, "Director name is required")
    .max(50, "Director name cannot exceed 50 characters"),
  release_year: z
    .number()
    .int("Release year must be an integer")
    .min(1900, "Release year must be after 1900")
    .max(
      new Date().getFullYear() + 5,
      "Release year cannot be in the far future"
    ),
  average_rating: z
    .number()
    .min(0, "Rating cannot be lower than 0")
    .max(10, "Rating cannot exceed 10")
    .default(0),
  poster_url: z
    .string()
    .url("Invalid poster URL format")
    .regex(/\.(jpeg|jpg|png)$/i, "Poster must be a JPG or PNG image"),
  video_url: z
    .string()
    .url("Invalid video URL format")
    .regex(/\.(mp4|mov|avi)$/i, "Video must be MP4, MOV, or AVI format"),
});
