import type { PetDetailsDraft } from "../types/rehome.type";

export function missingFields(draft: PetDetailsDraft): string[] {
    const missing: string[] = [];

    if (draft.breed === "") missing.push("Breed");
    if (draft.color === "") missing.push("Color");
    if (draft.ageGroup === "") missing.push("Age Group");
    if (draft.gender === "") missing.push("Gender");
    if (draft.personality.length === 0) missing.push("at least one Personality");

    if (
        draft.location.state === "" ||
        draft.location.district === "" ||
        draft.location.subDistrict === ""
    ) {
        missing.push("Location");
    }

    if (draft.vaccinations.length === 0) missing.push("at least one Vaccination");
    if (draft.sterilized === null) missing.push("Sterilized");

    return missing;
}
