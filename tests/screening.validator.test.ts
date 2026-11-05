import { describe, expect, it } from "bun:test";
import { OTHER_OPTION, type CustomScreeningQuestionDraft } from "../src/types/profile.type";
import { screeningAnswersSchema, screeningMissingNumbers } from "../src/validators/screening.validator";
import { screeningQuestionsError } from "../src/validators/screeningQuestions.validator";

const validAnswers = {
    Q1_1: false,
    Q1_2: true,
    Q1_3: "I have cared for dogs before",
    Q2_1: "House",
    Q2_2: false,
    Q2_3: true,
    Q3_1: "A family member",
    Q3_2: false,
    Q3_3: "Walks and playtime",
    Q4_1: 1,
    Q5_1: 0,
    Q6_1: 2,
    Q6_2: 1,
    Note: "",
};

const question = (overrides: Partial<CustomScreeningQuestionDraft>): CustomScreeningQuestionDraft => ({
    questionType: "ESSAY",
    questionText: "Why are you interested in this pet?",
    questionOptions: [],
    questionRequired: true,
    questionOrder: 0,
    ...overrides,
});

describe("screeningAnswersSchema", () => {
    it("accepts false answers and zero-based choices", () => {
        expect(screeningAnswersSchema.safeParse(validAnswers).success).toBe(true);
    });

    it("rejects unanswered required fields and identifies the form question number", () => {
        const result = screeningAnswersSchema.safeParse({ ...validAnswers, Q1_1: null, Q1_3: "   " });
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(screeningMissingNumbers(result.error)).toEqual(["1.1", "1.3"]);
        }
    });
});

describe("screeningQuestionsError", () => {
    it("requires prompt text except for image questions", () => {
        expect(screeningQuestionsError([question({ questionText: "  " })])).toBe("Question 1 needs question text.");
        expect(screeningQuestionsError([question({ questionType: "IMAGE", questionText: "", questionOptions: ["photo.jpg"] })])).toBe("");
    });

    it("requires two non-empty multiple-choice options while counting Other as an option", () => {
        expect(screeningQuestionsError([question({ questionType: "MULTIPLE_CHOICE", questionOptions: [OTHER_OPTION] })]))
            .toBe("Question 1 needs at least 2 options.");
        expect(screeningQuestionsError([question({ questionType: "CHECKLIST", questionOptions: ["Home", "   "] })]))
            .toBe("Question 1 has an empty option.");
        expect(screeningQuestionsError([question({ questionType: "MULTIPLE_CHOICE", questionOptions: ["Home", OTHER_OPTION] })]))
            .toBe("");
    });

    it("requires at least one image for an image question", () => {
        expect(screeningQuestionsError([question({ questionType: "IMAGE", questionText: "", questionOptions: [] })]))
            .toBe("Question 1 needs at least one photo.");
    });
});
