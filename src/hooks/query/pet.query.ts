import { useMutation, useQuery } from "@tanstack/react-query"

import {
    classifyPetAPI,
    petBreedsAPI,
    petColorsAPI,
    registerPetAPI,
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

export function usePetColors(petType: PetType | null, petBreed: string) {
    const { data, isLoading } = useQuery({
        queryKey: ["petColors", petType, petBreed],
        queryFn: async () => {
            const res = await petColorsAPI(petType as PetType, petBreed)
            // Capitalised keys — see petColorsAPI for why.
            const colorData = (res.data.colorData ?? []) as { Color: string; Image: string }[]
            return colorData.map((entry) => entry.Color).filter(Boolean)
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
