import { isAxiosError } from "axios";

/** The backend's own error text when there is one (handlers reply with { error } or { message }). */
export function serverMessage(error: unknown): string {
    if (isAxiosError(error)) {
        const data = error.response?.data as { error?: string; message?: string } | undefined;
        return data?.error ?? data?.message ?? error.message;
    }
    return error instanceof Error ? error.message : "Unknown error";
}
