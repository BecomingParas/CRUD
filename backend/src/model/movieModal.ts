import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    genre: {
      type: [String],
      enum: [
        "Action",
        "Romantic",
        "Sci-Fi",
        "Drama",
        "Horror",
        "Comedy",
        "Thriller",
      ],
      required: true,
    },
    director: {
      type: String,
      required: true,
    },
    cast: {
      type: [String],
      required: true,
    },
    release_year: {
      type: Number,
      required: true,
    },
    average_rating: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
  },
  {
    timestamps: true,
  }
);

export const MovieModel = mongoose.model("movie", movieSchema);
