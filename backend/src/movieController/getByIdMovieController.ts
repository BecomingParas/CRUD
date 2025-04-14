import { MovieModel } from "@/model/movieModal";
import { Request, Response } from "express";

export const getMovieById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const movieExist = await MovieModel.findById(id);
    if (!movieExist) {
      res.status(404).json({ message: "Movie not found" });
    }
    res.status(200).json(movieExist);
  } catch (error: any) {
    res.status(500).json({ errorMessage: error.message });
  }
};
