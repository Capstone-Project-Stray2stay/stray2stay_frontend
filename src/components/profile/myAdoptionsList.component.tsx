import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Dialog, Flex, Icon, Portal, Text, VStack } from "@chakra-ui/react";
import { LuBookOpen, LuPhone, LuTrash2 } from "react-icons/lu";

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
                <VStack align="flex-start" gap="12px">
                    <Text fontSize="18px" fontWeight="500" color="Grey">
                        {pet.name}
                    </Text>
                    <Flex align="center" gap="8px">
                        <Icon as={LuPhone} boxSize="14px" color="GreyText" />
                        <Text fontSize="15px" fontWeight="500" color="GreyMuted">
                            {pet.phone}
                        </Text>
                    </Flex>
                </VStack>
            </Flex>

            <Flex align="center" gap="16px">
                {pet.status === "success" && (
                    <RoundIconButton
                        icon={LuBookOpen}
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

            <Dialog.Root
                open={showCancelConfirm}
                onOpenChange={(e) => setShowCancelConfirm(e.open)}
                placement="center"
            >
                <Portal>
                    <Dialog.Backdrop bg="blackAlpha.400" />
                    <Dialog.Positioner>
                        <Dialog.Content maxW="380px" borderRadius="30px" p="0">
                            <VStack pt="40px" pb="32px" px="32px" gap="16px" align="center">
                                <Text fontSize="20px" fontWeight="600" color="Grey" textAlign="center">
                                    Withdraw this request?
                                </Text>
                                <Text fontSize="14px" color="GreyText" textAlign="center">
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
                                        onClick={() =>
                                            cancelMutation.mutate(pet.rid, {
                                                onSuccess: () => setShowCancelConfirm(false),
                                            })
                                        }
                                    />
                                </Flex>
                            </VStack>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
        </Flex>
    );
}

export default function MyAdoptionsList({ pets }: { pets: AdoptedPet[] }) {
    return (
        <VStack align="stretch" gap="32px" w="100%">
            {pets.map((pet) => (
                <AdoptedPetRow key={pet.id} pet={pet} />
            ))}
        </VStack>
    );
}
