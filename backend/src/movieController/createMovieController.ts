import { MovieModel } from "@/model/movieModal";
import { createMovieSchema } from "@/service/movieSchema";
import { createMovie } from "@/service/movieService";
import { Request, Response } from "express";

export async function createMovieController(req: Request, res: Response) {
  try {
    const parsed = createMovieSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Please fill in valid information.",
        errors: parsed.error.format(),
      });
    }

    const { title } = parsed.data;

    const movieExist = await MovieModel.findOne({ title });
    if (movieExist) {
      return res.status(400).json({ message: "Movie already exists." });
    }

    const savedMovie = await createMovie(parsed.data);

    return res
      .status(200)
      .json({ message: "Movie added successfully", movie: savedMovie });
  } catch (error) {
    console.error("Create movie error:", error);
    return res.status(500).json({ message: "Failed to create a movie" });
  }
}
