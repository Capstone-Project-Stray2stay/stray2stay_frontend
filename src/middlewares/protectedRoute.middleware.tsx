import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import { useCheckAuth } from "../hooks/useCheckAuth";

export default function ProtectedRoute() {
    const { loading, authorized } = useCheckAuth();
    const location = useLocation();

    if (loading) return <Box></Box>;
    if (!authorized) return <Navigate to="/login" state={{ from: location }} replace />;
    return <Outlet />;
}