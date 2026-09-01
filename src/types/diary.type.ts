export interface DiaryEntry {
    id: string;
    petId: string;
    dateKey: string;
    photo: File | null;
    imageURL: string;
    caption: string;
}

export interface DiaryPet {
    id: string;
    name: string;
    imageURL: string;
    ageGroup: string;
    color: string;
    gender: "Male" | "Female";
    breed: string;
}

export interface DiaryFinder {
    name: string;
    role: string;
    phone: string;
    imageURL: string;
}
