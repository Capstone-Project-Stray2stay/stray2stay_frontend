import { describe, expect, it } from "vitest";
import { loginSchema, registerSchema } from "../src/validators/auth.validator";

describe("loginSchema", () => {
    // UT-FE-AUTH-01
    it("accepts a valid email and non-empty password", () => {
        expect(loginSchema.safeParse({ email: "adopter@example.com", password: "password123" }).success).toBe(true);
    });

    // UT-FE-AUTH-01
    it("rejects malformed emails and missing passwords", () => {
        expect(loginSchema.safeParse({ email: "not-an-email", password: "password123" }).success).toBe(false);
        expect(loginSchema.safeParse({ email: "adopter@example.com", password: "" }).success).toBe(false);
    });
});

describe("registerSchema", () => {
    const registration = {
        Firstname: "  Ada ",
        Lastname: "  Lovelace  ",
        Email: "ada@example.com",
        Password: "password123",
        ConfirmPassword: "password123",
    };

    // UT-FE-AUTH-02
    it("trims names and accepts matching passwords", () => {
        const result = registerSchema.safeParse(registration);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.Firstname).toBe("Ada");
            expect(result.data.Lastname).toBe("Lovelace");
        }
    });

    // UT-FE-AUTH-03
    it("rejects blank names, invalid email, and mismatched passwords", () => {
        expect(registerSchema.safeParse({ ...registration, Firstname: "   " }).success).toBe(false);
        expect(registerSchema.safeParse({ ...registration, Email: "bad" }).success).toBe(false);
        const mismatch = registerSchema.safeParse({ ...registration, ConfirmPassword: "different" });
        expect(mismatch.success).toBe(false);
        if (!mismatch.success) {
            expect(mismatch.error.issues.some((issue) => issue.path[0] === "ConfirmPassword")).toBe(true);
        }
    });
});
