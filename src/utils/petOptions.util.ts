
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
