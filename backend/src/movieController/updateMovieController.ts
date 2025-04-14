import { MovieModel } from "@/model/movieModal";
import { Request, Response } from "express";

export const updateMovie = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const movieExist = await MovieModel.findOne({ _id: id });
    if (!movieExist) {
      return res.status(404).json({ message: "Movie not found" });
    }
    const updateData = await MovieModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updateData);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
