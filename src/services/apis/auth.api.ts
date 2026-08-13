import axiosInstance from "../axios/axiosInstance";

export async function loginAPI(email: string, password: string) {
    const res = await axiosInstance.post("/user/login", { email, password });
    if (res.status === 200) {
        return res;
    }
    throw new Error("Login failed");
}

export async function registerAPI(email: string, password: string, firstname: string, lastname: string) {
    const res = await axiosInstance.post("/user/register", { email, password, firstname, lastname });
    if (res.status === 200) {
        return res;
    }
    throw new Error("Registration failed");
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

export async function newUserStatusAPI() {
    const res = await axiosInstance.get("/user/status");
    if (res.status === 200) {
        return res;
    }
    throw new Error("Failed to fetch new user status");
}

export async function updateNewUserStatusAPI() {
    const res = await axiosInstance.put("/user/status");
    if (res.status === 200) {
        return res;
    }
    throw new Error("Failed to update new user status");
}