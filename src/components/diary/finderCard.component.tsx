import { Avatar, Flex, Icon, Text, VStack } from "@chakra-ui/react";
import { IoCall } from "react-icons/io5";

import { S2SCardShell } from "../S2S.components";
import type { DiaryPet } from "../../types/diary.type";

/**
 * The other party on the rehoming. For an adopter that is the finder, as in
 * the designs; for a finder reading the diary it is the adopter instead, so
 * the role label comes from the server rather than being hardcoded.
 */
export default function FinderCard({ pet }: { pet: DiaryPet }) {
    return (
        <S2SCardShell
            railColor="Cream"
            railWidth="14px"
            w="100%"
            // Two-column desktop: as wide as the month calendar below and as tall as the pet card on the left
            // (Figma pet card: 95 content + 16/16 padding = 127). Single column: full width like the pet card.
            maxW={{ xl: "398.99px" }}
            minH={{ md: "127px" }}
            py="16px"
            // Figma mobile (1009:2124): content 40px in, 24px avatar gap
            px={{ base: "40px", md: "32px" }}
            align="center"
        >
            <Flex gap="24px" align="center" minW="0">
                <Avatar.Root boxSize="85px" flexShrink={0}>
                    <Avatar.Fallback name={pet.counterpartName} />
                    <Avatar.Image src={pet.counterpartImage} />
                </Avatar.Root>

                <VStack align="flex-start" gap={{ base: "8px", md: "7px" }} minW="0">
                    <Text fontSize="20" fontWeight="600" color="Grey" truncate maxW="100%">
                        {pet.counterpartName}
                    </Text>
                    <Text fontSize="15" fontWeight="500" color="GreyMuted">
                        {pet.counterpartRole}
                    </Text>
                    {/* Plenty of accounts have never filled in a phone number. */}
                    {pet.counterpartPhone && (
                        <Flex align="center" gap={{ base: "7px", md: "8px" }}>
                            <Icon as={IoCall} boxSize="14px" color="GreyText" />
                            <Text fontSize="15" fontWeight="500" color="GreyMuted">
                                {pet.counterpartPhone}
                            </Text>
                        </Flex>
                    )}
                </VStack>
            </Flex>
        </S2SCardShell>
    );
}
