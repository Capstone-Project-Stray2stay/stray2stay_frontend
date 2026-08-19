import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Box } from "@chakra-ui/react";

import { useNewUserStatus } from "../hooks/query/auth.query";

const NEW_USER_SETUP_PATH = "/user-information";

export default function NewUserRedirect() {
    const { userStatus, loading } = useNewUserStatus();
    const location = useLocation();

    if (loading) return <Box></Box>;
    if (userStatus && location.pathname !== NEW_USER_SETUP_PATH) {
        return <Navigate to={NEW_USER_SETUP_PATH} replace />;
    }
    return <Outlet />;
}
