import { Box, Image, Text, HStack, Flex } from "@chakra-ui/react";
import { IoMaleOutline, IoFemaleOutline } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";

import { S2SChip } from "./S2S.components";

export default function S2SPetCard({ width, petName, petImageURL, petAge, petBreed, petGender, petLocation, onClick }: { width: string | number, petName?: string, petImageURL: string, petAge: string, petBreed: string, petGender: string, petLocation: string, onClick?: () => void }) {
    return (
        <Box
            w={width}
            h="auto"
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
            <Image src={petImageURL} alt={petName} w="full" h="200px" objectFit="cover" />
            <Flex justify="space-between" align="center">
                <Text px={4} py={2} fontSize="lg" fontWeight="bold">{petName}</Text>
                {petGender === "Male" ? (
                    <IoMaleOutline size={24} color="#87CFF0" style={{ marginLeft: "auto", marginRight: "1rem", marginTop: "0.5rem" }} />
                ) : (
                    <IoFemaleOutline size={24} color="#FF69B4" style={{ marginLeft: "auto", marginRight: "1rem", marginTop: "0.5rem" }} />
                )}
            </Flex>
            <Text px={4} pb={2} fontSize="md" color="GrayText" justifyContent="left" alignItems="center" display="flex" gap={1}>
                <FaLocationDot /> {petLocation}
            </Text>
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