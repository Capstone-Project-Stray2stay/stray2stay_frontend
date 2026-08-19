import { useEffect, useState } from "react";
import { useAppDispatch } from "./redux";
import { setAuth } from "../store/slices/authSlices";
import { authorizeAPI } from "../services/apis/auth.api";

export function useCheckAuth() {
    const [loading, setLoading] = useState<boolean>(true);
    const [authorized, setAuthorized] = useState<boolean>(false);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await authorizeAPI();
                setAuthorized(res.data.authorized);
                dispatch(
                    setAuth({
                        authorized: res.data.authorized,
                        firstname: res.data.userFirstname,
                        coverImage: res.data.userCoverImage,
                    })
                );
            } catch {
                setAuthorized(false);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, [dispatch]);

    return { loading, authorized };
}