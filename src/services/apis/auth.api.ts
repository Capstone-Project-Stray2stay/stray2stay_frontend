import axiosInstance from "../axios/axiosInstance";

export async function loginAPI(email: string, password: string) {
    const res = await axiosInstance.post("/user/login", { email, password });
    if (res.status === 200) {
        return res;
    }
    throw new Error("Login failed");
}

export async function logoutAPI() {
    const res = await axiosInstance.post("/user/logout");
    if (res.status === 200) {
        return res;
    }
    throw new Error("Logout failed");
}

export async function authorizeAPI() {
    const res = await axiosInstance.get("/user/authorize");
    if (res.status === 200) {
        return res;
    }
    throw new Error("Unauthorized");
}