import { useNavigate } from "react-router-dom";
import { Avatar, Flex, Icon, Text, VStack } from "@chakra-ui/react";
import { LuBookOpen, LuPhone, LuTrash2 } from "react-icons/lu";

import RoundIconButton from "./roundIconButton.component";
import StatusBadge from "./statusBadge.component";
import type { AdoptedPet } from "./profile.type";

export default function MyAdoptionsList({ pets }: { pets: AdoptedPet[] }) {
    const navigate = useNavigate();

    return (
        <VStack align="stretch" gap="32px" w="100%">
            {pets.map((pet) => (
                <Flex
                    key={pet.id}
                    justify="space-between"
                    align="center"
                    gap="24px"
                    wrap="wrap"
                    w="100%"
                >
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
                        {pet.status === "success" ? (
                            <RoundIconButton
                                icon={LuBookOpen}
                                ariaLabel={`Open ${pet.name}'s diary`}
                                color="BlueText"
                                onClick={() => navigate("/diary")}
                            />
                        ) : (
                            // TODO: no route for withdrawing a pending adoption
                            // request exists yet.
                            <RoundIconButton
                                icon={LuTrash2}
                                ariaLabel={`Cancel request for ${pet.name}`}
                                color="GreyMuted"
                            />
                        )}
                        <StatusBadge status={pet.status} />
                    </Flex>
                </Flex>
            ))}
        </VStack>
    );
}
