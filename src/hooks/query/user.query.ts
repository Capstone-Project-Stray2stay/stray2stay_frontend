import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { getUserInfoAPI, updateUserAPI, updateUserImageAPI } from "../../services/apis/user.api"
import type { UpdateUserPayload } from "../../services/apis/user.api"
import { splitAddress } from "../../pages/profile/address.util"
import type { PersonalInfoDraft, PetPreferenceDraft } from "../../pages/profile/profile.type"

export function useUpdateUser() {
    return useMutation({
        mutationFn: (payload: UpdateUserPayload) => updateUserAPI(payload),
    })
}

export function useUpdateUserImage() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (image: File) => updateUserImageAPI(image),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["userInfo"] })
        },
    })
}

export function useUserInfo(options?: { enabled?: boolean }) {
    const { data, isLoading } = useQuery({
        queryKey: ["userInfo"],
        queryFn: async () => {
            const res = await getUserInfoAPI()
            return res.data.userData
        },
        retry: false,
        enabled: options?.enabled ?? true,
    })

    const personalInfo: PersonalInfoDraft | undefined = data
        ? {
            firstName: data.Firstname ?? "",
            lastName: data.Lastname ?? "",
            phone: data.Phone ?? "",
            ...splitAddress(data.Address ?? ""),
            // GET /user/info has no stored lat/long, so this stays unset until
            // the user picks a sub-district again — resolved on submit either
            // way (see userInformation.page.tsx's geocode fallback).
            lat: null,
            long: null,
        }
        : undefined

    const dogPreference: PetPreferenceDraft | undefined = data
        ? {
            breed: data.DogBreed ?? "",
            color: data.DogColor ?? "",
            ageGroup: data.DogAgeGroup ?? "",
            gender: data.DogGender ?? "",
        }
        : undefined

    const catPreference: PetPreferenceDraft | undefined = data
        ? {
            breed: data.CatBreed ?? "",
            color: data.CatColor ?? "",
            ageGroup: data.CatAgeGroup ?? "",
            gender: data.CatGender ?? "",
        }
        : undefined

    const imageURL: string | null = data?.CoverImage ?? null

    return { personalInfo, dogPreference, catPreference, imageURL, loading: isLoading }
}
