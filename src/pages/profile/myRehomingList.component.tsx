import { useState } from "react";
import { Avatar, Flex, Icon, Text, VStack } from "@chakra-ui/react";
import { LuChevronDown, LuChevronUp, LuPencil, LuPhone, LuTrash2 } from "react-icons/lu";

import RoundIconButton from "./roundIconButton.component";
import type { RehomingInterest, RehomingPet } from "./profile.type";

/** Outlined pill button — 38px tall, colour drives the ring only. */
function PillButton({
    label,
    borderColor,
    width,
    onClick,
}: {
    label: string;
    borderColor: string;
    width: string;
    onClick?: () => void;
}) {
    return (
        <Flex
            as="button"
            h="38px"
            w={width}
            maxW="100%"
            align="center"
            justify="center"
            px="12px"
            borderRadius="30.44px"
            borderWidth="1px"
            borderColor={borderColor}
            cursor="pointer"
            transition="background 0.15s ease"
            _hover={{ bg: "blackAlpha.50" }}
            onClick={onClick}
        >
            <Text fontSize="18px" fontWeight="500" color="GreyText" whiteSpace="nowrap">
                {label}
            </Text>
        </Flex>
    );
}

function InterestRow({ interest }: { interest: RehomingInterest }) {
    return (
        <Flex justify="space-between" align="center" gap="24px" wrap="wrap" w="100%">
            <Flex align="center" gap="32px">
                <Avatar.Root boxSize="85px">
                    <Avatar.Fallback name={interest.name} />
                    <Avatar.Image src={interest.imageURL} />
                </Avatar.Root>
                <VStack align="flex-start" gap="12px">
                    <Text fontSize="18px" fontWeight="500" color="Grey">
                        {interest.name}
                    </Text>
                    <Flex align="center" gap="8px">
                        <Icon as={LuPhone} boxSize="14px" color="GreyText" />
                        <Text fontSize="15px" fontWeight="500" color="GreyMuted">
                            {interest.phone}
                        </Text>
                    </Flex>
                </VStack>
            </Flex>

            <Flex align="center" gap="16px" wrap="wrap">
                {/* TODO: open the screening answers. GET /pets/:pid/screening-answer
                    exists but is registered as GET while its handler parses a
                    request body, so it can't be called as-is. */}
                <PillButton label="View Screening Answers" borderColor="Blue" width="276px" />
                {/* TODO: POST /pets/:pid/select-adopter once this page is wired up. */}
                <PillButton label="Accept" borderColor="GreenBorder" width="115px" />
            </Flex>
        </Flex>
    );
}

function RehomingRow({ pet }: { pet: RehomingPet }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <VStack align="stretch" gap="32px" w="100%">
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
                            <Flex boxSize="8px" borderRadius="full" bg="YellowBorder" flexShrink={0} />
                            <Text fontSize="15px" fontWeight="500" color="GreyMuted">
                                {pet.interests.length} Interested
                            </Text>
                        </Flex>
                    </VStack>
                </Flex>

                <Flex align="center" gap="16px">
                    {/* TODO: no PUT /pets/:pid route exists yet. */}
                    <RoundIconButton icon={LuPencil} ariaLabel={`Edit ${pet.name}`} color="Blue" />
                    {/* TODO: no DELETE /pets/:pid route exists yet. */}
                    <RoundIconButton
                        icon={LuTrash2}
                        ariaLabel={`Delete ${pet.name}`}
                        color="GreyMuted"
                    />
                    <Flex
                        as="button"
                        aria-label={expanded ? "Collapse" : "Expand"}
                        align="center"
                        cursor="pointer"
                        color="GreyText"
                        onClick={() => setExpanded((open) => !open)}
                    >
                        <Icon as={expanded ? LuChevronUp : LuChevronDown} boxSize="22px" />
                    </Flex>
                </Flex>
            </Flex>

            {expanded && (
                <VStack align="stretch" gap="32px" pl={{ base: "24px", lg: "112px" }} w="100%">
                    {pet.interests.map((interest) => (
                        <InterestRow key={interest.id} interest={interest} />
                    ))}
                </VStack>
            )}
        </VStack>
    );
}

export default function MyRehomingList({ pets }: { pets: RehomingPet[] }) {
    return (
        <VStack align="stretch" gap="32px" w="100%">
            {pets.map((pet) => (
                <RehomingRow key={pet.id} pet={pet} />
            ))}
        </VStack>
    );
}
