import { useEffect, useMemo, useState } from "react";
import { Box, Circle, Dialog, Flex, HStack, Image, Portal, SimpleGrid, Text, VStack } from "@chakra-ui/react";

import { S2SButton, S2SDialogCloseButton } from "../S2S.components";
import { MAX_AI_PHOTOS } from "../../types/rehome.type";

const TAG_LABELS = ["Clear Face", "Full body"];

export default function SelectAiPhotosModal({
    isOpen,
    photos,
    isSubmitting,
    onClose,
    onConfirm,
}: {
    isOpen: boolean;
    photos: File[];
    isSubmitting: boolean;
    onClose: () => void;
    onConfirm: (selected: File[]) => void;
}) {
    const [selected, setSelected] = useState<File[]>([]);

    const [wasOpen, setWasOpen] = useState(isOpen);
    if (isOpen !== wasOpen) {
        setWasOpen(isOpen);
        if (isOpen) setSelected([]);
    }

    const previews = useMemo(() => photos.map((photo) => URL.createObjectURL(photo)), [photos]);
    useEffect(() => {
        return () => previews.forEach((url) => URL.revokeObjectURL(url));
    }, [previews]);

    const toggle = (file: File) => {
        setSelected((current) => {
            if (current.includes(file)) return current.filter((f) => f !== file);
            if (current.length >= MAX_AI_PHOTOS) return current;
            return [...current, file];
        });
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()} placement="center">
            <Portal>
                <Dialog.Backdrop bg="blackAlpha.400" />
                <Dialog.Positioner>
                    <Dialog.Content
                        maxW={{ base: "335px", md: "661px" }}
                        borderRadius={{ base: "25.34px", md: "50px" }}
                        p="0"
                        position="relative"
                        boxShadow="0px 3.37px 16.84px rgba(201,220,225,0.20)"
                    >
                        <S2SDialogCloseButton
                            onClick={onClose}
                            top={{ base: "23px", md: "24px" }}
                            right={{ base: "20px", md: "24px" }}
                            boxSize="23.58px"
                            iconBoxSize="12px"
                        />

                        <VStack
                            pt={{ base: "53px", md: "64px" }}
                            pb={{ base: "35px", md: "40px" }}
                            px={{ base: "52px", md: "48px" }}
                            gap={{ base: "20px", md: "28px" }}
                        >
                            <SimpleGrid
                                columns={{ base: 2, md: 4 }}
                                gap={{ base: "21.44px", md: "24.14px" }}
                                justifyItems="center"
                            >
                                {photos.map((file, i) => {
                                    const isSelected = selected.includes(file);
                                    return (
                                        <Image
                                            key={previews[i]}
                                            src={previews[i]}
                                            alt={`Photo ${i + 1}`}
                                            boxSize={{ base: "102.43px", md: "115.36px" }}
                                            objectFit="cover"
                                            bg="#E9E9E9"
                                            borderRadius={{ base: "17.26px", md: "19.44px" }}
                                            cursor="pointer"
                                            outlineWidth={{ base: "4.44px", md: "3px" }}
                                            outlineStyle="solid"
                                            outlineOffset={{ base: "-4.44px", md: "3px" }}
                                            outlineColor={isSelected ? "Blue" : "transparent"}
                                            transition="outline-color 0.15s ease, transform 0.15s ease"
                                            _hover={{ transform: "scale(1.05)" }}
                                            onClick={() => toggle(file)}
                                        />
                                    );
                                })}
                            </SimpleGrid>

                            <VStack w="100%" gap="16px">
                                <Text
                                    fontSize={{ base: "16px", md: "20px" }}
                                    fontWeight="500"
                                    color="Grey"
                                    textAlign="center"
                                >
                                    Select {MAX_AI_PHOTOS} best photos for AI
                                </Text>

                                {/* Fixed legend naming each pick — stays up the whole
                                    time the modal is open, independent of how many
                                    photos are selected right now. Mobile uses a
                                    numbered dot; desktop uses overlapping pills. */}
                                <Flex
                                    display={{ base: "flex", md: "none" }}
                                    w="100%"
                                    justify="space-between"
                                    align="center"
                                >
                                    {TAG_LABELS.map((label, i) => (
                                        <Flex key={label} align="center" gap="5px">
                                            <Circle size="25px" bg="Cream">
                                                <Text fontSize="12px" fontWeight="500" color="Grey">
                                                    {i + 1}
                                                </Text>
                                            </Circle>
                                            <Text fontSize="14px" fontWeight="500" color="BlueText">
                                                {label}
                                            </Text>
                                        </Flex>
                                    ))}
                                </Flex>

                                <HStack
                                    display={{ base: "none", md: "flex" }}
                                    gap="30.31px"
                                    wrap="wrap"
                                    justify="center"
                                >
                                    {TAG_LABELS.map((label, i) => (
                                        // Two separate rounded pills, not one joined shape —
                                        // the cream "Photo N" badge sits in front of and
                                        // overlaps the blue hint pill behind it.
                                        <Flex key={label} align="center">
                                            <Box
                                                px="16px"
                                                py="8.42px"
                                                bg="Cream"
                                                borderRadius="30.31px"
                                                position="relative"
                                                zIndex={1}
                                            >
                                                <Text fontSize="18px" fontWeight="500" color="GreyText" whiteSpace="nowrap">
                                                    Photo {i + 1}
                                                </Text>
                                            </Box>
                                            <Box
                                                px="20px"
                                                py="8.42px"
                                                pl="36px"
                                                ml="-24px"
                                                bg="#E3F4FF"
                                                borderRadius="37.05px"
                                            >
                                                <Text fontSize="18px" fontWeight="500" color="BlueText" whiteSpace="nowrap">
                                                    {label}
                                                </Text>
                                            </Box>
                                        </Flex>
                                    ))}
                                </HStack>
                            </VStack>

                            {/* Full width on mobile, right-aligned on desktop. */}
                            <Flex w="100%" justify={{ base: "center", md: "flex-end" }}>
                                <S2SButton
                                    text="Next"
                                    width={{ base: "230px", md: "134.39px" }}
                                    height={{ base: "40px", md: "44.80px" }}
                                    fontSize={{ base: "14px", md: "20px" }}
                                    disabled={selected.length !== MAX_AI_PHOTOS}
                                    loading={isSubmitting}
                                    onClick={() => onConfirm(selected)}
                                />
                            </Flex>
                        </VStack>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}
