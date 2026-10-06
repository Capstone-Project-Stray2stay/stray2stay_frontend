import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
    adoptPetAPI,
    classifyPetAPI,
    petBreedsAPI,
    petBreedImagesAPI,
    petColorsAPI,
    registerPetAPI,
    updatePetAPI,
  getRandomPetsAPI,
  getMyPetsAPI,
  getPetInfoAPI,
  deletePetAPI,
  searchPetsAPI,
  getPetAdoptorsAPI,
  getScreeningAnswerAPI,
  selectAdopterAPI,
  getMyAdoptionRequestsAPI,
  cancelAdoptionRequestAPI,
  getScreeningQuestionsAPI,
  saveScreeningQuestionsAPI,
  uploadScreeningAnswerImageAPI,
  type PetSearchParams,
  type RandomPetResponseItem,
  type AdoptSubmission
} from "../../services/apis/pet.api"
import {
  getNotificationsAPI,
  markNotificationReadAPI,
  markAllNotificationsReadAPI,
} from "../../services/apis/notification.api"
import type { EditPetDraft, PetType, RehomeDraft } from "../../types/rehome.type"
import type { CustomScreeningQuestionDraft } from "../../types/profile.type"

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

/** One representative image per breed for a species, keyed by breed name. */
export function useBreedImages(petType: PetType | null) {
    const { data, isLoading } = useQuery({
        queryKey: ["petBreedImages", petType],
        queryFn: async () => {
            const res = await petBreedImagesAPI(petType as PetType)
            const imageData = (res.data.imageData ?? []) as { breed: string; image: string }[]
            const images: Record<string, string> = {}
            imageData.forEach((entry) => {
                if (entry.breed) images[entry.breed] = entry.image
            })
            return images
        },
        enabled: petType !== null,
        retry: false,
    })
    return { images: data ?? {}, loading: isLoading }
}

/** Pairs a plain breed list with its representative-image map into dropdown options. */
export function toBreedOptions(breeds: string[], images: Record<string, string>) {
    return breeds.map((b) => ({ value: b, label: b, image: images[b] }))
}

export interface BreedFilterOption {
    value: string
    label: string
    species: PetType
    image?: string
}

export function useAdoptBreeds(category: PetType | "all") {
    const dogQuery = useBreeds(category !== "cat" ? "dog" : null)
    const catQuery = useBreeds(category !== "dog" ? "cat" : null)
    const dogImages = useBreedImages(category !== "cat" ? "dog" : null)
    const catImages = useBreedImages(category !== "dog" ? "cat" : null)

    const dogItems: BreedFilterOption[] = dogQuery.breeds.map((b) => ({
        value: b,
        label: b,
        species: "dog",
        image: dogImages.images[b],
    }))
    const catItems: BreedFilterOption[] = catQuery.breeds.map((b) => ({
        value: b,
        label: b,
        species: "cat",
        image: catImages.images[b],
    }))

    let breedItems: BreedFilterOption[]
    if (category === "dog") breedItems = dogItems
    else if (category === "cat") breedItems = catItems
    else {
        const seen = new Set<string>()
        breedItems = [...dogItems, ...catItems].filter((item) => {
            if (seen.has(item.value)) return false
            seen.add(item.value)
            return true
        })
    }

    return {
        breedItems,
        loading: dogQuery.loading || catQuery.loading || dogImages.loading || catImages.loading,
    }
}

export function usePetColors(petType: PetType | null, petBreed: string) {
    const { data, isLoading } = useQuery({
        queryKey: ["petColors", petType, petBreed],
        queryFn: async () => {
            const res = await petColorsAPI(petType as PetType, petBreed)
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

export function useUpdatePet() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ pid, draft }: { pid: string | number; draft: EditPetDraft }) =>
            updatePetAPI(pid, draft),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pets"] })
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

  return {
    pet: data?.pet,
    isOwner: data?.isOwner ?? false,
    adoptionStatus: data?.adoptionStatus ?? "",
    isLoading,
    isError,
  }
}

export function useAdoptPet() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ pid, answers }: { pid: string | number; answers: AdoptSubmission }) =>
      adoptPetAPI(pid, answers),
    onSuccess: (_data, { pid }) => {
      queryClient.invalidateQueries({ queryKey: ["pets", "info", String(pid)] })
    },
  })
}

export function useMyPets() {
  const { data, isLoading, isError, error } = useQuery<RandomPetResponseItem[]>({
    queryKey: ["pets", "mine"],
    queryFn: getMyPetsAPI,
    retry: 1,
  });

  return {
    myPets: data ?? [],
    isLoading,
    isError,
    error,
  };
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

export function useMyPetAdoptors(enabled: boolean) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["pets", "adoptors", "mine"],
    queryFn: getPetAdoptorsAPI,
    enabled,
    retry: 1,
  })

  return {
    adoptorsByPet: data ?? [],
    isLoading,
    isError,
  }
}

export function useScreeningAnswer(pid: string | number, rid: number | undefined, enabled: boolean) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["pets", pid, "screening-answer", rid],
    queryFn: () => getScreeningAnswerAPI(pid, rid as number),
    enabled: enabled && rid !== undefined,
    retry: false,
  })

  return {
    answers: data,
    isLoading,
    isError,
  }
}

export function useSelectAdopter() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ pid, rid }: { pid: string | number; rid: number }) => selectAdopterAPI(pid, rid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pets", "adoptors", "mine"] })
    },
  })
}

export function useMyAdoptionRequests() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["pets", "adoptions", "mine"],
    queryFn: getMyAdoptionRequestsAPI,
    retry: 1,
  })

  return {
    adoptionRequests: data ?? [],
    isLoading,
    isError,
    error,
  }
}

export function useCancelAdoptionRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (rid: number) => cancelAdoptionRequestAPI(rid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pets", "adoptions", "mine"] })
    },
  })
}

export function useNotifications(enabled: boolean) {
  const query = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotificationsAPI,
    enabled,
    refetchInterval: enabled ? 30_000 : false,
    retry: 1,
  })

  return {
    notifications: query.data?.notifications ?? [],
    unreadCount: query.data?.unreadCount ?? 0,
    isLoading: query.isLoading,
  }
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: markNotificationReadAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: markAllNotificationsReadAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })
}

export function useScreeningQuestions(pid: string | number | undefined) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["pets", "screening-questions", pid],
    queryFn: () => getScreeningQuestionsAPI(pid as string | number),
    enabled: pid !== undefined && pid !== "",
    retry: false,
  })

  return {
    questions: data?.questions ?? [],
    locked: data?.locked ?? false,
    isLoading,
    isError,
  }
}

export function useSaveScreeningQuestions() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      pid,
      questions,
    }: {
      pid: string | number
      questions: CustomScreeningQuestionDraft[]
    }) => saveScreeningQuestionsAPI(pid, questions),
    onSuccess: (_data, { pid }) => {
      queryClient.invalidateQueries({ queryKey: ["pets", "screening-questions", String(pid)] })
    },
  })
}

export function useUploadScreeningAnswerImage() {
  return useMutation({
    mutationFn: ({ pid, file }: { pid: string | number; file: File }) =>
      uploadScreeningAnswerImageAPI(pid, file),
  })
}
