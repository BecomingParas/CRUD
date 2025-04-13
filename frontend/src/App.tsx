import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import User from "./components/user/User";
import AddUser from "./components/user/AddUser";
import EditUser from "./components/user/EditUser";
import CreateMovie from "./components/movie/CreateMovie";

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
      path: "/movies/create",
      element: <CreateMovie />,
    },
  ]);
  return <RouterProvider router={route}></RouterProvider>;
}

export default App;
