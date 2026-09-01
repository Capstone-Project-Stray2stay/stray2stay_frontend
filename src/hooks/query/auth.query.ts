import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
    authorizeAPI,
    loginAPI,
    logoutAPI,
    newUserStatusAPI,
    updateNewUserStatusAPI,
} from "../../services/apis/auth.api"

export function useAuth() {
    const { data: user, isLoading } = useQuery({
        queryKey: ["user"],
        queryFn: authorizeAPI,
        retry: false,
    })
    return { user, isLoading }
}

export function useLogin() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ email, password }: { email: string; password: string }) =>
            loginAPI(email, password),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["user"] })
        },
    })
}

export function useLogout() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: logoutAPI,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user"] })
        },
    })
}

export function useNewUserStatus() {
    const { data: userData, isLoading } = useQuery({
        queryKey: ["newUserStatus"],
        queryFn: async () => {
            const res = await newUserStatusAPI()
            return res.data.userData
        },
        retry: false,
    })
    return { userStatus: userData || false, loading: isLoading }
}

export function useUpdateNewUserStatus() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: updateNewUserStatusAPI,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["newUserStatus"] })
        },
    })
}
