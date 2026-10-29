import { OTHER_OPTION, type CustomScreeningQuestionDraft } from "../types/profile.type";

/**
 * Checks an owner's custom screening questions before they are saved.
 * Returns the first problem as a user-facing message, or "" when everything is fine.
 */
export function screeningQuestionsError(questions: CustomScreeningQuestionDraft[]): string {
    for (const [i, q] of questions.entries()) {
        const label = `Question ${i + 1}`;
        // An image question's caption is optional; every other type needs its text
        if (q.questionType !== "IMAGE" && q.questionText.trim() === "") {
            return `${label} needs question text.`;
        }

        if (q.questionType === "MULTIPLE_CHOICE" || q.questionType === "CHECKLIST") {
            const choices = q.questionOptions.filter((o) => o !== OTHER_OPTION);
            if (choices.some((o) => o.trim() === "")) {
                return `${label} has an empty option.`;
            }
            // "Other" counts as one of the two choices an adopter can pick between
            if (q.questionOptions.length < 2) {
                return `${label} needs at least 2 options.`;
            }
        }

        if (q.questionType === "IMAGE" && q.questionOptions.length === 0) {
            return `${label} needs at least one photo.`;
        }
    }
    return "";
}
