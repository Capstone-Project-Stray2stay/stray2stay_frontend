import PhotoPicker from "./photoPicker.component";

/**
 * Step 2 of the wizard. The dropzone itself lives in PhotoPicker, shared with
 * the Edit Pet's Profile page; this step only pins it to `File`s, since these
 * photos are on their way to the classifier and to POST /pets, neither of which
 * can take a URL.
 */
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
            // Everything reaching this step is picked from disk, so the union
            // PhotoPicker hands back only ever holds Files here.
            onChange={(next) => onChange(next.filter((p): p is File => typeof p !== "string"))}
        />
    );
}
