import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { TMovie } from "../../types/movie.type";

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

  // Pagination calculations
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = filteredMovies.slice(
    indexOfFirstMovie,
    indexOfLastMovie
  );
  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);

  // Pagination handlers
  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen p-6 max-w-6xl mx-auto">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, idx) => (
            <div
              key={idx}
              className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen p-6 max-w-6xl mx-auto text-center">
        <div className="py-20">
          <span className="text-6xl">⚠️</span>
          <h2 className="text-2xl font-bold mt-4 text-red-500">
            Failed to load movies
          </h2>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
          🎥 Movie Library
        </h1>
        <div className="flex items-center gap-4">
          <Link
            to="/movies/create"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-all"
          >
            <span>+</span>
            <span>Add New Movie</span>
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-8 relative">
        <input
          type="text"
          placeholder="Search movies by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:border-indigo-500 transition-all"
        />
        <span className="absolute right-4 top-3.5 text-gray-400">🔍</span>
      </div>

      {/* Movie Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentMovies.map((movie) => (
          <div
            key={movie._id}
            className="group relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
          >
            {/* Movie Poster */}
            <div className="h-48 relative">
              <img
                src={movie.poster_url}
                alt={movie.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback if image fails to load
                  e.currentTarget.src =
                    "https://via.placeholder.com/300x200?text=Poster+Not+Available";
                  e.currentTarget.className =
                    "w-full h-full object-contain p-2 bg-gray-100";
                }}
              />
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white truncate">
                  {movie.title}
                </h2>
                <span className="text-sm bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 px-3 py-1 rounded-full">
                  {movie.release_year}
                </span>
              </div>

              {/* Genre Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genre?.map((genre) => (
                  <span
                    key={genre}
                    className="text-sm bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                {movie.description}
              </p>

              {/* Cast & Director */}
              <div className="space-y-2 text-sm">
                <p className="truncate">
                  <span className="font-semibold">Director:</span>{" "}
                  {movie.director}
                </p>
                <p className="truncate">
                  <span className="font-semibold">Cast:</span>{" "}
                  {movie.cast.join(", ")}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link
                  to={`/movies/update/${movie._id}`}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  Edit
                </Link>
                <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {filteredMovies.length > moviesPerPage && (
        <div className="mt-8 flex justify-center items-center gap-4">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            ← Previous
          </button>
          <span className="text-gray-600 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            Next →
          </button>
        </div>
      )}

      {/* Empty State */}
      {!currentMovies.length && (
        <div className="text-center py-20">
          <span className="text-6xl">🍿</span>
          <h2 className="text-2xl font-bold mt-4 text-gray-600 dark:text-gray-400">
            No movies found
          </h2>
          <p className="text-gray-500 dark:text-gray-500 mt-2">
            Try adjusting your search or add a new movie
          </p>
        </div>
      )}
    </div>
  );
};

export default MovieList;
