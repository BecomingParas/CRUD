import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

export type TUser = {
  _id: any;
  username: string;
  email: string;
  address: string;
};
const fetchUsers = async (): Promise<TUser[]> => {
  const response = await axios.get("http://localhost:8000/api/users");
  // Make sure response.data is the actual array of users
  if (!Array.isArray(response.data)) {
    throw new Error("Invalid user data received");
  }
  return response.data;
};

const User = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const {
    data: users = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  if (isLoading) {
    return (
      <div className="text-center py-10 text-lg font-medium">
        Loading users...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-red-500 font-medium">
        Failed to load users.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">
        User List
      </h1>
      <div className="mb-5 flex gap-4">
        <Link
          to="/addUser"
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded"
        >
          Add Users
        </Link>
        <Link
          to="/movies"
          className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded"
        >
          Add Movies
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 rounded border dark:bg-gray-800 dark:text-white dark:border-gray-600"
        />
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {currentUsers.length > 0 ? (
          currentUsers.map((user, index) => (
            <div
              key={index}
              className="p-4 bg-white dark:bg-gray-900 rounded-xl shadow hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">
                {user.username}
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                📧 {user.email}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                🏠 {user.address}
              </p>

              <div className="mt-4 space-x-2">
                <Link
                  to={`/edit/${user._id}`}
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
            No users found.
          </p>
        )}
      </div>

      {/* Pagination */}
      {filteredUsers.length > usersPerPage && (
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

export default User;
