import axiosInstance from "../axios/axiosInstance";

/**
 * Pets whose diary the signed-in user can open — the ones they adopted
 * (writable) and the ones they rehomed to someone else (read-only). Each entry
 * already carries the pet details and the other party's contact card, so the
 * diary page needs no per-pet follow-up request.
 */
export async function myDiaryPetsAPI() {
    const res = await axiosInstance.get("/pets/mine/diaries");
    if (res.status === 200) {
        return res;
    }
    throw new Error("Failed to fetch your diaries");
}

/** One pet's entries between two YYYY-MM-DD days, inclusive. */
export async function diaryEntriesAPI(pid: number, from: string, to: string) {
    const res = await axiosInstance.get(`/pets/${pid}/diary`, { params: { from, to } });
    if (res.status === 200) {
        return res;
    }
    throw new Error("Failed to fetch diary entries");
}

/**
 * Create or replace one day's entry. `photo` is optional: leaving it out keeps
 * the photo already stored for that day, which is what a caption-only edit
 * does. Sending it on a day with no entry yet is rejected by the server.
 */
export async function saveDiaryEntryAPI(pid: number, date: string, photo: File | null, caption: string) {
    const formData = new FormData();
    formData.append("caption", caption);
    if (photo) formData.append("image", photo);

    const res = await axiosInstance.put(`/pets/${pid}/diary/${date}`, formData, {
        // A photo upload is well past axiosInstance's 5s default.
        // Content-Type is deliberately left unset so the browser adds the
        // multipart boundary — setting it by hand produces an unparseable body.
        timeout: 60000,
    });

    if (res.status === 200) {
        return res;
    }
    throw new Error("Failed to save diary entry");
}

export async function deleteDiaryEntryAPI(pid: number, date: string) {
    const res = await axiosInstance.delete(`/pets/${pid}/diary/${date}`);
    if (res.status === 200) {
        return res;
    }
    throw new Error("Failed to delete diary entry");
}
