/** Fixture data shared by the stub backend and the specs that assert against it. */

export const USER = {
    email: "ada@example.com",
    password: "password123",
    firstname: "Ada",
    lastname: "Lovelace",
};

const DOG_BREEDS = ["Shiba Inu", "Corgi", "Beagle", "Poodle"];
const CAT_BREEDS = ["Siamese", "Persian"];

export const BREEDS = { dog: DOG_BREEDS, cat: CAT_BREEDS };

const AGE_GROUPS = ["BABY", "JUVENILE", "MATURE", "SENIOR"];
const GENDERS = ["MALE", "FEMALE"];
const DISTRICTS = ["Thung Khru", "Sathon", "Bang Rak", "Chatuchak"];

/**
 * 20 pets so the 16-per-page grid spills onto a second page, and a deterministic spread
 * of species / breeds / genders so filter assertions have something to bite on.
 * Images point at a local asset — the stub serves no CDN and a broken <img> would make
 * screenshots noisy.
 */
export const PETS = Array.from({ length: 20 }, (_, i) => {
    const petType = i % 4 === 3 ? "cat" : "dog";
    const breeds = BREEDS[petType];
    const district = DISTRICTS[i % DISTRICTS.length];
    return {
        pid: i + 1,
        petName: `Pet ${i + 1}`,
        petImageAddress: ["/favicon.png"],
        petAgeGroup: AGE_GROUPS[i % AGE_GROUPS.length],
        petGender: GENDERS[i % GENDERS.length],
        petType,
        petBreed: breeds[Math.floor(i / 4) % breeds.length],
        petColor: i % 2 === 0 ? "Cream" : "Black",
        petAddress: `${i + 1} Soi ${i}, Bang Mod, ${district}, Bangkok`,
        petAddressLat: 13.65,
        petAddressLong: 100.49,
    };
});

/** pid 20 is deliberately already adopted so a spec can assert the closed-off state. */
export const ADOPTED_PID = 20;

export function petDetail(pid) {
    const pet = PETS.find((p) => p.pid === Number(pid));
    if (!pet) return undefined;
    return {
        ...pet,
        petDetail: `${pet.petName} is friendly and house-trained.`,
        petPersonality: ["Playful"],
        petSpecialCare: null,
        petSterilized: pet.pid % 2 === 0,
        petVaccination: ["Rabies"],
        status: pet.pid === ADOPTED_PID ? "ADOPTED" : "AVAILABLE",
        note: `Notes for ${pet.petName}.`,
    };
}

export const NOTIFICATIONS = [
    {
        id: 1,
        type: "ADOPTION_REQUESTED",
        title: "New adoption request",
        message: "Someone applied to adopt Pet 1.",
        petId: 1,
        isRead: false,
        createdAt: "2026-01-02T03:04:05Z",
    },
    {
        id: 2,
        type: "ADOPTION_SELECTED",
        title: "You were selected",
        message: "You were chosen to adopt Pet 2.",
        petId: 2,
        isRead: false,
        createdAt: "2026-01-03T03:04:05Z",
    },
];
