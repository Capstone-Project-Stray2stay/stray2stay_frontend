import { Box, Image, Text, Flex } from "@chakra-ui/react";
import { IoMaleOutline, IoFemaleOutline } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";

import type { S2SPetCardType } from "../types/component.type"

export default function S2SPetCard({ rank, width, height, petImageURL, petAge, petBreed, petGender, petLocation, onClick }: S2SPetCardType) {
    return (
        <Box
            w={width}
            h={height}
            rounded={{base: "12px",md: "24px"}}
            overflow="hidden"
            bgColor="White"
            boxShadow="md"
            cursor={onClick ? "pointer" : "default"}
            onClick={onClick}
            transition="transform 0.2s"
            _hover={{
                transform: "scale(1.01)",
            }}
        >
            <Box position="relative">
                <Image src={petImageURL} alt={petBreed} w="full" h={{ base: "150px", md: "203px" }} objectFit="cover" />
                {rank && rank <= 3 && (
                    <Box
                        position="absolute"
                        top={0}
                        left={4}
                        w="40px"
                        h="50px"
                        bgColor="Yellow"
                        clipPath="polygon(0 0, 100% 0, 100% 100%, 50% 78%, 0 100%)"
                        display="flex"
                        justifyContent="center"
                        pt={2}
                    >
                        <Text color="white" fontWeight="bold" fontSize="lg">
                            {rank}
                        </Text>
                    </Box>
                )}
            </Box>
            <Box px={{base: "8px", md: "16px"}} py={{base: "12px", md: "auto"}} gap={"8px"}>
                <Flex justify="space-between" align="center" gap={2}>
                    <Flex
                        color="Grey"
                        align="center"
                        gap={1}
                        fontSize={{ base: "14px", md: "18px" }}
                        fontWeight="medium"
                        flex="1"
                        minW={0}
                    >
                        <Box flexShrink={0}>
                            <FaLocationDot />
                        </Box>
                        <Text truncate>
                            {petLocation}
                        </Text>
                    </Flex>
                    {petGender === "Male" ? (
                        <IoMaleOutline size={21} color="#87CFF0" />
                    ) : (
                        <IoFemaleOutline size={21} color="#FF69B4" />
                    )}
                </Flex>
                <Box>
                    <Text fontSize={{ base: "14px", md: "16px" }} fontWeight="medium" color="BlueText">
                        {petBreed}
                    </Text>
                    <Text fontSize={{ base: "14px", md: "16px" }} fontWeight="medium" color="LightGrey">
                        {petAge}
                    </Text>
                </Box>
            </Box>
        </Box>
    );
}