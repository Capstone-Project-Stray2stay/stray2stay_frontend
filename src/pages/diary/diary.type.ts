/** One photo + caption pinned to a single day. A day may hold several. */
export interface DiaryEntry {
    id: string;
    petId: string;
    /** Local YYYY-MM-DD — see toDateKey in ./dateUtils. */
    dateKey: string;
    /** null for seeded mock entries, which carry a plain URL instead. */
    photo: File | null;
    imageURL: string;
    caption: string;
}

/** A pet the signed-in user has adopted, as shown in the summary card. */
export interface DiaryPet {
    id: string;
    name: string;
    imageURL: string;
    ageGroup: string;
    color: string;
    gender: "Male" | "Female";
    breed: string;
}

/** The person who originally rehomed the pet. */
export interface DiaryFinder {
    name: string;
    role: string;
    phone: string;
    imageURL: string;
}
