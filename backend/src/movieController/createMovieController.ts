import { Request, Response } from "express";
import { MovieModel } from "@/model/movieModal";
import { uploadFile } from "@/utils/cloudinaryUpload";

export const createMovieController = async (req: Request, res: Response) => {
  try {
    const files = req.files as {
      poster?: Express.Multer.File[];
      video?: Express.Multer.File[];
    };

    // Validate files
    if (!files?.poster?.[0] || !files?.video?.[0]) {
      return res.status(400).json({ error: "Both poster and video required" });
    }

    const [poster, video] = [files.poster[0], files.video[0]];

    // Upload files to Cloudinary
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

    // Create movie document
    const movieData = {
      ...req.body,
      genre: JSON.parse(req.body.genre),
      cast: JSON.parse(req.body.cast),
      release_year: Number(req.body.release_year),
      average_rating: Number(req.body.average_rating),
      poster_url: posterUpload.secure_url,
      video_url: videoUpload.secure_url,
    };

    const movie = await MovieModel.create(movieData);
    res.status(201).json(movie);
  } catch (error) {
    console.error("Error creating movie:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Movie creation failed",
    });
  }
};
