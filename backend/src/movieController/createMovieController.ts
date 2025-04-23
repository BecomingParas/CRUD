import { Request, Response } from "express";
import { uploadFile } from "@/utils/cloudinaryUpload";
import { createMovie } from "@/service/movieService";

export const createMovieController = async (req: Request, res: Response) => {
  try {
    const files = req.files as {
      poster?: Express.Multer.File[];
      video?: Express.Multer.File[];
    };

    if (!files?.poster?.[0] || !files?.video?.[0]) {
      return res.status(400).json({ error: "Both poster and video required" });
    }

    const [poster, video] = [files.poster[0], files.video[0]];

    const [posterUpload, videoUpload] = await Promise.all([
      uploadFile(poster.path, {
        folder: "movie-posters",
        resource_type: "image",
      }),
      uploadFile(video.path, {
        folder: "movie-videos",
        resource_type: "video",
      }),
    ]);

    const movieInput = {
      title: req.body.title,
      description: req.body.description,
      genre: JSON.parse(req.body.genre),
      release_year: Number(req.body.release_year),
      average_rating: Number(req.body.average_rating),
      cast: JSON.parse(req.body.cast),
      director: req.body.director,
      poster_url: posterUpload.secure_url,
      video_url: videoUpload.secure_url,
    };

    const movie = await createMovie(movieInput);
    res.status(201).json(movie);
  } catch (error) {
    console.error("Error creating movie:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Movie creation failed",
    });
  }
};
