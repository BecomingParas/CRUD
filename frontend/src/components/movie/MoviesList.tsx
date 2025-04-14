import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";

export type TMovie = {
  _id: string;
  title: string;
  description: string;
  release_year: number;
  genre: string[];
  cast: string[];
  director: string;
};

const fetchMovies = async (): Promise<TMovie[]> => {
  const response = await axios.get("http://localhost:8000/api/movies");
  return response.data;
};

const MovieList = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 6;

  const {
    data: movies = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["movies"],
    queryFn: fetchMovies,
  });

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = filteredMovies.slice(
    indexOfFirstMovie,
    indexOfLastMovie
  );
  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  if (isLoading) {
    return (
      <div className="text-center py-10 text-lg font-medium">
        Loading movies...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-red-500 font-medium">
        Failed to load movies.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">
        Movie List
      </h1>

      <div className=" gap-6 mb-6">
        <Link
          to="/"
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded mr-7"
        >
          users
        </Link>
        <Link
          to="/movies/create"
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded"
        >
          Add Movie
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by movie title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 rounded border dark:bg-gray-800 dark:text-white dark:border-gray-600"
        />
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {currentMovies.length > 0 ? (
          currentMovies.map((movie) => (
            <div
              key={movie._id}
              className="p-4 bg-white dark:bg-gray-900 rounded-xl shadow hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">
                🎬 {movie.title}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-1">
                🗓️ {movie.release_year}
              </p>

              <p className="text-gray-600 dark:text-gray-400 mb-2 line-clamp-3">
                {movie.description}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                🎬{" "}
                {movie.genre && Array.isArray(movie.genre)
                  ? movie.genre.join(", ")
                  : "No genres"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                <span className="font-medium">Director:</span> {movie.director}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                <span className="font-medium">Cast:</span>{" "}
                {movie.cast.join(", ")}
              </p>

              <div className="mt-4 space-x-2">
                <Link
                  to={`/movies/update/${movie._id}`}
                  className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded"
                >
                  Edit
                </Link>
                <button className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded">
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No movies found.
          </p>
        )}
      </div>

      {/* Pagination */}
      {filteredMovies.length > moviesPerPage && (
        <div className="flex justify-center items-center mt-6 space-x-4">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-black text-white text-sm rounded disabled:opacity-40"
          >
            Prev
          </button>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-black text-white text-sm rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MovieList;
