import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const userSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(5, "Address must be at least 5 characters"),
});
type TUserForm = z.infer<typeof userSchema>;

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TUserForm>({
    resolver: zodResolver(userSchema),
  });

  const { isLoading: isFetching } = useQuery<TUserForm, Error>({
    queryKey: ["user", id],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:8000/api/users/${id}`);
      return response.data;
    },

    onSuccess: (data: any) => {
      reset(data);
    },
  });

  const mutation = useMutation({
    mutationFn: (data: TUserForm) =>
      axios.put(`http://localhost:8000/api/users/update/${id}`, data),
    onSuccess: () => {
      toast.success("User updated!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      navigate("/");
    },
    onError: () => {
      toast.error("Update failed.");
    },
  });

  const onSubmit = (data: TUserForm) => {
    mutation.mutate(data);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Edit User</h1>
      <div className="mb-4 text-right">
        <Link to="/" className="text-blue-500 hover:underline font-medium">
          ← Back to User List
        </Link>
      </div>

      {isFetching ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 bg-white dark:bg-gray-900 p-6 rounded-lg shadow"
        >
          <div>
            <label
              htmlFor="username"
              className="block font-medium mb-1 text-white"
            >
              Username:
            </label>
            <input
              id="username"
              type="text"
              {...register("username")}
              className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white"
              placeholder="Enter your name"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block font-medium mb-1 text-white"
            >
              Email:
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="address"
              className="block font-medium mb-1 text-white"
            >
              Address:
            </label>
            <input
              id="address"
              type="text"
              {...register("address")}
              className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white"
              placeholder="Enter your address"
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">
                {errors.address.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold"
          >
            {mutation.isPending ? "Updating..." : "Update"}
          </button>
        </form>
      )}
    </div>
  );
};

export default EditUser;
