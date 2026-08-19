import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Flex, Icon, Image, Text, VStack } from "@chakra-ui/react";
import { IoBulbOutline, IoClose, IoCloudUploadOutline } from "react-icons/io5";

import { S2SButton } from "../../components/S2S.components";
import { MAX_PHOTOS } from "./rehome.type";

export default function Step2Photos({
    photos,
    onChange,
}: {
    photos: File[];
    onChange: (photos: File[]) => void;
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState("");

    const previews = useMemo(() => photos.map((photo) => URL.createObjectURL(photo)), [photos]);

    // Object URLs have to be handed back explicitly, otherwise every re-pick
    // leaks a blob that lives as long as the document does. Revoking in the
    // cleanup releases the previous batch whenever previews change or the step
    // unmounts.
    useEffect(() => {
        return () => previews.forEach((url) => URL.revokeObjectURL(url));
    }, [previews]);

    const addFiles = (incoming: FileList | File[]) => {
        const all = Array.from(incoming);
        const images = all.filter((file) => file.type.startsWith("image/"));
        const room = MAX_PHOTOS - photos.length;
        const toAdd = images.slice(0, Math.max(room, 0));

        if (images.length < all.length) {
            setError("Only image files are supported.");
        } else if (toAdd.length < images.length) {
            setError(`You can upload up to ${MAX_PHOTOS} photos.`);
        } else {
            setError("");
        }

        if (toAdd.length > 0) onChange([...photos, ...toAdd]);
    };

    const removeAt = (index: number) => {
        setError("");
        onChange(photos.filter((_, i) => i !== index));
    };

    const isFull = photos.length >= MAX_PHOTOS;

    return (
        <Flex direction="column" align="stretch" gap="8px" w="100%">
            {/* Decorative speech bubble — no behaviour attached. The tail points
                down at the dropzone, offset toward the right as in the design. */}
            <Flex
                position="relative"
                w="100%"
                h="66.75px"
                align="center"
                justify="center"
                px="32px"
                bg="rgba(255,255,255,0.70)"
                borderRadius="74.66px"
                _after={{
                    content: '""',
                    position: "absolute",
                    top: "100%",
                    right: "56px",
                    borderLeft: "14px solid transparent",
                    borderRight: "14px solid transparent",
                    borderTop: "18px solid rgba(255,255,255,0.70)",
                }}
            >
                <Text fontSize="18px" fontWeight="600" color="GreyText" textAlign="center">
                    Let’s use AI Camera to help you identify the breed.
                </Text>
            </Flex>

            <Box
                mt="24px"
                minH="339px"
                bg="rgba(255,255,255,0.60)"
                borderRadius="21.96px"
                borderWidth="1.76px"
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

                <VStack gap="20.20px" py="60px" px="24px">
                    <VStack gap="23.72px">
                        <Icon as={IoCloudUploadOutline} w="82.57px" h="75.54px" color="SkyBlue" />

                        <VStack gap="17.57px">
                            <Box textAlign="center">
                                <Text fontSize="20px" fontWeight="600" color="Blue">
                                    Drag and Drop Photos here
                                </Text>
                                <Text fontSize="16px" fontWeight="500" color="Blue">
                                    ( Max {MAX_PHOTOS} Photos )
                                </Text>
                            </Box>

                            {/* Stops the click reaching the zone's own handler,
                                which would open the file dialog a second time. */}
                            <Box onClick={(e) => e.stopPropagation()}>
                                <S2SButton
                                    text="Upload Photo"
                                    variant="outline"
                                    width="216.95px"
                                    height="37.77px"
                                    fontSize="18px"
                                    disabled={isFull}
                                    onClick={() => inputRef.current?.click()}
                                />
                            </Box>
                        </VStack>
                    </VStack>

                    <Flex align="center" gap="3.51px">
                        <Icon as={IoBulbOutline} boxSize="19.32px" color="GreyMuted" />
                        <Text fontSize="16px" fontWeight="600" color="GreyMuted" textAlign="center">
                            Tip: Upload clear face and full-body shots for best results.
                        </Text>
                    </Flex>
                </VStack>
            </Box>

            {photos.length > 0 && (
                <Flex gap="18px" wrap="wrap" mt="24px">
                    {previews.map((src, i) => (
                        <Box key={src} position="relative">
                            <Image
                                src={src}
                                alt={photos[i]?.name ?? `Photo ${i + 1}`}
                                boxSize="86.01px"
                                objectFit="cover"
                                bg="#E9E9E9"
                                borderRadius="14.49px"
                            />
                            <Flex
                                as="button"
                                aria-label={`Remove photo ${i + 1}`}
                                position="absolute"
                                top="4px"
                                right="4px"
                                boxSize="15px"
                                align="center"
                                justify="center"
                                bg="rgba(255,255,255,0.85)"
                                borderRadius="full"
                                onClick={() => removeAt(i)}
                            >
                                <Icon as={IoClose} boxSize="7px" color="GreyMuted" />
                            </Flex>
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
