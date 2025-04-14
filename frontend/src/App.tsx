import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import User from "./components/user/User";
import AddUser from "./components/user/AddUser";
import EditUser from "./components/user/EditUser";
import CreateMovie from "./components/movie/CreateMovie";
import MoviesList from "./components/movie/MoviesList";
import UpdateMovie from "./components/movie/UpdateMovie";

function App() {
  const route = createBrowserRouter([
    {
      path: "/",
      element: <User />,
    },

    {
      path: "/addUser",
      element: <AddUser />,
    },
    {
      path: "/edit/:id",
      element: <EditUser />,
    },
    {
      path: "/movies",
      element: <MoviesList />,
    },
    {
      path: "/movies/create",
      element: <CreateMovie />,
    },
    {
      path: "/movies/update/:id",
      element: <UpdateMovie />,
    },
  ]);
  return <RouterProvider router={route}></RouterProvider>;
}

export default App;
