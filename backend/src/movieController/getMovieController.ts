import { MovieModel } from "@/model/movieModal";
import { Request, Response } from "express";

export const getAllMovie = async (req: Request, res: Response) => {
  try {
    const movieData = await MovieModel.find();
    if (!movieData || movieData.length === 0) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.status(200).json(movieData);
  } catch (error: any) {
    res.status(500).json({ errorMessage: error.message });
  }
};
