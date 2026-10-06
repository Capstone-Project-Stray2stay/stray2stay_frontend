/** How the signed-in user is attached to a pet. Only ADOPTER may write. */
export type DiaryRole = "ADOPTER" | "FINDER";

/**
 * A pet whose diary the user can open, as returned by GET /pets/mine/diaries.
 * Carries the pet card, the other party's contact card, and the earliest
 * writable day in one payload, so the page needs no per-pet follow-up request.
 */
export interface DiaryPet {
    pid: number;
    petName: string;
    petImageAddress: string[];
    petAgeGroup: string;
    petGender: string;
    petBreed: string;
    petColor: string;
    role: DiaryRole;
    canWrite: boolean;
    /** YYYY-MM-DD — the adoption date; entries cannot predate it. */
    since: string;
    /** The other party: the finder when you adopted, the adopter when you rehomed. */
    counterpartName: string;
    counterpartRole: string;
    counterpartPhone: string;
    counterpartImage: string;
}

/** One day's photo and caption. A day holds at most one. */
export interface DiaryEntry {
    did: number;
    pid: number;
    /** YYYY-MM-DD */
    date: string;
    imageAddress: string;
    caption: string;
}
