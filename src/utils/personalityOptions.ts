/**
 * Fixed pick-list the owner tags this specific pet with, stored in
 * petPersonality[]. Deliberately NOT sourced from /api/pets/breed/behavior —
 * that endpoint returns a single prose string describing the breed's typical
 * temperament, which is a different thing entirely.
 */
export const PERSONALITY_OPTIONS = [
    "Friendly",
    "Playful",
    "Affectionate",
    "Shy",
    "Anxious",
    "Quiet",
    "Smart",
    "Energetic",
    "Peaceful",
    "Independent",
];
