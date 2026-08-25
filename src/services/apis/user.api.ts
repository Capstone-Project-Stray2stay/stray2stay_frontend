
export interface UpdateUserPayload {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: string;
    addressLat: number;
    addressLong: number;
    dogBreed: string;
    dogColor: string;
    dogAgeGroup: string;
    dogGender: string;
    catBreed: string;
    catColor: string;
    catAgeGroup: string;
    catGender: string;
}

export async function updateUserAPI(payload: UpdateUserPayload) {
    const res = await axiosInstance.put("/user/update", payload);
    if (res.status === 200) {
        return res;
    }
    throw new Error("Failed to update user");
}

/**
 * domain.UserInfo has no json tags, so Fiber marshals the Go field names as-is
 * (capitalised) rather than the camelCase the rest of the API uses.
 */
export interface UserInfoData {
    Firstname: string;
    Lastname: string;
    Phone: string;
    Address: string;
    CoverImage: string | null;
    DogBreed: string;
    DogColor: string;
    DogAgeGroup: string;
    DogGender: string;
    CatBreed: string;
    CatColor: string;
    CatAgeGroup: string;
    CatGender: string;
}

export async function getUserInfoAPI() {
    const res = await axiosInstance.get("/user/info");
    if (res.status === 200) {
        return res;
    }
    throw new Error("Failed to fetch user info");
}

export async function updateUserImageAPI(image: File) {
    const formData = new FormData();
    formData.append("image", image);

    const res = await axiosInstance.put("/user/image", formData, {
        // Content-Type is deliberately left unset so the browser adds the
        // multipart boundary — setting it by hand produces an unparseable body.
        timeout: 30000,
    });

    if (res.status === 200) {
        return res;
    }
    throw new Error("Failed to update user image");
}
