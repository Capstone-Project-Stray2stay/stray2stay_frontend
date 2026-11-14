import { Flex, Heading } from "@chakra-ui/react";

import { S2SAvatar } from "./S2S.components";

import type { S2SPageTitleType } from "../types/component.type"

export default function S2SPageTitle({ title }: S2SPageTitleType) {
    return (
        <Flex alignItems="center" justifyContent="space-between" gap={2} mb={{ base: 4, md: "48px" }}>
            <Heading as="h1" fontSize={{ base: "18px", md: "30px" }} color="Grey" fontWeight="semibold">
                {title}
            </Heading>
            <Flex display={{ base: "none", md: "flex" }}>
                <S2SAvatar />
            </Flex>
        </Flex>
    )
}