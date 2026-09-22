export type InfoTab = "personal" | "preferences";

export type ListTab = "rehoming" | "adoptions";

export type AdoptionStatus = "success" | "pending" | "denied";

export type Species = "dog" | "cat";

export interface PersonalInfoDraft {
    firstName: string;
    lastName: string;
    phone: string;
    state: string;
    district: string;
    subDistrict: string;
    street: string;
    lat: number | null;
    long: number | null;
}

export const EMPTY_PERSONAL_INFO: PersonalInfoDraft = {
    firstName: "",
    lastName: "",
    phone: "",
    state: "",
    district: "",
    subDistrict: "",
    street: "",
    lat: null,
    long: null,
};

export interface PetPreferenceDraft {
    breed: string;
    color: string;
    ageGroup: string;
    gender: string;
}

export const EMPTY_PET_PREFERENCE: PetPreferenceDraft = {
    breed: "",
    color: "",
    ageGroup: "",
    gender: "",
};

export interface ScreeningAnswers {
    Q1_1: boolean;
    Q1_2: boolean;
    Q1_3: string;
    Q2_1: string;
    Q2_2: boolean;
    Q2_3: boolean;
    Q3_1: number;
    Q3_2: boolean;
    Q3_3: string;
    Q4_1: number;
    Q5_1: number;
    Q6_1: number;
    Q6_2: number;
    Note: string;
}

/** ScreeningAnswers plus the owner's custom-question answers — the shape getScreeningAnswerAPI actually returns. Kept separate from ScreeningAnswers so `keyof ScreeningAnswers` (used to type the fixed question ids in screeningForm.ts) isn't polluted. */
export interface ScreeningAnswersWithCustom extends ScreeningAnswers {
    /** Key matches domain.ScreeningAnswer's untagged Go field name. */
    CustomAnswers?: CustomAnswerResponse[];
}

export type CustomQuestionType = "CHECKLIST" | "MULTIPLE_CHOICE" | "ESSAY" | "IMAGE";

/** A custom question an owner defined for one pet's screening form. */
export interface CustomScreeningQuestion {
    questionId: number;
    questionType: CustomQuestionType;
    questionText: string;
    questionOptions?: string[];
    questionRequired: boolean;
    questionOrder: number;
}

/** Draft shape used by the question-builder UI, before a question has an id (not yet saved). */
export interface CustomScreeningQuestionDraft {
    questionType: CustomQuestionType;
    questionText: string;
    questionOptions: string[];
    questionRequired: boolean;
    questionOrder: number;
}

/** One answer to a custom question, submitted alongside the fixed AdoptSubmission fields. */
export interface CustomScreeningAnswer {
    questionId: number;
    value: string | string[];
}

/** A submitted custom answer paired back with its question's text/type, for the owner's read-only view. */
export interface CustomAnswerResponse {
    questionId: number;
    questionText: string;
    questionType: CustomQuestionType;
    value: string | string[];
}

export interface RehomingInterest {
    id: string;
    rid: number;
    name: string;
    phone: string;
    imageURL?: string;
    status: "pending" | "accepted";
}

export interface RehomingPet {
    id: string;
    name: string;
    imageURL: string;
}

export interface AdoptedPet {
    id: string;
    rid: number;
    name: string;
    phone: string;
    imageURL: string;
    status: AdoptionStatus;
}
