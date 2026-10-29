import { useEffect, useMemo, useState } from "react";
import { Box, Dialog, Flex, Image, Portal, SimpleGrid, Text, VStack } from "@chakra-ui/react";

import { S2SButton, S2SDialogCloseButton } from "../S2S.components";

// One pick per step, in the order the classifier expects them
const PICK_STEPS = [
    { label: "Photo 1", hint: "clear face" },
    { label: "Photo 2", hint: "full body" },
];

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
    const [stepIndex, setStepIndex] = useState(0);
    const [picks, setPicks] = useState<(File | null)[]>(PICK_STEPS.map(() => null));

    const [wasOpen, setWasOpen] = useState(isOpen);
    if (isOpen !== wasOpen) {
        setWasOpen(isOpen);
        if (isOpen) {
            setStepIndex(0);
            setPicks(PICK_STEPS.map(() => null));
        }
    }

    const previews = useMemo(() => photos.map((photo) => URL.createObjectURL(photo)), [photos]);
    useEffect(() => {
        return () => previews.forEach((url) => URL.revokeObjectURL(url));
    }, [previews]);

    const step = PICK_STEPS[stepIndex];
    const isLastStep = stepIndex === PICK_STEPS.length - 1;
    const current = picks[stepIndex];

    const pick = (file: File) =>
        setPicks((prev) => prev.map((p, i) => (i === stepIndex ? file : p)));

    const advance = () => {
        if (isLastStep) onConfirm(picks.filter((p): p is File => p !== null));
        else setStepIndex((i) => i + 1);
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()} placement="center">
            <Portal>
                <Dialog.Backdrop bg="blackAlpha.400" />
                <Dialog.Positioner>
                    <Dialog.Content
                        maxW={{ base: "335px", md: "573px" }}
                        borderRadius="24px"
                        p="0"
                        position="relative"
                        boxShadow="0px 3.37px 16.84px rgba(201,220,225,0.20)"
                    >
                        <S2SDialogCloseButton onClick={onClose} top="33px" right="32px" boxSize="28px" iconBoxSize="14px" />

                        <VStack p={{ base: "24px", md: "32px" }} gap="32px" align="stretch">
                            <Text fontSize={{ base: "20", md: "24" }} fontWeight="600" color="Grey" textAlign="center">
                                Select photo for AI
                            </Text>

                            <VStack gap="37px" align="stretch">
                                <SimpleGrid
                                    columns={{ base: 2, md: 4 }}
                                    gap="16px"
                                    justifyItems="center"
                                >
                                    {photos.map((file, i) => {
                                        const isSelected = current === file;
                                        // A photo already used for an earlier pick can't be reused
                                        const takenEarlier = picks.some((p, pi) => pi < stepIndex && p === file);
                                        return (
                                            <Image
                                                key={previews[i]}
                                                src={previews[i]}
                                                alt={`Photo ${i + 1}`}
                                                boxSize={{ base: "102.43px", md: "115.36px" }}
                                                objectFit="cover"
                                                bg="#E9E9E9"
                                                borderRadius="19.44px"
                                                borderWidth="5px"
                                                borderStyle="solid"
                                                borderColor={isSelected ? "Blue" : "transparent"}
                                                opacity={takenEarlier ? 0.4 : 1}
                                                cursor={takenEarlier ? "not-allowed" : "pointer"}
                                                transition="border-color 0.15s ease, transform 0.15s ease"
                                                _hover={takenEarlier ? undefined : { transform: "scale(1.03)" }}
                                                onClick={() => !takenEarlier && pick(file)}
                                            />
                                        );
                                    })}
                                </SimpleGrid>

                                {/* Cream "Photo N" badge overlapping the left end of the blue hint pill */}
                                <Flex justify="center" align="center">
                                    <Box
                                        px="16px"
                                        py="8.42px"
                                        bg="Cream"
                                        borderRadius="30.31px"
                                        position="relative"
                                        zIndex={1}
                                    >
                                        <Text fontSize={{ base: "16", md: "20" }} fontWeight="500" color="Grey" whiteSpace="nowrap">
                                            {step.label}
                                        </Text>
                                    </Box>
                                    <Box
                                        py="8.42px"
                                        pl="40px"
                                        pr="32px"
                                        ml="-24px"
                                        bg="#E3F4FF"
                                        borderRadius="37.05px"
                                    >
                                        <Text fontSize={{ base: "16", md: "20" }} fontWeight="500" color="BlueText" whiteSpace="nowrap">
                                            Select a{" "}
                                            <Text as="span" textDecoration="underline">{step.hint}</Text>
                                            {" "}photo
                                        </Text>
                                    </Box>
                                </Flex>

                                <Flex justify={{ base: "center", md: "flex-end" }}>
                                    <S2SButton
                                        text={isLastStep ? "Finish" : "Next"}
                                        size="lg"
                                        disabled={!current}
                                        loading={isLastStep && isSubmitting}
                                        onClick={advance}
                                    />
                                </Flex>
                            </VStack>
                        </VStack>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}
