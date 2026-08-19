/** Which form the left card's menu is showing. */
export type InfoTab = "personal" | "preferences";

/** Which list the bottom card is showing. */
export type ListTab = "rehoming" | "adoptions";

export type AdoptionStatus = "success" | "pending";

export type Species = "dog" | "cat";

export interface PersonalInfoDraft {
    firstName: string;
    lastName: string;
    phone: string;
    /**
     * The backend stores a single `user_address` string, but the design splits
     * it into four selects. Kept apart here so the form can round-trip; joining
     * them is a concern for whoever wires up PUT /user/update.
     */
    state: string;
    district: string;
    subDistrict: string;
    street: string;
}

export interface PetPreferenceDraft {
    breed: string;
    color: string;
    ageGroup: string;
    gender: string;
}

/** One person who applied to adopt a pet the user is rehoming. */
export interface RehomingInterest {
    id: string;
    name: string;
    phone: string;
    imageURL: string;
}

export interface RehomingPet {
    id: string;
    name: string;
    imageURL: string;
    interests: RehomingInterest[];
}

export interface AdoptedPet {
    id: string;
    name: string;
    /** Phone of the pet's rehomer, shown so the adopter can follow up. */
    phone: string;
    imageURL: string;
    status: AdoptionStatus;
}
