/**
 * TODO: replace with real queries once the backend supports the page.
 *
 * Nothing here can be fetched today:
 *  - GET /api/user/info returns name/phone/address/image only — no pet
 *    preferences (domain.UserInfo), so the Pet Preferences tab has no source.
 *  - "My Rehoming" is close to GetAllAdoptors, but that handler reads the uid
 *    from a query param and its SQL inner-joins Pets_Rehoming, so pets with
 *    zero applicants never come back.
 *  - "My Adoptions" has no route at all.
 *
 * Every value below is throwaway client-side data just to make the UI testable.
 */
import type {
    AdoptedPet,
    PersonalInfoDraft,
    PetPreferenceDraft,
    RehomingPet,
} from "./profile.type";

import type { S2SDropDownOption } from "../../types/component.type";

export const mockPersonalInfo: PersonalInfoDraft = {
    firstName: "John",
    lastName: "Doe",
    phone: "099-546-5724",
    state: "",
    district: "",
    subDistrict: "",
    street: "",
};

/** Both start empty — the mockups show placeholder selects, not filled ones. */
export const mockDogPreference: PetPreferenceDraft = {
    breed: "",
    color: "",
    ageGroup: "",
    gender: "",
};

export const mockCatPreference: PetPreferenceDraft = {
    breed: "",
    color: "",
    ageGroup: "",
    gender: "",
};

export const mockRehomingPets: RehomingPet[] = [
    {
        id: "pet-muffin",
        name: "Muffin",
        imageURL: "",
        interests: [
            { id: "user-emma", name: "Emma", phone: "099-546-5724", imageURL: "" },
            { id: "user-alex", name: "Alex", phone: "099-546-5724", imageURL: "" },
        ],
    },
    {
        id: "pet-elsa",
        name: "Elsa",
        imageURL: "",
        interests: [
            { id: "user-nina", name: "Nina", phone: "099-546-5724", imageURL: "" },
            { id: "user-omar", name: "Omar", phone: "099-546-5724", imageURL: "" },
            { id: "user-lila", name: "Lila", phone: "099-546-5724", imageURL: "" },
            { id: "user-theo", name: "Theo", phone: "099-546-5724", imageURL: "" },
        ],
    },
    {
        id: "pet-kainokkatha",
        name: "Kainokkatha",
        imageURL: "",
        interests: [{ id: "user-ploy", name: "Ploy", phone: "099-546-5724", imageURL: "" }],
    },
];

export const mockAdoptedPets: AdoptedPet[] = [
    { id: "pet-happy", name: "Happy", phone: "099-426-9824", imageURL: "", status: "success" },
    { id: "pet-mocha", name: "Mocha", phone: "099-426-9824", imageURL: "", status: "success" },
    { id: "pet-chepo", name: "Chepo", phone: "099-426-9824", imageURL: "", status: "pending" },
];

const toOptions = (labels: string[]): S2SDropDownOption[] =>
    labels.map((label) => ({ value: label, label }));

/**
 * Stand-ins for useBreeds/usePetColors (src/hooks/query/pet.query.ts), which
 * need a species and — for colours — a chosen breed before they return
 * anything.
 */
export const mockBreedOptions: Record<"dog" | "cat", S2SDropDownOption[]> = {
    dog: toOptions(["Golden Retriever", "Beagle", "Shiba Inu", "Local Mix"]),
    cat: toOptions(["Persian", "Scottish Fold", "Siamese", "Local Mix"]),
};

export const mockColorOptions = toOptions(["Black", "White", "Brown", "Golden", "Grey"]);

/**
 * The project has no Thai province/district dataset yet — rehome/location.ts
 * still hardcodes a Bangkok centroid — so these are placeholders.
 */
export const mockAddressOptions = {
    state: toOptions(["Bangkok", "Chiang Mai", "Phuket"]),
    district: toOptions(["Chatuchak", "Bang Rak", "Din Daeng"]),
    subDistrict: toOptions(["Lat Yao", "Chom Phon", "Sena Nikhom"]),
    street: toOptions(["Phahonyothin", "Ratchadaphisek", "Vibhavadi"]),
};
