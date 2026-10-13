import { Avatar, Box, Button, Dialog, Flex, Portal, Text, VStack } from "@chakra-ui/react";

import { S2SDialogCloseButton } from "../S2S.components";
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
                    <Dialog.Content maxW="451px" borderRadius="50px" p="0" position="relative">
                        <S2SDialogCloseButton onClick={onClose} boxSize="23.58px" iconBoxSize="12px" />

                        <VStack pt="46px" pb="48px" px="64px" gap="24px" align="stretch" maxH="70vh" overflowY="auto">
                            <Text fontSize="24px" fontWeight="600" color="Grey" textAlign="center">
                                My Adoptions
                            </Text>

                            <Box h="2px" bg="SkyBlue" borderRadius="full" />

                            {pets.length === 0 && (
                                <Text fontSize="16px" fontWeight="500" color="GreyMuted" textAlign="center">
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
                                                <Text fontSize="20px" fontWeight="600" color="Grey" truncate>
                                                    {pet.petName}
                                                </Text>
                                                {/* Pets the user rehomed appear here too, but their
                                                    diary is read-only — say so before they open it. */}
                                                {!pet.canWrite && (
                                                    <Text fontSize="14px" fontWeight="500" color="GreyMuted">
                                                        View only
                                                    </Text>
                                                )}
                                            </VStack>
                                        </Flex>

                                        <Button
                                            variant="plain"
                                            w="100px"
                                            h="23px"
                                            flexShrink={0}
                                            borderRadius="30.44px"
                                            bg={isSelected ? "Cream" : "transparent"}
                                            borderWidth={isSelected ? "0" : "1px"}
                                            borderColor="Cream"
                                            disabled={isSelected}
                                            _disabled={{ opacity: 1, cursor: "default" }}
                                            onClick={() => {
                                                onSelect(pet.pid);
                                                onClose();
                                            }}
                                        >
                                            <Text fontSize="15px" fontWeight="500" color="GreyText">
                                                {isSelected ? "Selected" : "Change to"}
                                            </Text>
                                        </Button>
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
