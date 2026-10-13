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
            w="100%"
            py="16px"
            px={{ base: "20px", md: "32px" }}
            pl={{ base: "26px", md: "32px" }}
            align="center"
        >
            <Flex gap={{ base: "20px", md: "24px" }} align="center" minW="0">
                <Avatar.Root boxSize={{ base: "69.53px", md: "85px" }} flexShrink={0}>
                    <Avatar.Fallback name={pet.counterpartName} />
                    <Avatar.Image src={pet.counterpartImage} />
                </Avatar.Root>

                <VStack align="flex-start" gap={{ base: "5.73px", md: "7px" }} minW="0">
                    <Text fontSize={{ base: "16px", md: "20px" }} fontWeight="600" color="Grey" truncate>
                        {pet.counterpartName}
                    </Text>
                    <Text fontSize={{ base: "14px", md: "15px" }} fontWeight="500" color="GreyMuted">
                        {pet.counterpartRole}
                    </Text>
                    {/* Plenty of accounts have never filled in a phone number. */}
                    {pet.counterpartPhone && (
                        <Flex align="center" gap="8px">
                            <Icon as={IoCall} boxSize={{ base: "11.45px", md: "14px" }} color="GreyText" />
                            <Text fontSize={{ base: "14px", md: "15px" }} fontWeight="500" color="GreyMuted">
                                {pet.counterpartPhone}
                            </Text>
                        </Flex>
                    )}
                </VStack>
            </Flex>
        </S2SCardShell>
    );
}
