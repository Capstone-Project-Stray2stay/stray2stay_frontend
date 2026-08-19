// TODO: replace with real taxonomy/API data once a pets API exists
export const breedOptions = [
    { value: "local-mix", label: "Local Mix" },
    { value: "poodle", label: "Poodle" },
    { value: "shih-tzu", label: "Shih Tzu" },
    { value: "persian", label: "Persian" },
    { value: "siamese", label: "Siamese" },
];

export const colorOptions = [
    { value: "black", label: "Black" },
    { value: "white", label: "White" },
    { value: "brown", label: "Brown" },
    { value: "orange", label: "Orange" },
    { value: "mixed", label: "Mixed" },
];

// Gender and age group are shared with the Rehome wizard — single source of
// truth lives in utils so the values Adopt filters on can't drift from the
// values Rehome writes. Re-exported here so existing imports keep working.
export { genderOptions, ageGroupOptions } from "../../utils/petOptions.util";

export const locationOptions = [
    { value: "bangkok", label: "Bangkok" },
    { value: "chiang-mai", label: "Chiang Mai" },
    { value: "khon-kaen", label: "Khon Kaen" },
    { value: "phuket", label: "Phuket" },
    { value: "nonthaburi", label: "Nonthaburi" },
];
