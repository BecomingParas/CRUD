import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const genreOptions = [
  "Action",
  "Romantic",
  "Sci-Fi",
  "Drama",
  "Comedy",
  "Thriller",
];

const movieSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  genre: z.array(z.string()).min(1, "At least one genre is required"),
  cast: z
    .array(z.string().min(1))
    .min(1, "At least one cast member is required"),
  director: z.string().min(1, "Director name is required"),
  release_year: z.coerce.number().min(1990).max(2025),
  average_rating: z.coerce.number().min(1).max(10),
  poster: z.any().optional(), // Optional on update
  video: z.any().optional(), // Optional on update
});

type TMovieForm = z.infer<typeof movieSchema>;

const UpdateMovie = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<TMovieForm>({
    resolver: zodResolver(movieSchema),
    defaultValues: {
      genre: [],
      cast: [""],
      title: "",
      description: "",
      director: "",
      release_year: 2000,
      average_rating: 5,
    },
  });

  const {
    fields: castFields,
    append: appendCast,
    remove: removeCast,
  } = useFieldArray({
    control,
    name: "cast" as never,
  });

  // Fetch movie data
  const { data: movie, isLoading } = useQuery({
    queryKey: ["movie", id],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:8000/api/movies/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  // Prefill the form
  useEffect(() => {
    if (movie) {
      reset({
        ...movie,
        cast: movie.cast || [""],
        genre: movie.genre || [],
        poster: undefined,
        video: undefined,
      });
    }
  }, [movie, reset]);

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await axios.put(
        `http://localhost:8000/api/movies/update/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Movie updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      navigate("/movies");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update movie");
    },
  });

  const onSubmit = async (data: TMovieForm) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("director", data.director);
    formData.append("release_year", data.release_year.toString());
    formData.append("average_rating", data.average_rating.toString());
    formData.append("genre", JSON.stringify(data.genre));
    formData.append("cast", JSON.stringify(data.cast));

    // Append new files only if selected
    if (data.poster?.[0]) formData.append("poster", data.poster[0]);
    if (data.video?.[0]) formData.append("video", data.video[0]);

    mutation.mutate(formData);
  };

  if (isLoading) {
    return <p className="text-white p-6">Loading movie data...</p>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Update Movie</h1>
        <Link
          to="/movies"
          className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Back to List
        </Link>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-gray-800 p-8 rounded-xl shadow-xl"
      >
        {/* Title, Description, Genres, etc. — same as CreateMovie */}
        <div>
          <label className="block text-lg font-medium text-white mb-2">
            Title
          </label>
          <input
            {...register("title")}
            className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Movie title"
          />
          {errors.title && (
            <p className="text-red-400 mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-lg font-medium text-white mb-2">
            Description
          </label>
          <textarea
            {...register("description")}
            className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
            placeholder="Movie description"
          />
          {errors.description && (
            <p className="text-red-400 mt-1">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="block text-lg font-medium text-white mb-2">
            Genres
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {genreOptions.map((genre) => (
              <label
                key={genre}
                className="flex items-center space-x-2 bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <input
                  type="checkbox"
                  value={genre}
                  {...register("genre")}
                  className="w-4 h-4 text-blue-500 rounded focus:ring-blue-500 bg-gray-800"
                />
                <span className="text-white">{genre}</span>
              </label>
            ))}
          </div>
          {errors.genre && (
            <p className="text-red-400 mt-1">{errors.genre.message}</p>
          )}
        </div>

        {/* Director, Release Year, Rating */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-lg font-medium text-white mb-2">
              Director
            </label>
            <input
              {...register("director")}
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Director name"
            />
            {errors.director && (
              <p className="text-red-400 mt-1">{errors.director.message}</p>
            )}
          </div>

          <div>
            <label className="block text-lg font-medium text-white mb-2">
              Release Year
            </label>
            <input
              type="number"
              {...register("release_year")}
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.release_year && (
              <p className="text-red-400 mt-1">{errors.release_year.message}</p>
            )}
          </div>

          <div>
            <label className="block text-lg font-medium text-white mb-2">
              Average Rating
            </label>
            <input
              type="number"
              step="0.1"
              {...register("average_rating")}
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.average_rating && (
              <p className="text-red-400 mt-1">
                {errors.average_rating.message}
              </p>
            )}
          </div>
        </div>

        {/* Cast */}
        <div>
          <label className="block text-lg font-medium text-white mb-2">
            Cast Members
          </label>
          <div className="space-y-3">
            {castFields.map((field, index) => (
              <div key={field.id} className="flex gap-3">
                <input
                  {...register(`cast.${index}`)}
                  className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeCast(index)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg"
                  disabled={castFields.length === 1}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendCast("")}
              className="mt-2 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg"
            >
              Add Cast Member +
            </button>
          </div>
          {errors.cast && (
            <p className="text-red-400 mt-1">{errors.cast.message}</p>
          )}
        </div>

        {/* Poster and Video Upload */}
        <div className="space-y-6">
          <div className="w-full">
            <div className="flex items-center gap-8 mb-2">
              <label className="block text-lg font-medium text-white flex-shrink-0">
                Movie Poster
              </label>
              <Controller
                name="poster"
                control={control}
                render={({ field }) => (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => field.onChange(e.target.files)}
                    className="file-input file-input-bordered file-input-primary flex-1 text-white"
                  />
                )}
              />
            </div>
            {errors.poster && (
              <p className="text-red-400 mt-1 ml-[calc(25% + 1rem)]">
                {typeof errors.poster?.message === "string" &&
                  errors.poster.message}
              </p>
            )}
          </div>

          <div className="w-full">
            <div className="flex items-center gap-8 mb-2">
              <label className="block text-lg font-medium text-white flex-shrink-0">
                Movie Video
              </label>
              <Controller
                name="video"
                control={control}
                render={({ field }) => (
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => field.onChange(e.target.files)}
                    className="file-input file-input-bordered file-input-primary flex-1 text-white"
                  />
                )}
              />
            </div>
            {errors.video && (
              <p className="text-red-400 mt-1 ml-[calc(25% + 1rem)]">
                {typeof errors.video?.message === "string" &&
                  errors.video.message}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Updating..." : "Update Movie"}
        </button>
      </form>
    </div>
  );
};

export default UpdateMovie;
