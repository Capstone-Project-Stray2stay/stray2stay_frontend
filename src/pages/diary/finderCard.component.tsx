import { Avatar, Flex, Icon, Text, VStack } from "@chakra-ui/react";
import { IoCall } from "react-icons/io5";

import { S2SCardShell } from "../../components/S2S.components";
import type { DiaryFinder } from "./diary.type";

export default function FinderCard({ finder }: { finder: DiaryFinder }) {
    return (
        <S2SCardShell
            railColor="Cream"
            w="100%"
            py="16px"
            px={{ base: "20px", md: "32px" }}
            pl={{ base: "26px", md: "32px" }}
            align="center"
        >
            <Flex gap={{ base: "20px", md: "24px" }} align="center">
                <Avatar.Root boxSize={{ base: "69.53px", md: "85px" }} flexShrink={0}>
                    <Avatar.Fallback name={finder.name} />
                    <Avatar.Image src={finder.imageURL} />
                </Avatar.Root>

                <VStack align="flex-start" gap={{ base: "5.73px", md: "7px" }}>
                    <Text fontSize={{ base: "16px", md: "20px" }} fontWeight="600" color="Grey">
                        {finder.name}
                    </Text>
                    <Text fontSize={{ base: "14px", md: "15px" }} fontWeight="500" color="GreyMuted">
                        {finder.role}
                    </Text>
                    <Flex align="center" gap="8px">
                        <Icon as={IoCall} boxSize={{ base: "11.45px", md: "14px" }} color="GreyText" />
                        <Text fontSize={{ base: "14px", md: "15px" }} fontWeight="500" color="GreyMuted">
                            {finder.phone}
                        </Text>
                    </Flex>
                </VStack>
            </Flex>
        </S2SCardShell>
    );
}
