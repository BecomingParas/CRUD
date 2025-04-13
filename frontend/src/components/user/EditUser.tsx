import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const userSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  address: z.string().min(5),
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

  const { data: userData, isLoading: isFetching } = useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:8000/api/users/${id}`);
      return response.data;
    },
    onSuccess: (data) => {
      reset(data); // prefill form
    },
  });

  const mutation = useMutation({
    mutationFn: (data: TUserForm) =>
      axios.put(`http://localhost:8000/api/users/${id}`, data),
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
        <Link to="/" className="text-blue-500 hover:underline">
          ← Back
        </Link>
      </div>

      {isFetching ? (
        <p>Loading...</p>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 bg-white p-6 rounded shadow"
        >
          <div>
            <label>Username:</label>
            <input {...register("username")} className="input" />
            {errors.username && (
              <p className="text-red-500">{errors.username.message}</p>
            )}
          </div>
          <div>
            <label>Email:</label>
            <input {...register("email")} className="input" />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label>Address:</label>
            <input {...register("address")} className="input" />
            {errors.address && (
              <p className="text-red-500">{errors.address.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            {mutation.isPending ? "Updating..." : "Update"}
          </button>
        </form>
      )}
    </div>
  );
};

export default EditUser;
