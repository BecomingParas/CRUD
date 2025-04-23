import { Link, useNavigate } from "react-router-dom";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axios from "axios";

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
  poster: z
    .instanceof(FileList)
    .refine((files) => files?.length === 1, "Poster is required"),
  video: z
    .instanceof(FileList)
    .refine((files) => files?.length === 1, "Video is required"),
});

type TMovieForm = z.infer<typeof movieSchema>;

const CreateMovie = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
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
  } = useFieldArray<TMovieForm>({
    control,
    name: "cast" as never,
  });

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      // Add debug logs
      console.log("FormData entries:");
      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const res = await axios.post(
        "http://localhost:8000/api/movies/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Movie created successfully!");
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      navigate("/movies");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create movie");
    },
  });

  const onSubmit = async (data: TMovieForm) => {
    const formData = new FormData();

    // Append all fields with correct names
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("director", data.director);
    formData.append("release_year", data.release_year.toString());
    formData.append("average_rating", data.average_rating.toString());

    // Handle arrays as JSON strings
    formData.append("genre", JSON.stringify(data.genre));
    formData.append("cast", JSON.stringify(data.cast));

    // Append files with correct field names
    formData.append("poster", data.poster[0]);
    formData.append("video", data.video[0]);

    mutation.mutate(formData);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Create New Movie</h1>
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
              placeholder="Release year"
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
              placeholder="1-10"
            />
            {errors.average_rating && (
              <p className="text-red-400 mt-1">
                {errors.average_rating.message}
              </p>
            )}
          </div>
        </div>

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
                  placeholder="Cast member name"
                />
                <button
                  type="button"
                  onClick={() => removeCast(index)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
                  disabled={castFields.length === 1}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendCast("")}
              className="mt-2 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
            >
              Add Cast Member +
            </button>
          </div>
          {errors.cast && (
            <p className="text-red-400 mt-1">{errors.cast.message}</p>
          )}
        </div>
        {/* File Upload Section */}
        <div className="space-y-6">
          {/* Poster Upload */}
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
                {errors.poster.message}
              </p>
            )}
          </div>

          {/* Video Upload */}
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
                {errors.video.message}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Creating..." : "Create Movie"}
        </button>
      </form>
    </div>
  );
};

export default CreateMovie;
