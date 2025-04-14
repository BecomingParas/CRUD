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
  });
  await movie.save();
}
