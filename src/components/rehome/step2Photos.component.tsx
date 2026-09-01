import PhotoPicker from "./photoPicker.component";

export default function Step2Photos({
    photos,
    onChange,
}: {
    photos: File[];
    onChange: (photos: File[]) => void;
}) {
    return (
        <PhotoPicker
            showAiHint
            photos={photos}
            onChange={(next) => onChange(next.filter((p): p is File => typeof p !== "string"))}
        />
    );
}
