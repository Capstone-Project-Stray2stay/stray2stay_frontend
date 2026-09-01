export type PetType = "dog" | "cat";

export interface RehomeLocation {
    state: string;
    district: string;
    subDistrict: string;
    street: string;
    lat: number | null;
    long: number | null;
}

export type PetPhoto = File | string;

export interface PetDetailsDraft {
    petType: PetType | null;
    name: string;
    breed: string;
    color: string;
    ageGroup: string;
    gender: string;
    personality: string[];
    vaccinations: string[];
    sterilized: boolean | null;
    specialCare: string[];
    note: string;
    location: RehomeLocation;
}

export interface RehomeDraft extends PetDetailsDraft {
    photos: File[];
    aiPhotos: File[];
    detectedBreed: string | null;
}

export interface EditPetDraft extends PetDetailsDraft {
    photos: PetPhoto[];
}

export const emptyRehomeLocation: RehomeLocation = {
    state: "",
    district: "",
    subDistrict: "",
    street: "",
    lat: null,
    long: null,
};

export const emptyRehomeDraft: RehomeDraft = {
    petType: null,
    photos: [],
    aiPhotos: [],
    detectedBreed: null,

    name: "",
    breed: "",
    color: "",
    ageGroup: "",
    gender: "",
    personality: [],
    vaccinations: [],
    sterilized: null,
    specialCare: [],
    note: "",
    location: emptyRehomeLocation,
};

export const MAX_PHOTOS = 4;

export const MAX_AI_PHOTOS = 2;

export const VACCINE_OPTIONS: Record<PetType, string[]> = {
    dog: ["DHPPi", "Rabies"],
    cat: ["FVRCP", "Rabies"],
};
