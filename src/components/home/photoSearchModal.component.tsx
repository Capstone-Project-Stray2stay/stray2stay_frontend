import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Circle,
    Dialog,
    Flex,
    IconButton,
    Image,
    Portal,
    Text,
    VStack,
} from "@chakra-ui/react";

import { S2SButton } from "../../components/S2S.components";
import AICameraIcon from "../icons/aiCameraIcon.component";
import CloseIcon from "../icons/closeIcon.component";
import ImagesIcon from "../icons/imagesIcon.component";
import { useBreeds, useClassifyPet } from "../../hooks/query/pet.query";
import CameraCaptureModal from "../../components/rehome/cameraCaptureModal.component";
import { MAX_AI_PHOTOS, type PetType } from "../../types/rehome.type";

const SPECIES: { value: PetType; label: string; icon: string }[] = [
    { value: "dog", label: "Dog", icon: "/assets/icons/dog.png" },
    { value: "cat", label: "Cat", icon: "/assets/icons/cat.png" },
];

function SpeciesPill({
    label,
    icon,
    selected,
    onClick,
}: {
    label: string;
    icon: string;
    selected: boolean;
    onClick: () => void;
}) {
    return (
        <Flex
            as="button"
            position="relative"
            align="center"
            justify="center"
            w={{ base: "100%", md: "192px" }}
            h="44px"
            pl="48px"
            pr="20px"
            rounded="full"
            borderWidth="1px"
            borderColor="Blue"
            // Figma "Hover" variant: --blue (#C6E7F7) at 30%. Once picked, the pill keeps that blue
            // (plus the darker icon circle) so the choice stays visible
            bg={selected ? "SkyBlueHover" : "transparent"}
            _hover={{ bg: "SkyBlueHover" }}
            transition="background 0.15s ease"
            onClick={onClick}
            aria-pressed={selected}
        >
            {/* The icon sits on top of the pill's left edge, covering the border */}
            <Circle
                size="44px"
                position="absolute"
                left="-1px"
                top="-1px"
                // Figma yellow button sheet: default #FFEEC1 (Cream), pressed #F7E1A7 (Cream_active) for selected
                bg={selected ? "Cream_active" : "Cream"}
                transition="background 0.15s ease"
            >
                {/* Figma: 32px icon frame centred in the 44px circle */}
                <Image src={icon} alt="" boxSize="32px" objectFit="contain" />
            </Circle>
            <Text fontSize="18" fontWeight="600" color="Grey">
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
                        maxW={{ base: "340px", md: "568px" }}
                        borderRadius="24px"
                        p="0"
                        position="relative"
                        boxShadow="0px 3.37px 16.84px rgba(201,220,225,0.20)"
                    >
                        <VStack
                            px={{ base: "24px", md: "80px" }}
                            py="32px"
                            gap="24px"
                            align="stretch"
                        >
                            <Box position="relative">
                                <Text fontSize="24" fontWeight="600" color="Grey" textAlign="center">
                                    Select
                                </Text>
                                {/* Vertically centred on the title; 32px from the dialog's right edge on desktop */}
                                <IconButton
                                    aria-label="Close"
                                    onClick={onClose}
                                    position="absolute"
                                    top="50%"
                                    transform="translateY(-50%)"
                                    right={{ base: "0", md: "-48px" }}
                                    boxSize="28px"
                                    minW="unset"
                                    p="0"
                                    rounded="full"
                                    bg="#EBEBEB"
                                    _hover={{ bg: "#e0e0e0" }}
                                    color="GreyText"
                                    // Chakra's IconButton forces svg to its own size; Figma's ✕ is 12px
                                    css={{ "& svg": { width: "12px", height: "12px" } }}
                                >
                                    {/* Figma "Frame 551": 28px #EBEBEB circle, 12px #7E7E7E ✕ */}
                                    <CloseIcon />
                                </IconButton>
                            </Box>

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
                                position="relative"
                                borderRadius="24px"
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
                                {/* Figma stroke: 2px, centre-aligned, dash 10 / gap 10, round caps.
                                    CSS dashed borders can't set dash length, so it's drawn as an SVG rect;
                                    overflow visible lets the centred stroke sit 1px outside like Figma. */}
                                <Box
                                    as="svg"
                                    position="absolute"
                                    inset="0"
                                    w="100%"
                                    h="100%"
                                    overflow="visible"
                                    pointerEvents="none"
                                    aria-hidden="true"
                                >
                                    <rect
                                        width="100%"
                                        height="100%"
                                        rx="24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeDasharray="10 10"
                                        strokeLinecap="round"
                                    />
                                </Box>
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

                                <VStack gap="16px" py="32px" px="16px">
                                    {/* Figma 82px icon frame, --blue (#C6E7F7) */}
                                    <Box color="SkyBlue" display="flex">
                                        <ImagesIcon />
                                    </Box>

                                    <VStack gap="16px" w="100%">
                                        <Text fontSize={{ base: "18", md: "20" }} fontWeight="600" color="Blue" textAlign="center">
                                            Drag and Drop Photos here
                                        </Text>

                                        {/* Stops the click reaching the zone's own
                                            handler, which would open the file dialog
                                            a second time. */}
                                        {/* Figma "Small" line buttons: 16/8 padding, 120 min width,
                                            18/500 text, 20px icon, 8px icon gap; 12px between buttons */}
                                        <Flex
                                            direction={{ base: "column", md: "row" }}
                                            align="center"
                                            gap="12px"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <S2SButton
                                                text="Upload Photo"
                                                variant="outline"
                                                size="sm"
                                                disabled={isFull}
                                                onClick={() => inputRef.current?.click()}
                                            />
                                            <S2SButton
                                                icon={<AICameraIcon />}
                                                text="Take Photo"
                                                variant="outline"
                                                size="sm"
                                                gap="8px"
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
                                            {/* Same as the Rehome photo remove button: 20px circle, 80% white, 10px ✕ */}
                                            <Flex
                                                as="button"
                                                aria-label={`Remove photo ${i + 1}`}
                                                position="absolute"
                                                top="4px"
                                                right="4px"
                                                boxSize="20px"
                                                align="center"
                                                justify="center"
                                                bg="rgba(255,255,255,0.80)"
                                                borderRadius="full"
                                                color="GreyText"
                                                onClick={() => {
                                                    setError("");
                                                    setPhotos((current) => current.filter((_, index) => index !== i));
                                                }}
                                            >
                                                <CloseIcon size={10} />
                                            </Flex>
                                        </Box>
                                    ))}
                                </Flex>
                            )}

                            {error && (
                                <Text fontSize="14" color="red.500" textAlign="center">
                                    {error}
                                </Text>
                            )}

                            <Flex justify="center">
                                {/* Figma "Large": 24/12 padding, 160 min width, 20/600 */}
                                <S2SButton
                                    text="Finish"
                                    size="lg"
                                    loading={classify.isPending}
                                    onClick={finish}
                                />
                            </Flex>
                        </VStack>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>

            <CameraCaptureModal
                ai
                isOpen={isCameraOpen}
                onClose={() => setIsCameraOpen(false)}
                onCapture={(photo) => addFiles([photo])}
            />
        </Dialog.Root>
    );
}
