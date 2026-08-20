/**
 * Vocabularies shared between the Adopt page (which filters on these values),
 * the Rehome wizard (which writes them to Pets.pet_ageGroup/pet_gender), and
 * Pet Preferences (Users_Preferences.pref_ageGroup/pref_gender). Keeping one
 * copy stops these from drifting apart, which would silently make registered
 * pets unfindable — or, for ageGroup, get silently coerced away by MySQL,
 * since a value outside the enum's exact set isn't just a case mismatch.
 *
 * `value` must match the DB enums verbatim:
 *   pet_gender/pref_gender:     ENUM('MALE','FEMALE')
 *   pet_ageGroup/pref_ageGroup: ENUM('BABY','JUVENILE','MATURE','SENIOR')
 */

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
