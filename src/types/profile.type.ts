export type InfoTab = "personal" | "preferences";

export type ListTab = "rehoming" | "adoptions";

export type AdoptionStatus = "success" | "pending" | "denied";

export type Species = "dog" | "cat";

export interface PersonalInfoDraft {
    firstName: string;
    lastName: string;
    phone: string;
    state: string;
    district: string;
    subDistrict: string;
    street: string;
    lat: number | null;
    long: number | null;
}

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

export const EMPTY_PET_PREFERENCE: PetPreferenceDraft = {
    breed: "",
    color: "",
    ageGroup: "",
    gender: "",
};

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

export interface RehomingInterest {
    id: string;
    rid: number;
    name: string;
    phone: string;
    imageURL?: string;
    status: "pending" | "accepted";
}

export interface RehomingPet {
    id: string;
    name: string;
    imageURL: string;
}

export interface AdoptedPet {
    id: string;
    rid: number;
    name: string;
    phone: string;
    imageURL: string;
    status: AdoptionStatus;
}
