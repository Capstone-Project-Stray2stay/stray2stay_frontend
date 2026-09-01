// TODO: replace with a real diary API/hook once one exists. The Go backend has
// no diary routes at all yet (see internal/adapter/handler/router/), so every
// value below is throwaway client-side data just to make the UI testable.
import { toDateKey } from "./dateUtils";
import type { DiaryEntry, DiaryFinder, DiaryPet } from "../types/diary.type";

export const mockAdoptedPets: DiaryPet[] = [
    {
        id: "pet-happy",
        name: "Happy",
        imageURL: "",
        ageGroup: "Baby",
        color: "Light Golden",
        gender: "Female",
        breed: "Golden Retriever",
    },
    {
        id: "pet-mocha",
        name: "Mocha",
        imageURL: "",
        ageGroup: "Young",
        color: "Brown",
        gender: "Male",
        breed: "Local Mix",
    },
];

export const mockFinder: DiaryFinder = {
    name: "Marry",
    role: "Finder",
    phone: "099-426-9824",
    imageURL: "",
};

// Seeded on today so the page opens on the "filled" state from the mockups
// rather than an empty day.
export const mockEntries: DiaryEntry[] = [
    {
        id: "entry-seed-1",
        petId: "pet-happy",
        dateKey: toDateKey(new Date()),
        photo: null,
        imageURL: "",
        caption:
            "First time at the beach for Happy! She was so excited and had a blast playing in the waves. She didn't want to leave at all!",
    },
];
