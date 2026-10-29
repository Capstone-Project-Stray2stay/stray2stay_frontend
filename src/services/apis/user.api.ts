import axiosInstance from "../axios/axiosInstance";
import type { PetPreferenceDraft } from "../../types/profile.type";

/** Matches domain.UserPreference — one Users_Preferences row. */
export interface UserPreferencePayload {
    petType: "DOG" | "CAT";
    breed: string;
    color: string;
    ageGroup: string;
    gender: string;
}

export interface UpdateUserPayload {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: string;
    addressLat: number;
    addressLong: number;
    /** The full set — the server replaces the user's preferences with exactly these. */
    preferences: UserPreferencePayload[];
}

/** Cards left completely blank aren't worth a row, so they're dropped on save. */
export function toPreferencePayload(preferences: PetPreferenceDraft[]): UserPreferencePayload[] {
    return preferences
        .filter((p) => p.breed || p.color || p.ageGroup || p.gender)
        .map((p) => ({
            petType: p.species === "dog" ? "DOG" : "CAT",
            breed: p.breed,
            color: p.color,
            ageGroup: p.ageGroup,
            gender: p.gender,
        }));
}

export async function updateUserAPI(payload: UpdateUserPayload) {
    const res = await axiosInstance.put("/user/update", payload);
    if (res.status === 200) {
        return res;
    }
    throw new Error("Failed to update user");
}

export interface UserInfoData {
    Firstname: string;
    Lastname: string;
    Phone: string;
    Address: string;
    CoverImage: string | null;
    /** Key matches domain.UserInfo's untagged Go field name. */
    Preferences: UserPreferencePayload[] | null;
}

export async function getUserInfoAPI() {
    const res = await axiosInstance.get("/user/info");
    if (res.status === 200) {
        return res;
    }
    throw new Error("Failed to fetch user info");
}

export async function updateUserImageAPI(image: File) {
    const formData = new FormData();
    formData.append("image", image);

    const res = await axiosInstance.put("/user/image", formData, {
        timeout: 30000,
    });

    if (res.status === 200) {
        return res;
    }
    throw new Error("Failed to update user image");
}
