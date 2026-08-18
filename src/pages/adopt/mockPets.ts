// TODO: replace with a real pets API/hook once one exists (see src/hooks/query/, src/services/apis/)
export interface MockPet {
    id: string;
    name: string;
    imageURL: string;
    age: string;
    breed: string;
    color: string;
    gender: "Male" | "Female";
    location: string;
    category: "dog" | "cat";
}

const DOG_BREEDS = ["Local Mix", "Poodle", "Shih Tzu", "Pomeranian", "Labrador"];
const CAT_BREEDS = ["Local Mix", "Persian", "Siamese", "British Shorthair", "Scottish Fold"];
const AGES = ["Baby", "Young", "Adult", "Senior"];
const COLORS = ["Black", "White", "Brown", "Orange", "Mixed"];
const LOCATIONS = ["Bangkok", "Chiang Mai", "Khon Kaen", "Phuket", "Nonthaburi"];

// 64 pets = 4 pages of 16 (4x4 grid per page), matching the Figma mock's "1 2 3 4" pagination
export const mockPets: MockPet[] = Array.from({ length: 64 }, (_, i) => {
    const category: MockPet["category"] = i % 2 === 0 ? "dog" : "cat";
    const breeds = category === "dog" ? DOG_BREEDS : CAT_BREEDS;
    return {
        id: `pet-${i + 1}`,
        name: `${category === "dog" ? "Dog" : "Cat"} ${i + 1}`,
        imageURL: "",
        age: AGES[i % AGES.length],
        breed: breeds[i % breeds.length],
        color: COLORS[i % COLORS.length],
        gender: i % 2 === 0 ? "Male" : "Female",
        location: LOCATIONS[i % LOCATIONS.length],
        category,
    };
});
