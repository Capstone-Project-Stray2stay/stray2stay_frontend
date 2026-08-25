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

/**
 * One adopter's filled-in screening questionnaire.
 *
 * The keys are the Go field names verbatim: domain.ScreeningAnswer declares no
 * json tags, so Fiber marshals `Q1_1`, `Q1_2`, … `Note` as-is (the same quirk
 * PetColorResponse has — see petColorsAPI). Naming them this way here means
 * the response drops straight in with no remapping layer.
 *
 * Value shapes follow the SQL columns: Q2_1 is the residence *label*, the
 * other choice answers are 0-based indexes into their option list, and Q3_1 is
 * a count of hours.
 */
export interface ScreeningAnswers {
    Q1_1: boolean;
    Q1_2: boolean;
    Q1_3: string;
    Q2_1: string;
    Q2_2: boolean;
    Q2_3: boolean;
    Q3_1: number;
    Q3_2: boolean;
    Q3_3: string;
    Q4_1: number;
    Q5_1: number;
    Q6_1: number;
    Q6_2: number;
    Note: string;
}

/** One person who applied to adopt a pet the user is rehoming. */
export interface RehomingInterest {
    id: string;
    name: string;
    phone: string;
    imageURL: string;
    /**
     * TODO: drop this once the list is real. The answers belong to the
     * adoption request (domain.AdoptorInfo.rehomeId) and would be fetched from
     * GET /pets/:pid/screening-answer when the modal opens; carrying them
     * inline is only viable while the whole list is mock data.
     */
    answers?: ScreeningAnswers;
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
