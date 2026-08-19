import { Avatar, Box, Flex, Icon, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { IoFemale, IoMale } from "react-icons/io5";

import { S2SCardShell } from "../../components/S2S.components";

import type { DiaryPet } from "./diary.type";

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <VStack align="flex-start" gap="2px">
            <Text fontSize="14px" fontWeight="500" color="GreyMuted">
                {label}
            </Text>
            {children}
        </VStack>
    );
}

function Value({ children }: { children: React.ReactNode }) {
    return (
        <Text fontSize="16px" fontWeight="500" color="Grey">
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
        <S2SCardShell
            railColor="Cream"
            w="100%"
            py="16px"
            px="32px"
            pl="46px"
            gap="32px"
            align="flex-start"
            wrap="wrap"
        >
            <Flex gap="24px" align="flex-start">
                <Avatar.Root boxSize="85px">
                    <Avatar.Fallback name={pet.name} />
                    <Avatar.Image src={pet.imageURL} />
                </Avatar.Root>

                <VStack align="flex-start" gap="10px">
                    <Text fontSize="20px" fontWeight="600" color="Grey">
                        {pet.name}
                    </Text>
                    <Box
                        as="button"
                        onClick={onChangeClick}
                        bg="Cream"
                        borderRadius="30.44px"
                        px="16px"
                        py="6.92px"
                        cursor="pointer"
                        transition="filter 0.15s ease"
                        _hover={{ filter: "brightness(0.96)" }}
                    >
                        <Text fontSize="15px" fontWeight="500" color="GreyText">
                            Change
                        </Text>
                    </Box>
                </VStack>
            </Flex>

            <SimpleGrid columns={2} columnGap="50px" rowGap="8px" flex="1" minW="274px">
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
                            boxSize="16px"
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
