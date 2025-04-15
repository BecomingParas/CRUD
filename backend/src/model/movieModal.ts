import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    genre: { type: [String], required: true },
    director: { type: String, required: true },
    cast: { type: [String], required: true },
    release_year: { type: Number, required: true },
    average_rating: { type: Number, required: true },
    poster_url: { type: String, required: true },
    video_url: { type: String, required: true },
  },
  { timestamps: true }
);

export const MovieModel = mongoose.model("Movie", movieSchema);
