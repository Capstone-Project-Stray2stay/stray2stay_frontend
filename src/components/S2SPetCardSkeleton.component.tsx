import { Box, Flex, HStack, Skeleton, SkeletonCircle } from "@chakra-ui/react";

import type { S2SPetCardSkeletonType } from "../types/component.type"

export default function S2SPetCardSkeleton({ width, height }: S2SPetCardSkeletonType) {
    return (
        <Box
            w={width}
            h={height}
            rounded="30px"
            overflow="hidden"
            bgColor="White"
            boxShadow="md"
        >
            <Skeleton w="full" h="203px" />
            <Flex justify="space-between" align="center" px={4} py={"5px"}>
                <Skeleton h="18px" w="100px" />
                <SkeletonCircle size="24px" />
            </Flex>
            <Box px={4} pb={"10px"}>
                <Skeleton h="16px" w="140px" />
            </Box>
            <HStack px={4} pb={4} align="start" flexWrap="wrap">
                <Skeleton h="25px" w="70px" rounded="full" />
                <Skeleton h="25px" w="70px" rounded="full" />
            </HStack>
        </Box>
    );
}
