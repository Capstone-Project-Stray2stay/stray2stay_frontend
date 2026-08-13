import { z } from "zod";

export const loginSchema = z.object({
    email: z.email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
    Firstname: z.string().trim().min(1, "First name is required"),
    Lastname: z.string().trim().min(1, "Last name is required"),
    Email: z.email("Please enter a valid email address"),
    Password: z.string().min(1, "Password is required"),
    ConfirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.Password === data.ConfirmPassword, {
    message: "Passwords do not match",
    path: ["ConfirmPassword"],
});
