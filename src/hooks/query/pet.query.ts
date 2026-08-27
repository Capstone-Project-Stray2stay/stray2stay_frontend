import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
    classifyPetAPI,
    petBreedsAPI,
    petColorsAPI,
    registerPetAPI,
  getRandomPetsAPI,
  getPetInfoAPI,
  deletePetAPI,
  searchPetsAPI,
  type PetSearchParams,
  type RandomPetResponseItem
} from "../../services/apis/pet.api"
import type { PetType, RehomeDraft } from "../../pages/rehome/rehome.type"

export function useClassifyPet() {
    return useMutation({
        mutationFn: async ({ petType, images }: { petType: PetType; images: File[] }) => {
            const res = await classifyPetAPI(petType, images)
            return res.data.pet_breed as string
        },
    })
}

export function useBreeds(petType: PetType | null) {
    const { data, isLoading } = useQuery({
        queryKey: ["petBreeds", petType],
        queryFn: async () => {
            const res = await petBreedsAPI(petType as PetType)
            return (res.data.breedData ?? []) as string[]
        },
        enabled: petType !== null,
        retry: false,
    })
    return { breeds: data ?? [], loading: isLoading }
}

export interface BreedFilterOption {
    value: string
    label: string
    species: PetType
}

/**
 * Breed options for the Adopt page's filter, where the species picker also
 * allows "all". useBreeds needs one concrete species, so this fetches dog and
 * cat breeds separately (skipping whichever one isn't relevant) and merges
 * them when no species is picked, tagging each with its species so a later
 * usePetColors(species, breed) call knows which one to use.
 */
export function useAdoptBreeds(category: PetType | "all") {
    const dogQuery = useBreeds(category !== "cat" ? "dog" : null)
    const catQuery = useBreeds(category !== "dog" ? "cat" : null)

    const dogItems: BreedFilterOption[] = dogQuery.breeds.map((b) => ({ value: b, label: b, species: "dog" }))
    const catItems: BreedFilterOption[] = catQuery.breeds.map((b) => ({ value: b, label: b, species: "cat" }))

    let breedItems: BreedFilterOption[]
    if (category === "dog") breedItems = dogItems
    else if (category === "cat") breedItems = catItems
    else {
        // "All": union of both species' breeds, deduped by name. If a breed
        // name happens to exist for both dog and cat, whichever came first
        // wins the species tag used for the color lookup — an inherent
        // limitation of a flat breed list when no species is picked.
        const seen = new Set<string>()
        breedItems = [...dogItems, ...catItems].filter((item) => {
            if (seen.has(item.value)) return false
            seen.add(item.value)
            return true
        })
    }

    return { breedItems, loading: dogQuery.loading || catQuery.loading }
}

export function usePetColors(petType: PetType | null, petBreed: string) {
    const { data, isLoading } = useQuery({
        queryKey: ["petColors", petType, petBreed],
        queryFn: async () => {
            const res = await petColorsAPI(petType as PetType, petBreed)
            // Capitalised keys — see petColorsAPI for why.
            const colorData = (res.data.colorData ?? []) as { Color: string; Image: string }[]
            return colorData
                .filter((entry) => entry.Color)
                .map((entry) => ({ value: entry.Color, label: entry.Color, image: entry.Image }))
        },
        enabled: petType !== null && petBreed !== "",
        retry: false,
    })
    return { colors: data ?? [], loading: isLoading }
}

export function useRegisterPet() {
    return useMutation({
        mutationFn: async (draft: RehomeDraft) => {
            const res = await registerPetAPI(draft)
            return res.data.petId as number
        },
    })
}
  
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

export function usePetInfo(pid: string | undefined) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["pets", "info", pid],
    queryFn: () => getPetInfoAPI(pid as string),
    enabled: !!pid,
    retry: false,
  })

  return { pet: data?.pet, isOwner: data?.isOwner ?? false, isLoading, isError }
}

export function useDeletePet() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (pid: string | number) => deletePetAPI(pid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pets"] })
    },
  })
}

export function useSearchPets(params: PetSearchParams) {
  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: ["pets", "search", params],
    queryFn: () => searchPetsAPI(params),
    // Keeps the current page's cards on screen while the next page loads,
    // instead of flashing empty/skeleton state on every click.
    placeholderData: keepPreviousData,
    retry: 1,
  })

  return {
    pets: data?.petsInfo ?? [],
    totalPages: data?.totalPages ?? 1,
    isLoading,
    isFetching,
    isError,
    error,
  }
}