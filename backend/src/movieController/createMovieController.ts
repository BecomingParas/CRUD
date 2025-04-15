import { MovieModel } from "@/model/movieModal";
import { createMovieSchema } from "@/service/movieSchema";
import { createMovie } from "@/service/movieService";
import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";

export async function createMovieController(req: Request, res: Response) {
  try {
    // 1. Validate files exist
    if (!req.files?.poster || !req.files?.video) {
      return res
        .status(400)
        .json({ message: "Both poster and video files are required" });
    }

    // 2. Upload files to Cloudinary
    const posterUpload = await cloudinary.uploader.upload(
      req.files.poster[0].path,
      {
        folder: "movie-posters",
      }
    );

    const videoUpload = await cloudinary.uploader.upload(
      req.files.video[0].path,
      {
        resource_type: "video",
        folder: "movie-videos",
      }
    );

    // 3. Parse and prepare data
    const rawData = {
      ...req.body,
      genre: JSON.parse(req.body.genre),
      cast: JSON.parse(req.body.cast),
      poster_url: posterUpload.secure_url,
      video_url: videoUpload.secure_url,
    };

    // 4. Validate with Zod
    const parsed = createMovieSchema.safeParse(rawData);
    if (!parsed.success) {
      // Cleanup uploaded files if validation fails
      await cloudinary.uploader.destroy(posterUpload.public_id);
      await cloudinary.uploader.destroy(videoUpload.public_id, {
        resource_type: "video",
      });

      return res.status(400).json({
        message: "Validation failed",
        errors: parsed.error.errors,
      });
    }

    // 5. Check for existing movie
    const movieExist = await MovieModel.findOne({ title: parsed.data.title });
    if (movieExist) {
      await cloudinary.uploader.destroy(posterUpload.public_id);
      await cloudinary.uploader.destroy(videoUpload.public_id, {
        resource_type: "video",
      });

      return res.status(409).json({ message: "Movie already exists" });
    }

    // 6. Create and save movie
    const savedMovie = await createMovie(parsed.data);

    // 7. Send response
    return res.status(201).json({
      message: "Movie created successfully",
      movie: savedMovie,
      poster_id: posterUpload.public_id,
      video_id: videoUpload.public_id,
    });
  } catch (error) {
    console.error("Create movie error:", error);

    // Cleanup any uploaded files on error
    if (posterUpload?.public_id) {
      await cloudinary.uploader.destroy(posterUpload.public_id);
    }
    if (videoUpload?.public_id) {
      await cloudinary.uploader.destroy(videoUpload.public_id, {
        resource_type: "video",
      });
    }

    return res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to create movie",
    });
  }
}
