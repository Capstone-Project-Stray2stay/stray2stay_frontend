/**
 * TODO: replace with a real query once the backend supports the page.
 *
 * The Edit Pet's Profile page needs GET /pets/:pid to load a listing and
 * PUT /pets/:pid to save it, and neither route exists — see the TODOs beside
 * the pencil and trash buttons in profile/myRehomingList.component.tsx. Until
 * then the page reads from here, keyed by the same ids profile/mockProfile.ts
 * gives its rehoming rows so the pencil button has somewhere to land.
 *
 * Every value below is throwaway client-side data just to make the UI testable.
 */
import type { EditPetDraft } from "./rehome.type";

/**
 * Photos stand in for the URLs GET /pets/:pid would return in
 * petImageAddress[]. They render at 86px, and the thumbnail's grey backing
 * shows through if the host is unreachable.
 */
const mockPhotoURLs = [
    "https://placedog.net/500/500?id=7",
    "https://placedog.net/500/500?id=12",
    "https://placedog.net/500/500?id=25",
    "https://placedog.net/500/500?id=41",
];

const mockEditPets: Record<string, EditPetDraft> = {
    "pet-muffin": {
        petType: "dog",
        photos: mockPhotoURLs,
        name: "Muffin",
        // Must be a value the live /pets/breeds and /pets/breed/color endpoints
        // actually return, or the dropdowns open on a blank selection.
        breed: "Golden Retriever",
        color: "Golden",
        ageGroup: "MATURE",
        gender: "MALE",
        personality: ["Friendly", "Playful", "Affectionate"],
        vaccinations: ["DHPPi", "Rabies"],
        sterilized: true,
        specialCare: ["Mild hip dysplasia"],
        note: "Very gentle with children. Already house-trained and walks well on a leash.",
        location: {
            state: "Bangkok",
            district: "Bang Rak",
            subDistrict: "Si Lom",
            street: "Convent Road",
            lat: 13.7248,
            long: 100.5289,
        },
    },
    // Deliberately sparse, to exercise the empty dropzone and the "Please fill
    // in: …" path on Next.
    "pet-elsa": {
        petType: "cat",
        photos: [],
        name: "Elsa",
        breed: "",
        color: "",
        ageGroup: "BABY",
        gender: "FEMALE",
        personality: ["Shy"],
        vaccinations: [],
        sterilized: null,
        specialCare: [],
        note: "",
        location: {
            state: "",
            district: "",
            subDistrict: "",
            street: "",
            lat: null,
            long: null,
        },
    },
    "pet-kainokkatha": {
        petType: "dog",
        photos: [mockPhotoURLs[0], mockPhotoURLs[2]],
        name: "Kainokkatha",
        breed: "Beagle",
        color: "Tricolor",
        ageGroup: "JUVENILE",
        gender: "FEMALE",
        personality: ["Energetic", "Smart", "Independent"],
        vaccinations: ["Rabies"],
        sterilized: false,
        specialCare: [],
        note: "Found near the campus canteen. Needs a home with a fenced yard.",
        location: {
            state: "Chiang Mai",
            district: "Mueang Chiang Mai",
            subDistrict: "Suthep",
            street: "",
            lat: 18.7953,
            long: 98.9526,
        },
    },
};

/** The listing being edited, or undefined for an id we know nothing about. */
export function getMockEditPet(petId: string | undefined): EditPetDraft | undefined {
    if (!petId) return undefined;
    return mockEditPets[petId];
}
