import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
    deleteDiaryEntryAPI,
    diaryEntriesAPI,
    myDiaryPetsAPI,
    saveDiaryEntryAPI,
} from "../../services/apis/diary.api"
import type { DiaryEntry, DiaryPet } from "../../types/diary.type"

export function useMyDiaryPets() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["diaryPets"],
        queryFn: async () => {
            const res = await myDiaryPetsAPI()
            return (res.data.diaryPets ?? []) as DiaryPet[]
        },
        retry: false,
    })
    return { diaryPets: data ?? [], loading: isLoading, error: isError }
}

/**
 * Entries for one pet over one month. Keyed by the range so paging the
 * calendar swaps to a separate cache entry rather than refetching over the
 * same one, and returning to a month you have already seen is instant.
 */
export function useDiaryEntries(pid: number | null, from: string, to: string) {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["diaryEntries", pid, from, to],
        queryFn: async () => {
            const res = await diaryEntriesAPI(pid as number, from, to)
            return (res.data.entries ?? []) as DiaryEntry[]
        },
        enabled: pid !== null && from !== "" && to !== "",
        retry: false,
    })
    return { entries: data ?? [], loading: isLoading, error: isError }
}

export function useSaveDiaryEntry() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({
            pid,
            date,
            photo,
            caption,
        }: {
            pid: number
            date: string
            photo: File | null
            caption: string
        }) => {
            const res = await saveDiaryEntryAPI(pid, date, photo, caption)
            return res.data.entry as DiaryEntry
        },
        // The saved day may fall in any cached month, so invalidate the whole
        // family rather than trying to patch one range by hand.
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["diaryEntries"] }),
    })
}

export function useDeleteDiaryEntry() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ pid, date }: { pid: number; date: string }) => {
            await deleteDiaryEntryAPI(pid, date)
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["diaryEntries"] }),
    })
}
