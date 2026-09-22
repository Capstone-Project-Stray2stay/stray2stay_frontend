import { z } from "zod";

import { SCREENING_SECTIONS } from "../utils/screeningForm";

const requiredAnswer = z.boolean().nullable().refine((v): v is boolean => v !== null);
const requiredText = z.string().trim().min(1);
const requiredChoiceLabel = z.string().min(1);
const requiredChoiceIndex = z.number().nullable().refine((v): v is number => v !== null);

export const screeningAnswersSchema = z.object({
    Q1_1: requiredAnswer,
    Q1_2: requiredAnswer,
    Q1_3: requiredText,
    Q2_1: requiredChoiceLabel,
    Q2_2: requiredAnswer,
    Q2_3: requiredAnswer,
    Q3_1: requiredText,
    Q3_2: requiredAnswer,
    Q3_3: requiredText,
    Q4_1: requiredChoiceIndex,
    Q5_1: requiredChoiceIndex,
    Q6_1: requiredChoiceIndex,
    Q6_2: requiredChoiceIndex,
    Note: z.string(),
});

const QUESTION_NUMBERS: Record<string, string> = Object.fromEntries(
    SCREENING_SECTIONS.flatMap((section) => section.questions.map((q) => [q.id, q.number])),
);

/** Turns a failed screeningAnswersSchema parse into "1.1, 1.2, ..." labels for the form's error text. */
export function screeningMissingNumbers(error: z.ZodError): string[] {
    const numbers = new Set<string>();
    for (const issue of error.issues) {
        const number = QUESTION_NUMBERS[issue.path[0] as string];
        if (number) numbers.add(number);
    }
    return [...numbers];
}
