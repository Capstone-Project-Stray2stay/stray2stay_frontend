import axiosInstance from "../axios/axiosInstance";

import { resolveLocation } from "../../pages/rehome/location";
import type { RehomeDraft } from "../../pages/rehome/rehome.type";

/**
 * Ask the backend to detect a pet's breed from 1-2 photos.
 *
 * The Go handler reads the files from the "images" multipart field and proxies
 * them to the AI service, returning only the top prediction as { pet_breed }.
 */
export async function classifyPetAPI(petType: "dog" | "cat", images: File[]) {
    const formData = new FormData();
    images.forEach((image) => formData.append("images", image));

    const res = await axiosInstance.post(`/pets/ai/classify?type=${petType}`, formData, {
        // axiosInstance defaults to 5s, but the Go proxy alone allows the AI
        // service 10s and model inference plus the upload can exceed that.
        // Content-Type is deliberately left unset so the browser adds the
        // multipart boundary — setting it by hand produces an unparseable body.
        timeout: 30000,
    });

    if (res.status === 200) {
        return res;
    }
    throw new Error("Breed classification failed");
}

/** Breeds available for a species. Response envelope key is `breedData`. */
export async function petBreedsAPI(petType: "dog" | "cat") {
    const res = await axiosInstance.get(`/pets/breeds?petType=${petType}`);
    if (res.status === 200) {
        return res;
    }
    throw new Error("Failed to fetch breeds");
}

/**
 * Colors available for one breed — the endpoint needs the breed too, not just
 * the species. Response envelope key is `colorData`, and each entry uses
 * CAPITALISED keys (`Color`, `Image`) because domain.PetColorResponse declares
 * only bson tags, so Fiber marshals the Go field names.
 */
export async function petColorsAPI(petType: "dog" | "cat", petBreed: string) {
    const res = await axiosInstance.get(
        `/pets/breed/color?petType=${petType}&petBreed=${encodeURIComponent(petBreed)}`,
    );
    if (res.status === 200) {
        return res;
    }
    throw new Error("Failed to fetch colors");
}

export async function registerPetAPI(draft: RehomeDraft) {
    if (draft.petType === null) {
        throw new Error("Pet type is required");
    }

    const location = resolveLocation(draft.location);
    const formData = new FormData();

    // The name field is optional in the UI because many strays have never been
    // named, but the backend marks petName `required` and rejects "". Until that
    // validation is relaxed server-side, stand in a placeholder.
    // TODO: drop this once petName loses `validate:"required"`.
    formData.append("petName", draft.name.trim() || "Unnamed");
    formData.append("petType", draft.petType);
    formData.append("petBreed", draft.breed);
    formData.append("petColor", draft.color);
    formData.append("petAgeGroup", draft.ageGroup);
    formData.append("petGender", draft.gender);
    // Backend stores special care as a single string.
    formData.append("petSpecialCare", draft.specialCare.join(", "));
    formData.append("petSterilized", String(draft.sterilized === true));
    formData.append("petAddress", location.address);
    formData.append("petAddressLat", String(location.lat));
    formData.append("petAddressLong", String(location.long));
    formData.append("status", "true");
    formData.append("note", draft.note);

    // Repeated keys — Fiber's BodyParser decodes these into []string.
    draft.personality.forEach((item) => formData.append("petPersonality", item));
    draft.vaccinations.forEach((item) => formData.append("petVaccination", item));

    draft.photos.forEach((photo) => formData.append("images", photo));

    const res = await axiosInstance.post("/pets", formData, {
        // Uploads up to 4 photos, well past axiosInstance's 5s default.
        timeout: 60000,
    });

    if (res.status === 200 || res.status === 201) {
        return res;
    }
    throw new Error("Failed to register pet");
}

export interface RandomPetResponseItem {
  pid: number;
  petName: string;
  petImageAddress: string[];
  petAgeGroup: string;
  petGender: string;
  petType: string;
  petBreed: string;
  petColor: string;
  petAddress: string;
  petAddressLat: number;
  petAddressLong: number;
}

export async function getRandomPetsAPI(): Promise<RandomPetResponseItem[]> {
  const res = await axiosInstance.get("/pets/random");

  if (res.status === 200) {
    return res.data.petsInfo ?? [];
  }

  throw new Error("Failed to fetch random pets");
}
