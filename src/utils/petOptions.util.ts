
export const genderOptions = [
    { value: "MALE", label: "Male" },
    { value: "FEMALE", label: "Female" },
];

export const ageGroupOptions = [
    { value: "BABY", label: "Baby" },
    { value: "JUVENILE", label: "Juvenile" },
    { value: "MATURE", label: "Mature" },
    { value: "SENIOR", label: "Senior" },
];

export function formatGender(gender: string): string {
    const normalized = gender?.toLowerCase();
    if (normalized === "male") return "Male";
    if (normalized === "female") return "Female";
    return gender || "Unknown";
}

/** "BABY" as stored becomes the "Baby" the designs show. */
export function formatAgeGroup(ageGroup: string): string {
    const match = ageGroupOptions.find(
        (option) => option.value.toLowerCase() === ageGroup?.toLowerCase(),
    );
    return match?.label ?? ageGroup ?? "";
}
