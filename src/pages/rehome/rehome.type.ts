export type PetType = "dog" | "cat";

/** Filled in by the "Pet's Location" section, which is not built yet. */
export interface RehomeLocation {
    state: string;
    district: string;
    subDistrict: string;
    street: string;
    lat: number | null;
    long: number | null;
}

/** Everything the 3-step Register a Pet wizard collects before it is submitted. */
export interface RehomeDraft {
    petType: PetType | null;
    /** All photos kept for the listing. Capped at MAX_PHOTOS. */
    photos: File[];
    /** The subset of `photos` sent to the AI classifier. Capped at MAX_AI_PHOTOS. */
    aiPhotos: File[];
    /** Breed reported by the AI classifier, or null if it was skipped or failed. */
    detectedBreed: string | null;

    // Step 3 — Fill in Details
    name: string;
    breed: string;
    color: string;
    ageGroup: string;
    gender: string;
    personality: string[];
    vaccinations: string[];
    /** null until answered — defaulting to false would assert "not sterilized". */
    sterilized: boolean | null;
    specialCare: string[];
    note: string;
    location: RehomeLocation;
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

/** How many photos the listing keeps, per the design's "Max 4 Photos". */
export const MAX_PHOTOS = 4;

/**
 * How many of those may be sent for breed detection. The backend classify
 * handler rejects anything outside 1-2 with a 400
 * (stray2stay_backend/internal/adapter/handler/http/pet/pet_ai.go).
 */
export const MAX_AI_PHOTOS = 2;

/**
 * Vaccines the backend accepts (`oneof=DHPPi Rabies FVRCP`, case-sensitive).
 * Split by species: DHPPi is a dog vaccine and FVRCP is its cat counterpart,
 * so offering both to either species would be wrong. The Figma export only
 * showed DHPPi + Rabies — confirm this split with the designer.
 */
export const VACCINE_OPTIONS: Record<PetType, string[]> = {
    dog: ["DHPPi", "Rabies"],
    cat: ["FVRCP", "Rabies"],
};
