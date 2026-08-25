import { createBrowserRouter } from "react-router-dom";

import Login from "../pages/login.page";
import Register from "../pages/register.page";
import Home from "../pages/home.page";
import Adopt from "../pages/adopt.page";
import PetProfile from "../pages/petProfile";
import NotFound from "../pages/notFound.page";
import Profile from "../pages/profile.page";
import Diary from "../pages/diary.page";
import Rehome from "../pages/rehome.page";
import EditPet from "../pages/editPet.page";
import UserInformation from "../pages/userInformation.page";

import MainLayout from "../layouts/main.layout";
import ProtectedRoute from "../middlewares/protectedRoute.middleware";
import NewUserRedirect from "../middlewares/newUserRedirect.middleware";

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
                element: <NewUserRedirect />,
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
                                // Nested under /rehome so the sidebar keeps
                                // highlighting Rehome — see getActiveNavKey.
                                path: "/rehome/:petId/edit",
                                element: <EditPet />,
                            },
                            {
                                // One-time setup for a newly registered account.
                                path: "/user-information",
                                element: <UserInformation />,
                            },
                            {
                                path: "/adopt",
                                element: <Adopt />,
                            },
                            {
                                path: "/pet-profile",
                                element: <PetProfile />,
                            },
                        ]
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
