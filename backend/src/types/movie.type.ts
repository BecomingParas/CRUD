import { Document } from "mongoose";

export interface IMovie extends Document {
  title: string;
  description: string;
  genre: string[];
  release_year: number;
  average_rating: number;
  cast: string[];
  director: string;
  poster_url: string;
  video_url: string;
}

export interface MovieCreateDTO {
  title: string;
  description: string;
  genre: string[];
  cast: string[];
  director: string;
  release_year: number;
  average_rating: number;
  poster_url: string;
  video_url: string;
}

export interface UploadedFiles {
  poster: Express.Multer.File[];
  video: Express.Multer.File[];
}
