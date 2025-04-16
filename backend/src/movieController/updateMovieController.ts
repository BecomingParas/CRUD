import { Request, Response } from "express";
import { MovieModel } from "@/model/movieModal";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

interface MulterFiles {
  poster?: Express.Multer.File[];
  video?: Express.Multer.File[];
}

export const updateMovie = async (req: Request, res: Response) => {
  const files = req.files as MulterFiles;
  const { id } = req.params;
  let newPosterUrl: string | null = null;
  let newVideoUrl: string | null = null;

  try {
    // 1. Find existing movie
    const existingMovie = await MovieModel.findById(id);
    if (!existingMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // 2. Handle file uploads
    const uploadPromises = [];

    if (files?.poster?.[0]) {
      uploadPromises.push(
        cloudinary.uploader.upload(files.poster[0].path, {
          folder: "movie-posters",
        })
      );
    }

    if (files?.video?.[0]) {
      uploadPromises.push(
        cloudinary.uploader.upload(files.video[0].path, {
          resource_type: "video",
          folder: "movie-videos",
        })
      );
    }

    // 3. Process uploads
    const uploadResults = await Promise.all(uploadPromises);
    [newPosterUrl, newVideoUrl] = uploadResults.map((res) => res.secure_url);

    // 4. Prepare update data
    const updateData = {
      ...req.body,
      ...(files.poster && { poster_url: newPosterUrl }),
      ...(files.video && { video_url: newVideoUrl }),
      genre: JSON.parse(req.body.genre || existingMovie.genre),
      cast: JSON.parse(req.body.cast || existingMovie.cast),
    };

    // 5. Validate data (optional: integrate your Zod schema here)

    // 6. Update movie
    const updatedMovie = await MovieModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    // 7. Cleanup old Cloudinary assets
    if (files?.poster?.[0] && existingMovie.poster_url) {
      const publicId = existingMovie.poster_url.split("/").pop()?.split(".")[0];
      if (publicId) {
        await cloudinary.uploader.destroy(`movie-posters/${publicId}`);
      }
    }

    if (files?.video?.[0] && existingMovie.video_url) {
      const publicId = existingMovie.video_url.split("/").pop()?.split(".")[0];
      if (publicId) {
        await cloudinary.uploader.destroy(`movie-videos/${publicId}`, {
          resource_type: "video",
        });
      }
    }

    // 8. Cleanup temporary files
    if (files?.poster?.[0]) fs.unlinkSync(files.poster[0].path);
    if (files?.video?.[0]) fs.unlinkSync(files.video[0].path);

    res.status(200).json(updatedMovie);
  } catch (error: any) {
    // Cleanup on error
    if (files?.poster?.[0]) fs.unlinkSync(files.poster[0].path);
    if (files?.video?.[0]) fs.unlinkSync(files.video[0].path);

    // Delete newly uploaded assets if error occurred
    if (newPosterUrl) {
      const publicId = newPosterUrl.split("/").pop()?.split(".")[0];
      if (publicId)
        await cloudinary.uploader.destroy(`movie-posters/${publicId}`);
    }

    if (newVideoUrl) {
      const publicId = newVideoUrl.split("/").pop()?.split(".")[0];
      if (publicId) {
        await cloudinary.uploader.destroy(`movie-videos/${publicId}`, {
          resource_type: "video",
        });
      }
    }

    res.status(500).json({
      message: error.message || "Failed to update movie",
      ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
    });
  }
};
