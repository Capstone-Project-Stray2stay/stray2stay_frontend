import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { getUserInfoAPI, updateUserAPI, updateUserImageAPI } from "../../services/apis/user.api"
import type { UpdateUserPayload, UserInfoData } from "../../services/apis/user.api"
import { splitAddress } from "../../utils/address.util"
import { emptyPetPreference, type PersonalInfoDraft, type PetPreferenceDraft } from "../../types/profile.type"

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
            lat: null,
            long: null,
        }
        : undefined

    const preferences: PetPreferenceDraft[] | undefined = data
        ? ((data as UserInfoData).Preferences ?? []).map((p) => ({
            ...emptyPetPreference(p.petType === "DOG" ? "dog" : "cat"),
            breed: p.breed ?? "",
            color: p.color ?? "",
            ageGroup: p.ageGroup ?? "",
            gender: p.gender ?? "",
        }))
        : undefined

    const imageURL: string | null = data?.CoverImage ?? null

    return { personalInfo, preferences, imageURL, loading: isLoading }
}
