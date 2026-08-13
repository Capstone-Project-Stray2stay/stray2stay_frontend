import { Navigate } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import type { Props } from "../types/middleware.type";
import { useCheckAuth } from "../hooks/useCheckAuth";

export default function ProtectedRoute({ children }: Props) {
    const { loading, authorized } = useCheckAuth();

    if (loading) return <Box></Box>;
    if (!authorized) return <Navigate to="/login" replace />;
    return <>{children}</>;
}