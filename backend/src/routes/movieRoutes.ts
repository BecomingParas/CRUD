import { createMovieController } from "@/movieController/createMovieController";
import { getMovieById } from "@/movieController/getByIdMovieController";
import { getAllMovie } from "@/movieController/getMovieController";
import { updateMovie } from "@/movieController/updateMovieController";
import { movieUpload } from "@/utils/multer";
import { Express } from "express";
export function movieRoutes(app: Express) {
  app.post("/api/movies/create", movieUpload, createMovieController);
  app.get("/api/movies", getAllMovie);
  app.put("/api/movies/update/:id", movieUpload, updateMovie);
  app.get("/api/movies/:id", movieUpload, getMovieById);
}
