import type { ScreeningAnswers } from "../types/profile.type";

export type ScreeningQuestion = {
    id: keyof ScreeningAnswers;
    number: string;
    text: string;
} & (
    | { kind: "boolean" }
    | { kind: "choice"; options: string[]; layout: "inline" | "stacked" }
    | { kind: "text" }
);

export interface ScreeningSection {
    title: string;
    questions: ScreeningQuestion[];
}

export const SCREENING_SECTIONS: ScreeningSection[] = [
    {
        title: "Readiness & Experience",
        questions: [
            {
                id: "Q1_1",
                number: "1.1",
                text: "Have you ever owned a dog or cat before?",
                kind: "boolean",
            },
            {
                id: "Q1_2",
                number: "1.2",
                text: "Are you familiar with the basic vaccination and medical needs for this type of pet?",
                kind: "boolean",
            },
            {
                id: "Q1_3",
                number: "1.3",
                text: "Why have you decided to adopt a pet at this time?",
                kind: "text",
            },
        ],
    },
    {
        title: "Living Environment",
        questions: [
            {
                id: "Q2_1",
                number: "2.1",
                text: "What is your current type of residence?",
                kind: "choice",
                layout: "inline",
                options: ["House", "Townhouse", "Apartment / Dormitory", "Condo"],
            },
            {
                id: "Q2_2",
                number: "2.2",
                text: "Does your residence explicitly allow pets?",
                kind: "boolean",
            },
            {
                id: "Q2_3",
                number: "2.3",
                text: "Do you have a secure, fenced area or a dedicated indoor space for the pet?",
                kind: "boolean",
            },
        ],
    },
    {
        title: "Lifestyle & Responsibility",
        questions: [
            {
                id: "Q3_1",
                number: "3.1",
                text: "On average, how many hours per day will the pet be left alone?",
                kind: "text",
            },
            {
                id: "Q3_2",
                number: "3.2",
                text: "Does everyone in your household agree to adopt this pet?",
                kind: "boolean",
            },
            {
                id: "Q3_3",
                number: "3.3",
                text: "Do you have other pets? If yes, are they socialized and up-to-date on vaccinations?",
                kind: "text",
            },
        ],
    },
    {
        title: "Financial & Long-term Commitment",
        questions: [
            {
                id: "Q4_1",
                number: "4.1",
                text: "Are you prepared for the ongoing costs of pet ownership (e.g., food, grooming, and routine/emergency veterinary care)?",
                kind: "choice",
                layout: "stacked",
                options: [
                    "Yes, I have a stable budget for all pet expenses",
                    "I am prepared for basics, but might need help with emergencies.",
                    "No, I am currently on a tight budget.",
                ],
            },
        ],
    },
    {
        title: "Special Needs",
        questions: [
            {
                id: "Q5_1",
                number: "5.1",
                text: "Are you willing and able to manage a pet with Special Needs (e.g., daily medication, frequent vet visits, or physical therapy)?",
                kind: "choice",
                layout: "stacked",
                options: [
                    "Yes, I am fully prepared and have experience with special needs pets.",
                    "Yes, I am willing to learn and provide the necessary care.",
                    "It depends on the specific condition of the pet.",
                    "No, I am looking for a pet with no major health issues.",
                ],
            },
        ],
    },
    {
        title: "Follow-up & Policy",
        questions: [
            {
                id: "Q6_1",
                number: "6.1",
                text: "Are you willing to provide regular updates on the pet's well-being through our Diary feature?",
                kind: "choice",
                layout: "stacked",
                options: [
                    "Yes, I'm happy to provide frequent and consistent updates.",
                    "Yes, I can provide updates on a monthly or occasional basis.",
                    "I have a busy schedule but will try my best to update whenever possible.",
                    "I prefer not to provide regular updates but can respond to direct inquiries.",
                    "I am not comfortable sharing updates through the platform.",
                ],
            },
            {
                id: "Q6_2",
                number: "6.2",
                text: "If you can no longer care for a pet, do you agree to return it to the finder or rehome it through this platform instead of abandoning it?",
                kind: "choice",
                layout: "stacked",
                options: [
                    "Yes, I fully agree to return the pet or use this platform to find a new home.",
                    "Yes, I agree, but I would like to discuss the return process with the finder first.",
                    "I will try to find a responsible friend or family member first, then inform the finder.",
                    "I am not sure at the moment.",
                    "No, I believe I should have full discretion over the pet's future once adopted.",
                ],
            },
        ],
    },
    {
        title: "Other Notes",
        questions: [{ id: "Note", number: "", text: "", kind: "text" }],
    },
];
