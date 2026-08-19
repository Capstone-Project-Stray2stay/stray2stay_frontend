import { useQuery } from "@tanstack/react-query";

import { getRandomPetsAPI, type RandomPetResponseItem } from "../../services/apis/pet.api";

export function useRandomPets() {
  const { data, isLoading, isError, error } = useQuery<RandomPetResponseItem[]>({
    queryKey: ["pets", "random"],
    queryFn: getRandomPetsAPI,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  return {
    recommendedPets: data ?? [],
    isLoading,
    isError,
    error,
  };
}
