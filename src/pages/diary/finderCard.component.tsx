import { Avatar, Flex, Icon, Text, VStack } from "@chakra-ui/react";
import { IoCall } from "react-icons/io5";

import { S2SCardShell } from "../../components/S2S.components";
import type { DiaryFinder } from "./diary.type";

export default function FinderCard({ finder }: { finder: DiaryFinder }) {
    return (
        <S2SCardShell railColor="Cream" w="100%" py="16px" px="32px" pl="46px" align="center">
            <Flex gap="24px" align="center">
                <Avatar.Root boxSize="85px">
                    <Avatar.Fallback name={finder.name} />
                    <Avatar.Image src={finder.imageURL} />
                </Avatar.Root>

                <VStack align="flex-start" gap="7px">
                    <Text fontSize="20px" fontWeight="600" color="Grey">
                        {finder.name}
                    </Text>
                    <Text fontSize="15px" fontWeight="500" color="GreyMuted">
                        {finder.role}
                    </Text>
                    <Flex align="center" gap="8px">
                        <Icon as={IoCall} boxSize="14px" color="GreyText" />
                        <Text fontSize="15px" fontWeight="500" color="GreyMuted">
                            {finder.phone}
                        </Text>
                    </Flex>
                </VStack>
            </Flex>
        </S2SCardShell>
    );
}
