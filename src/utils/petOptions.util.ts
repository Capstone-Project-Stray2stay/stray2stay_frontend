/**
 * Vocabularies shared between the Adopt page (which filters on these values)
 * and the Rehome wizard (which writes them). Keeping one copy stops the two
 * from drifting apart, which would silently make registered pets unfindable.
 */

export const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
];

export const ageGroupOptions = [
    { value: "baby", label: "Baby" },
    { value: "young", label: "Young" },
    { value: "adult", label: "Adult" },
    { value: "senior", label: "Senior" },
];
