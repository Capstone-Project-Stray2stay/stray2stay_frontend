import { Flex, Heading } from "@chakra-ui/react";

import { S2SAvatar } from "./S2S.components";

export default function S2SPageTitle({ title }: { title: string }) {
    return (
        <Flex alignItems="center" justifyContent="space-between" gap={2} mb={4}>
            <Heading as="h1" size="xl" color="Grey" fontWeight="semibold">
                {title}
            </Heading>
            <Flex display={{ base: "none", md: "flex" }}>
                <S2SAvatar />
            </Flex>
        </Flex>
    )
}