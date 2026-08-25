import { Avatar, Box, Dialog, Flex, Icon, IconButton, Portal, Text, VStack } from "@chakra-ui/react";
import { IoClose } from "react-icons/io5";

import type { DiaryPet } from "./diary.type";

export default function MyAdoptionsModal({
    isOpen,
    pets,
    selectedPetId,
    onClose,
    onSelect,
}: {
    isOpen: boolean;
    pets: DiaryPet[];
    selectedPetId: string;
    onClose: () => void;
    onSelect: (petId: string) => void;
}) {
    return (
        <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()} placement="center">
            <Portal>
                <Dialog.Backdrop bg="blackAlpha.400" />
                <Dialog.Positioner>
                    <Dialog.Content maxW="451px" borderRadius="50px" p="0" position="relative">
                        <IconButton
                            aria-label="Close"
                            onClick={onClose}
                            position="absolute"
                            top="32px"
                            right="32px"
                            boxSize="23.58px"
                            minW="unset"
                            p="0"
                            rounded="full"
                            bg="#EDEDED"
                            _hover={{ bg: "#e0e0e0" }}
                        >
                            <Icon as={IoClose} boxSize="12px" color="GreyText" />
                        </IconButton>

                        <VStack pt="46px" pb="48px" px="64px" gap="24px" align="stretch">
                            <Text fontSize="24px" fontWeight="600" color="Grey" textAlign="center">
                                My Adoptions
                            </Text>

                            <Box h="2px" bg="SkyBlue" borderRadius="full" />

                            {pets.map((pet) => {
                                const isSelected = pet.id === selectedPetId;
                                return (
                                    <Flex key={pet.id} justify="space-between" align="center" gap="20px">
                                        <Flex align="center" gap="20px">
                                            <Avatar.Root boxSize="85px">
                                                <Avatar.Fallback name={pet.name} />
                                                <Avatar.Image src={pet.imageURL} />
                                            </Avatar.Root>
                                            <Text fontSize="20px" fontWeight="600" color="Grey">
                                                {pet.name}
                                            </Text>
                                        </Flex>

                                        <Flex
                                            as="button"
                                            w="100px"
                                            h="23px"
                                            align="center"
                                            justify="center"
                                            borderRadius="30.44px"
                                            bg={isSelected ? "Cream" : "transparent"}
                                            borderWidth={isSelected ? "0" : "1px"}
                                            borderColor="Cream"
                                            cursor={isSelected ? "default" : "pointer"}
                                            // Chakra's Flex has no `disabled` prop, so the
                                            // active pet's chip is made inert by dropping
                                            // pointer events instead.
                                            pointerEvents={isSelected ? "none" : "auto"}
                                            onClick={() => {
                                                onSelect(pet.id);
                                                onClose();
                                            }}
                                        >
                                            <Text fontSize="15px" fontWeight="500" color="GreyText">
                                                {isSelected ? "Selected" : "Change to"}
                                            </Text>
                                        </Flex>
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
