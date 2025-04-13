import { MovieModel } from "@/model/movieModal";
import { createMovieSchema } from "@/service/movieSchema";
import { Request, Response } from "express";

export async function createMovieController(req: Request, res: Response) {
  try {
    const movieData = new MovieModel(req.body);
    const { title } = movieData;

    const movieExist = await MovieModel.findOne({ title });
    if (movieExist) {
      return res.status(400).json({ message: "Movie existed already" });
    }
    const parsed = createMovieSchema.safeParse(movieData);
    if (!parsed.success) {
      return res
        .status(404)
        .json({ message: "Please fill the valid information." });
    }
    await movie;
  } catch (error) {
    res.status(500).json({ message: "Failed to create a movie" });
  }
}
