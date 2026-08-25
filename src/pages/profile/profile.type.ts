/** Which form the left card's menu is showing. */
export type InfoTab = "personal" | "preferences";

/** Which list the bottom card is showing. */
export type ListTab = "rehoming" | "adoptions";

export type AdoptionStatus = "success" | "pending";

export type Species = "dog" | "cat";

export interface PersonalInfoDraft {
    firstName: string;
    lastName: string;
    phone: string;
    /**
     * The backend stores a single `user_address` string, but the design splits
     * it into four selects. Kept apart here so the form can round-trip; see
     * address.util.ts for the join/split.
     */
    state: string;
    district: string;
    subDistrict: string;
    street: string;
    /**
     * Set from the picked sub-district's coordinates (thai-province-data),
     * same idea as RehomeLocation.lat/long. Null until a sub-district with
     * known coordinates is picked — see address.api.ts's geocodeAddressAPI
     * for the submit-time fallback when it stays null.
     */
    lat: number | null;
    long: number | null;
}

/** Initial state before GET /user/info resolves. */
export const EMPTY_PERSONAL_INFO: PersonalInfoDraft = {
    firstName: "",
    lastName: "",
    phone: "",
    state: "",
    district: "",
    subDistrict: "",
    street: "",
    lat: null,
    long: null,
};

export interface PetPreferenceDraft {
    breed: string;
    color: string;
    ageGroup: string;
    gender: string;
}

/** Initial state before GET /user/info resolves. */
export const EMPTY_PET_PREFERENCE: PetPreferenceDraft = {
    breed: "",
    color: "",
    ageGroup: "",
    gender: "",
};

/** One person who applied to adopt a pet the user is rehoming. */
export interface RehomingInterest {
    id: string;
    name: string;
    phone: string;
    imageURL: string;
}

export interface RehomingPet {
    id: string;
    name: string;
    imageURL: string;
    interests: RehomingInterest[];
}

export interface AdoptedPet {
    id: string;
    name: string;
    /** Phone of the pet's rehomer, shown so the adopter can follow up. */
    phone: string;
    imageURL: string;
    status: AdoptionStatus;
}
