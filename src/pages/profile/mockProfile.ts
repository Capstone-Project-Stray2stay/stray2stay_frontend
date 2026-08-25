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
import type { AdoptedPet, RehomingPet, ScreeningAnswers } from "./profile.type";

/** Seeded to match the states drawn in the screening-form mockup. */
const mockScreeningAnswers: ScreeningAnswers = {
    Q1_1: true,
    Q1_2: true,
    Q1_3: "I finally have a stable home and enough time to care for a pet properly.",
    Q2_1: "Townhouse",
    Q2_2: true,
    Q2_3: true,
    Q3_1: 4,
    Q3_2: true,
    Q3_3: "One older cat, fully vaccinated and used to other animals.",
    Q4_1: 0,
    Q5_1: 0,
    Q6_1: 0,
    Q6_2: 0,
    Note: "Happy to arrange a home visit before the handover.",
};

/** A second, deliberately different set so the modal isn't identical per row. */
const mockScreeningAnswersAlt: ScreeningAnswers = {
    Q1_1: false,
    Q1_2: true,
    Q1_3: "My children have been asking for a pet and we are ready to commit.",
    Q2_1: "Condo",
    Q2_2: true,
    Q2_3: false,
    Q3_1: 8,
    Q3_2: false,
    Q3_3: "No other pets at the moment.",
    Q4_1: 1,
    Q5_1: 2,
    Q6_1: 1,
    Q6_2: 1,
    Note: "",
};

export const mockRehomingPets: RehomingPet[] = [
    {
        id: "pet-muffin",
        name: "Muffin",
        imageURL: "",
        interests: [
            {
                id: "user-emma",
                name: "Emma",
                phone: "099-546-5724",
                imageURL: "",
                answers: mockScreeningAnswers,
            },
            {
                id: "user-alex",
                name: "Alex",
                phone: "099-546-5724",
                imageURL: "",
                answers: mockScreeningAnswersAlt,
            },
        ],
    },
    {
        id: "pet-elsa",
        name: "Elsa",
        imageURL: "",
        interests: [
            { id: "user-nina", name: "Nina", phone: "099-546-5724", imageURL: "", answers: mockScreeningAnswers },
            { id: "user-omar", name: "Omar", phone: "099-546-5724", imageURL: "", answers: mockScreeningAnswersAlt },
            { id: "user-lila", name: "Lila", phone: "099-546-5724", imageURL: "", answers: mockScreeningAnswers },
            // Left without answers on purpose, to exercise the modal's
            // "nothing was submitted" state.
            { id: "user-theo", name: "Theo", phone: "099-546-5724", imageURL: "" },
        ],
    },
    {
        id: "pet-kainokkatha",
        name: "Kainokkatha",
        imageURL: "",
        interests: [
            {
                id: "user-ploy",
                name: "Ploy",
                phone: "099-546-5724",
                imageURL: "",
                answers: mockScreeningAnswersAlt,
            },
        ],
    },
];

export const mockAdoptedPets: AdoptedPet[] = [
    { id: "pet-happy", name: "Happy", phone: "099-426-9824", imageURL: "", status: "success" },
    { id: "pet-mocha", name: "Mocha", phone: "099-426-9824", imageURL: "", status: "success" },
    { id: "pet-chepo", name: "Chepo", phone: "099-426-9824", imageURL: "", status: "pending" },
];
