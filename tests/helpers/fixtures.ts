import type { RandomPetResponseItem } from "../../src/services/apis/pet.api";
import type { NotificationResponse } from "../../src/services/apis/notification.api";

/** A pet row as the Go handlers encode it, with per-test overrides. */
export function petCard(overrides: Partial<RandomPetResponseItem> = {}): RandomPetResponseItem {
    return {
        pid: 1,
        petName: "Mochi",
        petImageAddress: ["https://cdn.example.test/mochi.jpg"],
        petAgeGroup: "BABY",
        petGender: "MALE",
        petType: "dog",
        petBreed: "Shiba Inu",
        petColor: "Cream",
        petAddress: "12 Soi 3, Bang Mod, Thung Khru, Bangkok",
        petAddressLat: 13.65,
        petAddressLong: 100.49,
        ...overrides,
    };
}

/** The `/pets/:pid` envelope, including the fields Go leaves null when unset. */
export function petDetail(overrides: Record<string, unknown> = {}) {
    return {
        pid: 1,
        petName: "Mochi",
        petDetail: "Loves long walks.",
        petImageAddress: ["https://cdn.example.test/mochi.jpg"],
        petPersonality: ["Playful"],
        petSpecialCare: null,
        petAgeGroup: "BABY",
        petGender: "MALE",
        petType: "dog",
        petBreed: "Shiba Inu",
        petColor: "Cream",
        petSterilized: true,
        petVaccination: ["Rabies"],
        petAddress: "12 Soi 3, Bang Mod, Thung Khru, Bangkok",
        petAddressLat: 13.65,
        petAddressLong: 100.49,
        status: "AVAILABLE",
        note: "Needs a fenced yard.",
        ...overrides,
    };
}

export function notification(
    overrides: Partial<NotificationResponse> = {},
): NotificationResponse {
    return {
        id: 1,
        type: "ADOPTION_REQUESTED",
        title: "New adoption request",
        message: "Someone applied to adopt Mochi.",
        petId: 1,
        isRead: false,
        createdAt: "2026-01-02T03:04:05Z",
        ...overrides,
    };
}
