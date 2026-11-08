import { describe, expect, it } from "vitest";
import { personalInfoSchema } from "../src/validators/profile.validator";

const validProfile = {
    firstName: "  Ada ",
    lastName: "Lovelace  ",
    phone: " +66 81-234-5678 ",
    state: " Bangkok ",
    district: " Pathum Wan ",
    subDistrict: " Lumphini ",
    street: " 12 Pet Lane ",
    lat: null,
    long: null,
};

describe("personalInfoSchema", () => {
    // UT-FE-PROF-01
    it("accepts complete contact details and trims user-entered text", () => {
        const result = personalInfoSchema.safeParse(validProfile);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.firstName).toBe("Ada");
            expect(result.data.lastName).toBe("Lovelace");
            expect(result.data.phone).toBe("+66 81-234-5678");
            expect(result.data.street).toBe("12 Pet Lane");
            expect(result.data.lat).toBeNull();
            expect(result.data.long).toBeNull();
        }
    });

    // UT-FE-PROF-01
    it("rejects whitespace-only required fields and phone values outside the allowed format/length", () => {
        expect(personalInfoSchema.safeParse({ ...validProfile, firstName: "   " }).success).toBe(false);
        expect(personalInfoSchema.safeParse({ ...validProfile, district: "  " }).success).toBe(false);
        expect(personalInfoSchema.safeParse({ ...validProfile, phone: "12345678" }).success).toBe(false);
        expect(personalInfoSchema.safeParse({ ...validProfile, phone: "abc1234567" }).success).toBe(false);
    });
});
