import { MovieModel } from "@/model/movieModal";

export type TMovie = {
  id: string;
  title: string;
  description: string;
  genre: string[];
  release_year: number;
  average_rating: number;
  cast: string[];
  director: string;
  poster_url: string; // Added
  video_url: string; // Added
};

export async function createMovie(input: Omit<TMovie, "id">) {
  const movie = new MovieModel({
    title: input.title,
    description: input.description,
    genre: input.genre,
    release_year: input.release_year,
    average_rating: input.average_rating,
    cast: input.cast,
    director: input.director,
    poster_url: input.poster_url, // Added
    video_url: input.video_url, // Added
  });

  await movie.save();
  return movie;
}
