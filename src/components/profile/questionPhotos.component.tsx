import { Grid, Image } from "@chakra-ui/react";

/**
 * The owner's photos on a question — an Image question's own photos, or the illustration photos any
 * question can carry. Figma "use grid layout": one photo fills the row, two split 1:2, more go three across.
 */
export default function QuestionPhotos({ urls, label }: { urls: string[]; label: string }) {
    if (urls.length === 0) return null;
    return (
        <Grid
            w="100%"
            gap="10px"
            templateColumns={{
                base: "1fr",
                md: urls.length === 1 ? "1fr" : urls.length === 2 ? "1fr 2fr" : "repeat(3, 1fr)",
            }}
        >
            {urls.map((url, i) => (
                <Image
                    key={url}
                    src={url}
                    alt={`${label} ${i + 1}`}
                    w="100%"
                    h={{ base: "220px", md: urls.length > 2 ? "220px" : "320px" }}
                    objectFit="cover"
                    bg="#E9E9E9"
                />
            ))}
        </Grid>
    );
}
