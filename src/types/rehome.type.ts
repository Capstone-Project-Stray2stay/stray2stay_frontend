export type PetType = "dog" | "cat";

/** Filled in by the "Pet's Location" section (petLocationSection.component.tsx). */
export interface RehomeLocation {
    state: string;
    district: string;
    subDistrict: string;
    street: string;
    lat: number | null;
    long: number | null;
}

/**
 * One photo in a form. The wizard only ever holds freshly picked `File`s, but
 * the Edit page starts out with photos already on the server, which are just
 * URLs — PhotoPicker handles both, and only builds (and revokes) object URLs
 * for the `File` half.
 */
export type PetPhoto = File | string;

/**
 * Every field Step3Details edits. Split out of RehomeDraft so the Edit page can
 * share that whole form while storing its photos differently.
 */
export interface PetDetailsDraft {
    petType: PetType | null;
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

/** Everything the 3-step Register a Pet wizard collects before it is submitted. */
export interface RehomeDraft extends PetDetailsDraft {
    /** All photos kept for the listing. Capped at MAX_PHOTOS. */
    photos: File[];
    /** The subset of `photos` sent to the AI classifier. Capped at MAX_AI_PHOTOS. */
    aiPhotos: File[];
    /** Breed reported by the AI classifier, or null if it was skipped or failed. */
    detectedBreed: string | null;
}

/**
 * What the Edit Pet's Profile page holds. Same fields as the wizard collects,
 * minus the AI-classifier bookkeeping (the breed is already decided by then),
 * and with photos that may already live on the server.
 */
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
