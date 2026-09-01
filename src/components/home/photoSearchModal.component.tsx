import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Circle,
    Dialog,
    Flex,
    Icon,
    IconButton,
    Image,
    Portal,
    Text,
    VStack,
} from "@chakra-ui/react";
import { IoCameraOutline, IoClose } from "react-icons/io5";
import { RiImageAiLine } from "react-icons/ri";

import { S2SButton } from "../../components/S2S.components";
import { useBreeds, useClassifyPet } from "../../hooks/query/pet.query";
import CameraCaptureModal from "../../components/rehome/cameraCaptureModal.component";
import { MAX_AI_PHOTOS, type PetType } from "../../types/rehome.type";

const SPECIES: { value: PetType; label: string; icon: string; iconSize: { w: string; h: string } }[] = [
    { value: "dog", label: "Dog", icon: "/assets/icons/dog.png", iconSize: { w: "26px", h: "22px" } },
    { value: "cat", label: "Cat", icon: "/assets/icons/cat.png", iconSize: { w: "28px", h: "28px" } },
];

function SpeciesPill({
    label,
    icon,
    iconSize,
    selected,
    onClick,
}: {
    label: string;
    icon: string;
    iconSize: { w: string; h: string };
    selected: boolean;
    onClick: () => void;
}) {
    return (
        <Flex
            as="button"
            align="center"
            gap="12px"
            w={{ base: "100%", md: "192px" }}
            h="40px"
            pl="0"
            pr="16px"
            rounded="full"
            borderWidth="1px"
            borderColor="Blue"
            bg={selected ? "LightBlue" : "transparent"}
            transition="background 0.15s ease"
            onClick={onClick}
            aria-pressed={selected}
        >
            <Circle size="38px" bg={selected ? "Yellow" : "Cream"} flexShrink={0} transition="background 0.15s ease">
                <Image src={icon} alt={label} w={iconSize.w} h={iconSize.h} />
            </Circle>
            <Text fontSize="16px" fontWeight="600" color="Grey">
                {label}
            </Text>
        </Flex>
    );
}

export interface PhotoSearchResult {
    species: PetType;
    breed: string;
}

export default function PhotoSearchModal({
    isOpen,
    onClose,
    onResult,
}: {
    isOpen: boolean;
    onClose: () => void;
    onResult?: (result: PhotoSearchResult) => void;
}) {
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null);

    const [species, setSpecies] = useState<PetType | null>(null);
    const [photos, setPhotos] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [error, setError] = useState("");

    const classify = useClassifyPet();
    const { breeds } = useBreeds(species);

    const [wasOpen, setWasOpen] = useState(isOpen);
    if (isOpen !== wasOpen) {
        setWasOpen(isOpen);
        if (isOpen) {
            setSpecies(null);
            setPhotos([]);
            setError("");
        }
    }

    const previews = useMemo(() => photos.map((photo) => URL.createObjectURL(photo)), [photos]);
    useEffect(() => {
        return () => previews.forEach((url) => URL.revokeObjectURL(url));
    }, [previews]);

    const addFiles = (incoming: FileList | File[]) => {
        const all = Array.from(incoming);
        const images = all.filter((file) => file.type.startsWith("image/"));
        const toAdd = images.slice(0, Math.max(MAX_AI_PHOTOS - photos.length, 0));

        if (images.length < all.length) {
            setError("Only image files are supported.");
        } else if (toAdd.length < images.length) {
            setError(`You can search with up to ${MAX_AI_PHOTOS} photos.`);
        } else {
            setError("");
        }

        if (toAdd.length > 0) setPhotos((current) => [...current, ...toAdd]);
    };

    const isFull = photos.length >= MAX_AI_PHOTOS;

    const finish = () => {
        if (species === null) {
            setError("Pick Dog or Cat first.");
            return;
        }
        if (photos.length === 0) {
            setError("Add a photo of the pet you're looking for.");
            return;
        }

        setError("");
        classify.mutate(
            { petType: species, images: photos },
            {
                onSuccess: (detected) => {
                    // The classifier's label is Title Case ("Golden Retriever")
                    // and the filter matches against Mongo's breed list, so an
                    // unrecognised label is dropped rather than sent through as
                    // a filter that can only ever return nothing.
                    const breed = breeds.find((b) => b.toLowerCase() === detected?.toLowerCase()) ?? "";
                    onClose();
                    if (onResult) onResult({ species, breed });
                    else navigate("/adopt", { state: { species, breed } });
                },
                onError: () =>
                    setError("Couldn't identify the breed from that photo. Try a clearer shot."),
            },
        );
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()} placement="center">
            <Portal>
                <Dialog.Backdrop bg="blackAlpha.400" />
                <Dialog.Positioner>
                    <Dialog.Content
                        maxW={{ base: "340px", md: "603px" }}
                        borderRadius="24px"
                        p="0"
                        position="relative"
                        boxShadow="0px 3.37px 16.84px rgba(201,220,225,0.20)"
                    >
                        <IconButton
                            aria-label="Close"
                            onClick={onClose}
                            position="absolute"
                            top="20px"
                            right="20px"
                            boxSize="23.58px"
                            minW="unset"
                            p="0"
                            rounded="full"
                            bg="#EDEDED"
                            _hover={{ bg: "#e0e0e0" }}
                            zIndex={1}
                        >
                            <Icon as={IoClose} boxSize="11px" color="GreyText" />
                        </IconButton>

                        <VStack
                            px={{ base: "24px", md: "80px" }}
                            py="32px"
                            gap="24px"
                            align="stretch"
                        >
                            <Text fontSize="24px" fontWeight="600" color="Grey" textAlign="center">
                                Select
                            </Text>

                            <Flex
                                direction={{ base: "column", md: "row" }}
                                justify="center"
                                gap="24px"
                            >
                                {SPECIES.map((option) => (
                                    <SpeciesPill
                                        key={option.value}
                                        label={option.label}
                                        icon={option.icon}
                                        iconSize={option.iconSize}
                                        selected={species === option.value}
                                        onClick={() => {
                                            setError("");
                                            setSpecies(option.value);
                                        }}
                                    />
                                ))}
                            </Flex>

                            <Box
                                w="100%"
                                minH={{ base: "200px", md: "225px" }}
                                bg="rgba(255,255,255,0.60)"
                                borderRadius="19.65px"
                                borderWidth="1.38px"
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
                                        // Reset so re-picking the same file still fires onChange.
                                        e.target.value = "";
                                    }}
                                />

                                <VStack gap="16.85px" py="32px" px="16px">
                                    <Icon as={RiImageAiLine} w="62.56px" h="57.42px" color="SkyBlue" />

                                    <VStack gap="12.48px" w="100%">
                                        <Text fontSize="18px" fontWeight="600" color="Blue" textAlign="center">
                                            Drag and Drop Photos here
                                        </Text>

                                        {/* Stops the click reaching the zone's own
                                            handler, which would open the file dialog
                                            a second time. */}
                                        <Flex
                                            direction={{ base: "column", md: "row" }}
                                            align="center"
                                            gap="10px"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <S2SButton
                                                text="Upload Photo"
                                                variant="outline"
                                                width="154px"
                                                height="32px"
                                                fontSize="14px"
                                                disabled={isFull}
                                                onClick={() => inputRef.current?.click()}
                                            />
                                            <S2SButton
                                                icon={<Icon as={IoCameraOutline} boxSize="16px" />}
                                                text="Take Photo"
                                                variant="outline"
                                                width="154px"
                                                height="32px"
                                                fontSize="14px"
                                                disabled={isFull}
                                                onClick={() => setIsCameraOpen(true)}
                                            />
                                        </Flex>
                                    </VStack>
                                </VStack>
                            </Box>

                            {photos.length > 0 && (
                                <Flex gap="12px" wrap="wrap" justify="center">
                                    {previews.map((preview, i) => (
                                        <Box key={preview} position="relative">
                                            <Image
                                                src={preview}
                                                alt={`Search photo ${i + 1}`}
                                                boxSize="72px"
                                                objectFit="cover"
                                                bg="#E9E9E9"
                                                borderRadius="12px"
                                            />
                                            <Flex
                                                as="button"
                                                aria-label={`Remove photo ${i + 1}`}
                                                position="absolute"
                                                top="4px"
                                                right="4px"
                                                boxSize="14px"
                                                align="center"
                                                justify="center"
                                                bg="rgba(255,255,255,0.85)"
                                                borderRadius="full"
                                                onClick={() => {
                                                    setError("");
                                                    setPhotos((current) => current.filter((_, index) => index !== i));
                                                }}
                                            >
                                                <Icon as={IoClose} boxSize="9px" color="GreyText" />
                                            </Flex>
                                        </Box>
                                    ))}
                                </Flex>
                            )}

                            {error && (
                                <Text fontSize="14px" color="red.500" textAlign="center">
                                    {error}
                                </Text>
                            )}

                            <Flex justify="center">
                                <S2SButton
                                    text="Finish"
                                    width="158px"
                                    height="45px"
                                    fontSize="20px"
                                    loading={classify.isPending}
                                    onClick={finish}
                                />
                            </Flex>
                        </VStack>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>

            <CameraCaptureModal
                isOpen={isCameraOpen}
                onClose={() => setIsCameraOpen(false)}
                onCapture={(photo) => addFiles([photo])}
            />
        </Dialog.Root>
    );
}
