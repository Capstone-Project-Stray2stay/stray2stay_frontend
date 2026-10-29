import { Box, Image, Text, Flex } from "@chakra-ui/react";
import { IoMaleOutline, IoFemaleOutline } from "react-icons/io5";

import type { S2SPetCardType } from "../types/component.type"

export default function S2SPetCard({ rank, width, height, petImageURL, petAge, petBreed, petGender, petLocation, onClick }: S2SPetCardType) {
    return (
        <Box
            w={width}
            h={height}
            rounded={{base: "12px",md: "24px"}}
            overflow="hidden"
            bgColor="White"
            boxShadow="0px 4.43px 20.15px rgba(0, 0, 0, 0.03)"
            cursor={onClick ? "pointer" : "default"}
            onClick={onClick}
            transition="transform 0.2s"
            _hover={{
                transform: "scale(1.01)",
            }}
        >
            <Box position="relative">
                <Image
                    src={petImageURL}
                    alt={petBreed}
                    w="full"
                    h={{ base: "150px", md: "203px" }}
                    objectFit="cover"
                    bg="#E9E9E9"
                    rounded={{ base: "12px", md: "24px" }}
                />
                {rank && rank <= 3 && (
                    <Box
                        position="absolute"
                        top={0}
                        left={4}
                        w="36px"
                        h="44px"
                        bgColor="Orange"
                        clipPath="polygon(0 0, 100% 0, 100% 100%, 50% 68%, 0 100%)"
                        display="flex"
                        justifyContent="center"
                        pt="4px"
                    >
                        <Text color="white" fontWeight="semibold" fontSize="20" lineHeight="1.2">
                            {rank}
                        </Text>
                    </Box>
                )}
            </Box>
            <Flex direction="column" p={{ base: "8px", md: "16px" }} gap="8px">
                <Flex justify="space-between" align="center" gap={2}>
                    <Text
                        color="Grey"
                        fontSize={{ base: "14", md: "18" }}
                        fontWeight="semibold"
                        flex="1"
                        minW={0}
                        truncate
                    >
                        {petLocation}
                    </Text>
                    <Box flexShrink={0}>
                        {petGender === "Male" ? (
                            <IoMaleOutline size={21} color="#87CFF0" />
                        ) : (
                            <IoFemaleOutline size={21} color="#FF69B4" />
                        )}
                    </Box>
                </Flex>
                <Flex direction="column" gap="4px">
                    <Text fontSize={{ base: "14", md: "16" }} fontWeight="medium" color="BlueText" truncate>
                        {petBreed}
                    </Text>
                    <Text fontSize={{ base: "14", md: "16" }} fontWeight="medium" color="GreyInfo">
                        {petAge}
                    </Text>
                </Flex>
            </Flex>
        </Box>
    );
}