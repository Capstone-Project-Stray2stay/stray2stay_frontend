import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Dialog, Flex, Portal, Text, VStack } from "@chakra-ui/react";
import { LuBook, LuTrash2 } from "react-icons/lu";

import PhoneIcon from "../icons/phoneIcon.component";

import { S2SButton } from "../S2S.components";
import { useCancelAdoptionRequest } from "../../hooks/query/pet.query";
import RoundIconButton from "./roundIconButton.component";
import StatusBadge from "./statusBadge.component";
import type { AdoptedPet } from "../../types/profile.type";

function AdoptedPetRow({ pet }: { pet: AdoptedPet }) {
    const navigate = useNavigate();
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const cancelMutation = useCancelAdoptionRequest();

    return (
        <Flex justify="space-between" align="center" gap="24px" wrap="wrap" w="100%">
            <Flex align="center" gap="32px">
                <Avatar.Root boxSize="85px">
                    <Avatar.Fallback name={pet.name} />
                    <Avatar.Image src={pet.imageURL} />
                </Avatar.Root>
                {/* Same 4px name-to-detail gap as the My Rehoming rows */}
                <VStack align="flex-start" gap="4px">
                    <Text fontSize="18" fontWeight="500" color="Grey">
                        {pet.name}
                    </Text>
                    <Flex align="center" gap="6px">
                        <Flex color="GreyText" flexShrink={0}>
                            <PhoneIcon />
                        </Flex>
                        <Text fontSize="15" fontWeight="500" color="GreyMuted">
                            {pet.phone}
                        </Text>
                    </Flex>
                </VStack>
            </Flex>

            {/* Same button spacing as My Rehoming's pencil/trash pair */}
            <Flex align="center" gap={{ base: "8px", md: "12px" }}>
                {pet.status === "success" && (
                    <RoundIconButton
                        icon={LuBook}
                        ariaLabel={`Open ${pet.name}'s diary`}
                        color="BlueText"
                        onClick={() => navigate("/diary")}
                    />
                )}
                {pet.status === "pending" && (
                    <RoundIconButton
                        icon={LuTrash2}
                        ariaLabel={`Cancel request for ${pet.name}`}
                        color="GreyMuted"
                        onClick={() => setShowCancelConfirm(true)}
                    />
                )}
                <StatusBadge status={pet.status} />
            </Flex>

            {showCancelConfirm && (
                <Dialog.Root
                    open
                    onOpenChange={(e) => setShowCancelConfirm(e.open)}
                    placement="center"
                >
                    <Portal>
                        <Dialog.Backdrop bg="blackAlpha.400" />
                        <Dialog.Positioner>
                            <Dialog.Content maxW="380px" borderRadius="30px" p="0">
                                <VStack pt="40px" pb="32px" px="32px" gap="16px" align="center">
                                    <Text fontSize="20" fontWeight="600" color="Grey" textAlign="center">
                                        Withdraw this request?
                                    </Text>
                                    <Text fontSize="14" color="GreyText" textAlign="center">
                                        This cancels your adoption request for {pet.name}. This can't be
                                        undone.
                                    </Text>
                                    <Flex gap="12px" mt="8px">
                                        <S2SButton
                                            text="Cancel"
                                            variant="outline"
                                            width="120px"
                                            onClick={() => setShowCancelConfirm(false)}
                                            disabled={cancelMutation.isPending}
                                        />
                                        <S2SButton
                                            text="Withdraw"
                                            bgColor="red.500"
                                            width="120px"
                                            loading={cancelMutation.isPending}
                                            onClick={() => {
                                                setShowCancelConfirm(false);
                                                cancelMutation.mutate(pet.rid);
                                            }}
                                        />
                                    </Flex>
                                </VStack>
                            </Dialog.Content>
                        </Dialog.Positioner>
                    </Portal>
                </Dialog.Root>
            )}
        </Flex>
    );
}

export default function MyAdoptionsList({ pets }: { pets: AdoptedPet[] }) {
    if (pets.length === 0) {
        return (
            <Flex minH="200px" align="center" justify="center">
                <Text color="Grey" fontSize="16">You haven't requested to adopt any pets yet.</Text>
            </Flex>
        );
    }

    return (
        <VStack align="stretch" gap="32px" w="100%">
            {pets.map((pet) => (
                <AdoptedPetRow key={pet.id} pet={pet} />
            ))}
        </VStack>
    );
}
