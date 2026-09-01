import { useEffect, useRef, useState } from "react";
import { Box, Flex, Icon, IconButton, Image, Text, VStack } from "@chakra-ui/react";
import { IoBulbOutline, IoClose } from "react-icons/io5";
import { RiImageAiLine } from "react-icons/ri";
import heic2any from "heic2any";

import { S2SButton } from "../S2S.components";
import { MAX_PHOTOS, type PetPhoto } from "../../types/rehome.type";

// Most OSes report an empty `type` for .heic/.heif files picked from a photo
// library (only Safari/iOS fills it in), so the extension is the only
// reliable signal — and even when the type IS set, no browser but Safari can
// render HEIC/HEIF via <img>/object URLs, so these need converting either way.
const isHeic = (file: File) =>
    /^image\/hei[cf]$/i.test(file.type) || /\.hei[cf]$/i.test(file.name);

async function toJpegIfHeic(file: File): Promise<File> {
    if (!isHeic(file)) return file;

    const converted = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.8 });
    const blob = Array.isArray(converted) ? converted[0] : converted;
    return new File([blob], file.name.replace(/\.hei[cf]$/i, ".jpg"), { type: "image/jpeg" });
}

/**
 * The dashed dropzone plus its thumbnail strip, shared by the wizard's Upload
 * Photos step and the Edit Pet's Profile page.
 *
 * `showAiHint` covers the only difference between the two designs: the wizard
 * frames this as the AI-camera step, so it gets the speech bubble and the
 * shot-quality tip. The edit page has neither — by then the breed is already
 * decided and nothing is sent to the classifier.
 */
export default function PhotoPicker({
    photos,
    onChange,
    showAiHint = false,
}: {
    photos: PetPhoto[];
    onChange: (photos: PetPhoto[]) => void;
    showAiHint?: boolean;
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState("");

    // Photos already on the server are usable as-is; only the freshly picked
    // Files need an object URL minting for them.
    //
    // Creation and cleanup live in the same effect (not useMemo) so they can
    // never go out of sync: under StrictMode, React deliberately mounts every
    // effect, cleans it up, then mounts it again to surface bugs like this
    // one. If the URLs were minted in useMemo instead, that simulated cleanup
    // would revoke them without anything ever recreating them, permanently
    // breaking the previews on the very first render — exactly what happened
    // going back to this step after leaving it. Recreating them here means
    // that extra mount just mints (and shows) a fresh, valid batch instead.
    const [previews, setPreviews] = useState<{ src: string; isObjectURL: boolean; alt: string }[]>([]);

    useEffect(() => {
        const next = photos.map((photo) =>
            typeof photo === "string"
                ? { src: photo, isObjectURL: false, alt: "Pet photo" }
                : { src: URL.createObjectURL(photo), isObjectURL: true, alt: photo.name },
        );
        // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional, see comment above.
        setPreviews(next);

        // Object URLs have to be handed back explicitly, otherwise every
        // re-pick leaks a blob that lives as long as the document does —
        // but only for the ones minted here, since revoking a plain server
        // URL would break the image for good.
        return () =>
            next.forEach((preview) => {
                if (preview.isObjectURL) URL.revokeObjectURL(preview.src);
            });
    }, [photos]);

    const addFiles = async (incoming: FileList | File[]) => {
        const all = Array.from(incoming);
        const images = all.filter((file) => file.type.startsWith("image/") || isHeic(file));
        const room = MAX_PHOTOS - photos.length;
        const toAdd = images.slice(0, Math.max(room, 0));

        if (images.length < all.length) {
            setError("Only image files are supported.");
        } else if (toAdd.length < images.length) {
            setError(`You can upload up to ${MAX_PHOTOS} photos.`);
        } else {
            setError("");
        }

        if (toAdd.length === 0) return;

        // HEIC/HEIF can't be previewed (or reliably processed downstream) as-is,
        // so convert those to JPEG before they ever reach state. A file that
        // fails to convert is dropped rather than added broken.
        const settled = await Promise.allSettled(toAdd.map(toJpegIfHeic));
        const converted = settled
            .filter((result): result is PromiseFulfilledResult<File> => result.status === "fulfilled")
            .map((result) => result.value);

        if (converted.length < toAdd.length) {
            setError("One or more HEIC photos couldn't be converted and were skipped.");
        }

        if (converted.length > 0) onChange([...photos, ...converted]);
    };

    const removeAt = (index: number) => {
        setError("");
        onChange(photos.filter((_, i) => i !== index));
    };

    const isFull = photos.length >= MAX_PHOTOS;

    // The design puts this inside the dashed zone on desktop but below it on
    // mobile, so it is rendered in both places and revealed by breakpoint.
    const tip = (
        <Flex align={{ base: "flex-start", md: "center" }} gap={{ base: "6px", md: "3.51px" }}>
            <Icon
                as={IoBulbOutline}
                boxSize={{ base: "21px", md: "19.32px" }}
                flexShrink={0}
                color="GreyMuted"
            />
            <Text
                fontSize={{ base: "12px", md: "16px" }}
                fontWeight={{ base: "500", md: "600" }}
                color="GreyMuted"
                textAlign={{ base: "left", md: "center" }}
            >
                Tip: Upload clear face and full-body shots for best results.
            </Text>
        </Flex>
    );

    return (
        <Flex direction="column" align="stretch" gap="8px" w="100%">
            {/* Decorative speech bubble — no behaviour attached. The tail points
                down at the dropzone, offset toward the right as in the design. */}
            {showAiHint && (
                <Flex
                    position="relative"
                    w="100%"
                    h={{ base: "35px", md: "66.75px" }}
                    align="center"
                    justify="center"
                    px={{ base: "16px", md: "32px" }}
                    bg="rgba(255,255,255,0.70)"
                    borderRadius={{ base: "35.77px", md: "74.66px" }}
                    _after={{
                        content: '""',
                        position: "absolute",
                        top: "100%",
                        right: { base: "36px", md: "56px" },
                        borderLeft: { base: "9px solid transparent", md: "14px solid transparent" },
                        borderRight: { base: "9px solid transparent", md: "14px solid transparent" },
                        borderTop: {
                            base: "12px solid rgba(255,255,255,0.70)",
                            md: "18px solid rgba(255,255,255,0.70)",
                        },
                    }}
                >
                    <Text
                        fontSize={{ base: "10px", md: "18px" }}
                        fontWeight={{ base: "500", md: "600" }}
                        color="GreyText"
                        textAlign="center"
                    >
                        Let’s use AI Camera to help you identify the breed.
                    </Text>
                </Flex>
            )}

            <Box
                mt={showAiHint ? { base: "16px", md: "24px" } : "0"}
                minH={{ base: "212px", md: "339px" }}
                bg="rgba(255,255,255,0.60)"
                borderRadius={{ base: "16.27px", md: "21.96px" }}
                borderWidth={{ base: "1.30px", md: "1.76px" }}
                borderStyle="dashed"
                borderColor={isDragging ? "BlueText" : "Blue"}
                transition="border-color 0.15s ease"
                cursor={isFull ? "default" : "pointer"}
                onClick={() => !isFull && inputRef.current?.click()}
                onDragOver={(e) => {
                    e.preventDefault();
                    if (!isFull) setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    addFiles(e.dataTransfer.files);
                }}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={(e) => {
                        if (e.target.files) addFiles(e.target.files);
                        // Reset so picking the same file twice still fires onChange.
                        e.target.value = "";
                    }}
                />

                <VStack
                    gap={{ base: "14.97px", md: "20.20px" }}
                    py={{ base: "32px", md: "60px" }}
                    px={{ base: "16px", md: "24px" }}
                >
                    <VStack gap={{ base: "7px", md: "23.72px" }}>
                        <Icon
                            as={RiImageAiLine}
                            w={{ base: "61.19px", md: "82.57px" }}
                            h={{ base: "55.98px", md: "75.54px" }}
                            color="SkyBlue"
                        />

                        <VStack gap={{ base: "13.02px", md: "17.57px" }}>
                            <Box textAlign="center">
                                <Text
                                    fontSize={{ base: "14px", md: "20px" }}
                                    fontWeight={{ base: "500", md: "600" }}
                                    color="Blue"
                                >
                                    Drag and Drop Photos here
                                </Text>
                                <Text
                                    fontSize={{ base: "12px", md: "16px" }}
                                    fontWeight="500"
                                    color="Blue"
                                >
                                    ( Max {MAX_PHOTOS} Photos )
                                </Text>
                            </Box>

                            {/* Stops the click reaching the zone's own handler,
                                which would open the file dialog a second time. */}
                            <Box onClick={(e) => e.stopPropagation()}>
                                <S2SButton
                                    text="Upload Photo"
                                    variant="outline"
                                    width={{ base: "160.78px", md: "216.95px" }}
                                    height={{ base: "27.99px", md: "37.77px" }}
                                    fontSize={{ base: "14px", md: "18px" }}
                                    disabled={isFull}
                                    onClick={() => inputRef.current?.click()}
                                />
                            </Box>
                        </VStack>
                    </VStack>

                    {showAiHint && <Box display={{ base: "none", md: "block" }}>{tip}</Box>}
                </VStack>
            </Box>

            {showAiHint && (
                <Box display={{ base: "block", md: "none" }} mt="12px">
                    {tip}
                </Box>
            )}

            {photos.length > 0 && (
                <Flex gap={{ base: "15.47px", md: "18px" }} wrap="wrap" mt={{ base: "16px", md: "24px" }}>
                    {previews.map((preview, i) => (
                        <Box key={preview.src} position="relative">
                            <Image
                                src={preview.src}
                                alt={preview.alt}
                                boxSize={{ base: "73.90px", md: "86.01px" }}
                                objectFit="cover"
                                bg="#E9E9E9"
                                borderRadius={{ base: "12.45px", md: "14.49px" }}
                            />
                            <IconButton
                                aria-label={`Remove photo ${i + 1}`}
                                position="absolute"
                                top="4px"
                                right="4px"
                                boxSize={{ base: "12.89px", md: "15px" }}
                                minW="unset"
                                p="0"
                                bg="rgba(255,255,255,0.85)"
                                _hover={{ bg: "rgba(255,255,255,0.85)" }}
                                borderRadius="full"
                                onClick={() => removeAt(i)}
                            >
                                <Icon as={IoClose} boxSize={{ base: "8px", md: "9px" }} color="GreyText" />
                            </IconButton>
                        </Box>
                    ))}
                </Flex>
            )}

            {error && (
                <Text mt="8px" fontSize="14px" color="red.500">
                    {error}
                </Text>
            )}
        </Flex>
    );
}
