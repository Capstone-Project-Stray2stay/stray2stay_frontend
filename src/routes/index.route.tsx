import { createBrowserRouter } from "react-router-dom";

import Login from "../pages/login.page";
import Register from "../pages/register.page";
import Homepage from "../pages/home.page";
import NotFound from "../pages/notFound.page";

import MainLayout from "../layouts/main.layout";
import ProtectedRoute from "../middlewares/protectedRoute.middleware";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
    },
    {
        element: <MainLayout />,
        children: [
            {
                path: "/",
                element: <Homepage />,
            },
            // add more pages here that should share the layout
            // { path: "/profile", element: <Profile /> },
            // { path: "/pets", element: <PetsList /> },
        ],
    },
    {
        path: "*",
        element: <NotFound />,
    },
]);