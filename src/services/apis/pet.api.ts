import axiosInstance from "../axios/axiosInstance";

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
