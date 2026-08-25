import { Box, Image, Text, HStack, Flex } from "@chakra-ui/react";
import { IoMaleOutline, IoFemaleOutline } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";

import { S2SChip } from "./S2S.components";

import type { S2SPetCardType } from "../types/component.type"

export default function S2SPetCard({ rank, width, height, petImageURL, petAge, petBreed, petGender, petLocation, onClick }: S2SPetCardType) {
    return (
        <Box
            w={width}
            h={height}
            rounded="30px"
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
                <Image src={petImageURL} alt={petBreed} w="full" h="203px" objectFit="cover" />
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
            <Flex justify="space-between" align="center" pt={4} px={4} pb={2}>
                <Text
                    fontSize="md"
                    color="Grey"
                    justifyContent="left"
                    alignItems="center"
                    display="flex"
                    gap={1}
                    fontWeight="bold"
                >
                    <FaLocationDot /> {petLocation}
                </Text>
                {petGender === "Male" ? (
                    <IoMaleOutline size={24} color="#87CFF0" />
                ) : (
                    <IoFemaleOutline size={24} color="#FF69B4" />
                )}
            </Flex>
            <HStack px={4} pb={4} align="start" flexWrap="wrap">
                <S2SChip
                    key={petBreed}
                    text={petBreed}
                    readOnly
                />
                <S2SChip
                    key={petAge}
                    text={petAge}
                    readOnly
                />
            </HStack>
        </Box>
    );
}