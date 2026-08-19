import { createBrowserRouter } from "react-router-dom";

import Login from "../pages/login.page";
import Register from "../pages/register.page";
import Home from "../pages/home.page";
import Adopt from "../pages/adopt.page";
import NotFound from "../pages/notFound.page";
import Profile from "../pages/profile.page";
import Diary from "../pages/diary.page";
import Rehome from "../pages/rehome.page";
import UserInformation from "../pages/userInformation.page";

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
                element: <Home />,
            },
            {
                path: "/adopt",
                element: <Adopt />,
            },
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        path: "/profile",
                        element: <Profile />,
                    },
                    {
                        path: "/diary",
                        element: <Diary />,
                    },
                    {
                        path: "/rehome",
                        element: <Rehome />,
                    },
                    {
                        // One-time setup for a newly registered account.
                        // TODO: redirect here automatically while
                        // useNewUserStatus() reports the user is new.
                        path: "/user-information",
                        element: <UserInformation />,
                    }
                ]
            }
        ],
    },
    {
        path: "*",
        element: <NotFound />,
    },
]);
