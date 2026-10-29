import { Avatar, Box, Dialog, Flex, Portal, Text, VStack } from "@chakra-ui/react";

import { S2SButton, S2SDialogCloseButton } from "../S2S.components";
import type { DiaryPet } from "../../types/diary.type";

export default function MyAdoptionsModal({
    isOpen,
    pets,
    selectedPid,
    onClose,
    onSelect,
}: {
    isOpen: boolean;
    pets: DiaryPet[];
    selectedPid: number | null;
    onClose: () => void;
    onSelect: (pid: number) => void;
}) {
    return (
        <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()} placement="center">
            <Portal>
                <Dialog.Backdrop bg="blackAlpha.400" />
                <Dialog.Positioner>
                    <Dialog.Content maxW={{ base: "calc(100vw - 32px)", md: "421px" }} borderRadius="24px" p="0" position="relative">
                        <S2SDialogCloseButton onClick={onClose} top="32px" right="32px" boxSize="28px" iconBoxSize="14px" />

                        <VStack p="32px" gap="16px" align="stretch" maxH="70vh" overflowY="auto">
                            <Text fontSize="24" fontWeight="600" color="Grey" textAlign="center">
                                My Adoptions
                            </Text>

                            <Box h="2px" bg="SkyBlue" borderRadius="full" />

                            {pets.length === 0 && (
                                <Text fontSize="16" fontWeight="500" color="GreyMuted" textAlign="center">
                                    No adopted pets yet.
                                </Text>
                            )}

                            {pets.map((pet) => {
                                const isSelected = pet.pid === selectedPid;
                                return (
                                    <Flex key={pet.pid} justify="space-between" align="center" gap="20px">
                                        <Flex align="center" gap="20px" minW="0">
                                            <Avatar.Root boxSize="85px" flexShrink={0}>
                                                <Avatar.Fallback name={pet.petName} />
                                                <Avatar.Image src={pet.petImageAddress[0]} />
                                            </Avatar.Root>
                                            <VStack align="flex-start" gap="2px" minW="0">
                                                <Text fontSize="20" fontWeight="500" color="Grey" truncate>
                                                    {pet.petName}
                                                </Text>
                                                {/* Pets the user rehomed appear here too, but their
                                                    diary is read-only — say so before they open it. */}
                                                {!pet.canWrite && (
                                                    <Text fontSize="14" fontWeight="500" color="GreyMuted">
                                                        View only
                                                    </Text>
                                                )}
                                            </VStack>
                                        </Flex>

                                        {/* Figma "Small" buttons: Yellow for the current pet, Line to switch */}
                                        <Box flexShrink={0}>
                                            {isSelected ? (
                                                <S2SButton text="Selected" bgColor="Cream" size="sm" />
                                            ) : (
                                                <S2SButton
                                                    text="Change to"
                                                    variant="outline"
                                                    bgColor="BlueText"
                                                    size="sm"
                                                    onClick={() => {
                                                        onSelect(pet.pid);
                                                        onClose();
                                                    }}
                                                />
                                            )}
                                        </Box>
                                    </Flex>
                                );
                            })}
                        </VStack>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}
