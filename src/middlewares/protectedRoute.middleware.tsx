import { Navigate } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import { useCheckAuth } from "../hooks/useCheckAuth";
import { Outlet } from "react-router-dom";

export default function ProtectedRoute() {
    const { loading, authorized } = useCheckAuth();

    if (loading) return <Box></Box>;
    if (!authorized) return <Navigate to="/login" replace />;
    return <Outlet />;
}