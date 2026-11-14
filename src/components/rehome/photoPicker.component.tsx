import { useEffect, useRef, useState } from "react";
import { Box, Flex, IconButton, Image, Text, VStack, useBreakpointValue } from "@chakra-ui/react";
import heic2any from "heic2any";

import { S2SButton } from "../S2S.components";
import AICameraIcon from "../icons/aiCameraIcon.component";
import AIImagesIcon from "../icons/aiImagesIcon.component";
import LightbulbIcon from "../icons/lightbulbIcon.component";
import CloseIcon from "../icons/closeIcon.component";
import DashedOutline from "../dashedOutline.component";
import CameraCaptureModal from "./cameraCaptureModal.component";
import { MAX_PHOTOS, type PetPhoto } from "../../types/rehome.type";

const isHeic = (file: File) =>
    /^image\/hei[cf]$/i.test(file.type) || /\.hei[cf]$/i.test(file.name);

async function toJpegIfHeic(file: File): Promise<File> {
    if (!isHeic(file)) return file;

    const converted = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.8 });
    const blob = Array.isArray(converted) ? converted[0] : converted;
    return new File([blob], file.name.replace(/\.hei[cf]$/i, ".jpg"), { type: "image/jpeg" });
}

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
    // SVG rx can't take responsive values, so pick the zone's corner radius per breakpoint
    const outlineRadius = useBreakpointValue({ base: 16.27, md: 24 }) ?? 24;
    const [error, setError] = useState("");
    const [isCameraOpen, setIsCameraOpen] = useState(false);

    const [previews, setPreviews] = useState<{ src: string; isObjectURL: boolean; alt: string }[]>([]);

    useEffect(() => {
        const next = photos.map((photo) =>
            typeof photo === "string"
                ? { src: photo, isObjectURL: false, alt: "Pet photo" }
                : { src: URL.createObjectURL(photo), isObjectURL: true, alt: photo.name },
        );
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPreviews(next);

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
        // Figma: 24px bulb, 4px gap, bottom-aligned with the 18/500 --info text
        <Flex align={{ base: "flex-start", md: "flex-end" }} gap={{ base: "6px", md: "4px" }}>
            {/* Figma "Icon_lightbulb", 24px, --info */}
            <Box color="GreyInfo" flexShrink={0} boxSize={{ base: "21px", md: "24px" }} css={{ "& svg": { width: "100%", height: "100%" } }}>
                <LightbulbIcon />
            </Box>
            <Text
                fontSize={{ base: "12", md: "18" }}
                fontWeight="500"
                color="GreyInfo"
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
                    bg="white"
                    borderRadius={{ base: "35.77px", md: "74.66px" }}
                    _after={{
                        content: '""',
                        position: "absolute",
                        top: "100%",
                        right: { base: "36px", md: "56px" },
                        borderLeft: { base: "9px solid transparent", md: "14px solid transparent" },
                        borderRight: { base: "9px solid transparent", md: "14px solid transparent" },
                        borderTop: {
                            base: "12px solid white",
                            md: "18px solid white",
                        },
                    }}
                >
                    <Text
                        fontSize={{ base: "10", md: "20" }}
                        fontWeight={{ base: "500", md: "600" }}
                        color="GreyText"
                        textAlign="center"
                    >
                        Let’s use AI Camera to help you identify the breed.
                    </Text>
                </Flex>
            )}

            <Box
                mt={showAiHint ? { base: "16px", md: "30px" } : "0"}
                bg="rgba(255,255,255,0.70)"
                position="relative"
                borderRadius={{ base: "16.27px", md: "24px" }}
                // Same Figma dash as the Home photo-search drop zone (2px, 10/10, round caps)
                color={isDragging ? "BlueText" : "Blue"}
                transition="color 0.15s ease"
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
                <DashedOutline radius={outlineRadius} />
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

                {/* Figma: 32px top/bottom, 16px between icon, text, buttons and tip; text lines 8px apart;
                    Auto line height. Mobile values unchanged until the mobile pass. */}
                <VStack
                    gap={{ base: "14.97px", md: "16px" }}
                    py="32px"
                    px={{ base: "16px", md: "24px" }}
                    lineHeight={{ md: "normal" }}
                >
                    <VStack gap={{ base: "7px", md: "16px" }}>
                        {/* Figma "Vector (5)" in its 82px frame, --blue; mobile keeps its old size for now */}
                        <Box color="SkyBlue" boxSize={{ base: "61.19px", md: "82px" }} css={{ "& svg": { width: "100%", height: "100%" } }}>
                            <AIImagesIcon />
                        </Box>

                        <VStack gap={{ base: "13.02px", md: "16px" }}>
                            <VStack gap={{ base: 0, md: "8px" }} textAlign="center">
                                <Text
                                    fontSize={{ base: "14", md: "20" }}
                                    fontWeight={{ base: "500", md: "600" }}
                                    color="Blue"
                                >
                                    Drag and Drop Photos here
                                </Text>
                                <Text
                                    fontSize={{ base: "12", md: "18" }}
                                    fontWeight="500"
                                    color="Blue"
                                >
                                    ( Max {MAX_PHOTOS} Photos )
                                </Text>
                            </VStack>

                            {/* Stops the click reaching the zone's own handler,
                                which would open the file dialog a second time. */}
                            {/* Original button sizes (170x38, 18px text; smaller on mobile), 12px apart */}
                            <Flex
                                direction={{ base: "column", md: "row" }}
                                align="center"
                                gap={{ base: "10px", md: "12px" }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <S2SButton
                                    text="Upload Photo"
                                    variant="outline"
                                    width={{ base: "160.78px", md: "170px" }}
                                    height={{ base: "27.99px", md: "38px" }}
                                    fontSize={{ base: "14", md: "18" }}
                                    disabled={isFull}
                                    onClick={() => inputRef.current?.click()}
                                />
                                <S2SButton
                                    // Figma AI camera at the original 16 / 20px
                                    icon={
                                        <Box as="span" display="flex" boxSize={{ base: "16px", md: "20px" }} css={{ "& svg": { width: "100%", height: "100%" } }}>
                                            <AICameraIcon />
                                        </Box>
                                    }
                                    text="Take Photo"
                                    variant="outline"
                                    width={{ base: "160.78px", md: "170px" }}
                                    height={{ base: "27.99px", md: "38px" }}
                                    fontSize={{ base: "14", md: "18" }}
                                    disabled={isFull}
                                    onClick={() => setIsCameraOpen(true)}
                                />
                            </Flex>
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
                <Flex gap={{ base: "15.47px", md: "18px" }} wrap="wrap" mt={{ base: "16px", md: "32px" }}>
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
                            {/* 80% white circle at the original 12.89 / 15px; Figma ✕ at the old IoClose 8 / 9px glyph size (~4.2 / 4.8px) */}
                            <IconButton
                                aria-label={`Remove photo ${i + 1}`}
                                position="absolute"
                                top="4px"
                                right="4px"
                                boxSize={{ base: "12.89px", md: "15px" }}
                                minW="unset"
                                p="0"
                                bg="rgba(255,255,255,0.80)"
                                _hover={{ bg: "rgba(255,255,255,0.80)" }}
                                borderRadius="full"
                                color="GreyMuted"
                                css={{ "& svg": { width: "4.8px", height: "4.8px" }, "@media (max-width: 47.99rem)": { "& svg": { width: "4.2px", height: "4.2px" } } }}
                                onClick={() => removeAt(i)}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    ))}
                </Flex>
            )}

            {error && (
                <Text mt="8px" fontSize="14" color="red.500">
                    {error}
                </Text>
            )}

            <CameraCaptureModal
                ai
                isOpen={isCameraOpen}
                onClose={() => setIsCameraOpen(false)}
                // Goes through addFiles like a picked file does, so the
                // MAX_PHOTOS cap and its message apply to shots too.
                onCapture={(photo) => addFiles([photo])}
            />
        </Flex>
    );
}
