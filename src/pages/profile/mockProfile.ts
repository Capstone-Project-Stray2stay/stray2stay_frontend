/**
 * TODO: replace with real queries once the backend supports the page.
 *
 * Personal info and pet preferences now come from GET /user/info (see
 * useUserInfo in hooks/query/user.query.ts; breed/color *options* come from
 * Mongo via useBreeds/usePetColors). Still nothing real for the rest:
 *  - "My Rehoming" is close to GetAllAdoptors, but that handler reads the uid
 *    from a query param and its SQL inner-joins Pets_Rehoming, so pets with
 *    zero applicants never come back.
 *  - "My Adoptions" has no route at all.
 *
 * Every value below is throwaway client-side data just to make the UI testable.
 */
import type { AdoptedPet, RehomingPet } from "./profile.type";

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
