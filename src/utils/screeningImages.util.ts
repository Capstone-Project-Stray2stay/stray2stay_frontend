import { uploadScreeningAnswerImageAPI } from "../services/apis/pet.api";
import type { CustomScreeningQuestionDraft } from "../types/profile.type";

/**
 * Photos an owner adds to an IMAGE question stay in the browser until the questions are saved:
 * the pet may not exist yet (Register a Pet, step 4), and a photo removed before saving should
 * never be uploaded. Each staged file is shown through a blob: URL that also serves as its key.
 */
const staged = new Map<string, File>();

export function stageScreeningImage(file: File): string {
    const url = URL.createObjectURL(file);
    staged.set(url, file);
    return url;
}

/** Forgets a staged photo (no-op for an already-uploaded URL). */
export function discardScreeningImage(url: string): void {
    if (!staged.has(url)) return;
    staged.delete(url);
    URL.revokeObjectURL(url);
}

/** Uploads every staged photo the questions still use and returns the questions with real URLs. */
export async function uploadStagedScreeningImages(
    pid: string | number,
    questions: CustomScreeningQuestionDraft[],
): Promise<CustomScreeningQuestionDraft[]> {
    const uploaded = new Map<string, string>();
    const pending = questions
        .filter((q) => q.questionType === "IMAGE")
        .flatMap((q) => q.questionOptions)
        .filter((url) => staged.has(url));

    await Promise.all(
        pending.map(async (url) => {
            uploaded.set(url, await uploadScreeningAnswerImageAPI(pid, staged.get(url)!));
        }),
    );
    pending.forEach(discardScreeningImage);

    return questions.map((q) =>
        q.questionType === "IMAGE"
            ? { ...q, questionOptions: q.questionOptions.map((url) => uploaded.get(url) ?? url) }
            : q,
    );
}
