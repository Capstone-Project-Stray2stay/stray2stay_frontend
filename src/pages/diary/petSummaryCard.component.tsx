import { Avatar, Box, Flex, Icon, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { IoFemale, IoMale } from "react-icons/io5";

import { S2SCardShell } from "../../components/S2S.components";

import type { DiaryPet } from "./diary.type";

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <VStack align="flex-start" gap={{ base: "5px", md: "2px" }}>
            <Text fontSize="14px" fontWeight="500" color="GreyMuted">
                {label}
            </Text>
            {children}
        </VStack>
    );
}

function Value({ children }: { children: React.ReactNode }) {
    return (
        <Text fontSize={{ base: "15px", md: "16px" }} fontWeight="500" color="Grey">
            {children}
        </Text>
    );
}

export default function PetSummaryCard({
    pet,
    onChangeClick,
}: {
    pet: DiaryPet;
    onChangeClick: () => void;
}) {
    return (
        // Mobile drops the details under the avatar row instead of beside it.
        <S2SCardShell
            railColor="Cream"
            w="100%"
            direction={{ base: "column", md: "row" }}
            py={{ base: "20px", md: "16px" }}
            px={{ base: "20px", md: "32px" }}
            pl={{ base: "26px", md: "32px" }}
            gap={{ base: "9px", md: "32px" }}
            align={{ base: "stretch", md: "flex-start" }}
            wrap={{ md: "wrap" }}
        >
            <Flex gap={{ base: "20px", md: "24px" }} align="center">
                <Avatar.Root boxSize={{ base: "78px", md: "85px" }} flexShrink={0}>
                    <Avatar.Fallback name={pet.name} />
                    <Avatar.Image src={pet.imageURL} />
                </Avatar.Root>

                <VStack align="flex-start" gap={{ base: "11px", md: "10px" }}>
                    <Text fontSize={{ base: "16px", md: "20px" }} fontWeight="600" color="Grey">
                        {pet.name}
                    </Text>
                    <Box
                        as="button"
                        onClick={onChangeClick}
                        bg="Cream"
                        borderRadius={{ base: "16.51px", md: "30.44px" }}
                        px={{ base: "12px", md: "16px" }}
                        py={{ base: "3.75px", md: "6.92px" }}
                        cursor="pointer"
                        transition="filter 0.15s ease"
                        _hover={{ filter: "brightness(0.96)" }}
                    >
                        <Text fontSize={{ base: "14px", md: "15px" }} fontWeight="500" color="GreyText">
                            Change
                        </Text>
                    </Box>
                </VStack>
            </Flex>

            <SimpleGrid
                columns={2}
                columnGap={{ base: "27.12px", md: "50px" }}
                rowGap="8px"
                flex={{ md: "1" }}
                minW={{ md: "274px" }}
            >
                <Detail label="Age Group">
                    <Value>{pet.ageGroup}</Value>
                </Detail>
                <Detail label="Color">
                    <Value>{pet.color}</Value>
                </Detail>
                <Detail label="Gender">
                    <Flex align="center" gap="3px">
                        <Icon
                            as={pet.gender === "Female" ? IoFemale : IoMale}
                            boxSize={{ base: "17px", md: "16px" }}
                            color={pet.gender === "Female" ? "pink.400" : "blue.400"}
                        />
                        <Value>{pet.gender}</Value>
                    </Flex>
                </Detail>
                <Detail label="Breed">
                    <Value>{pet.breed}</Value>
                </Detail>
            </SimpleGrid>
        </S2SCardShell>
    );
}
