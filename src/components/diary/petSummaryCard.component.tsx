import { Avatar, Flex, Icon, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { IoFemale, IoMale } from "react-icons/io5";

import { S2SButton, S2SCardShell } from "../S2S.components";

import { formatAgeGroup, formatGender } from "../../utils/petOptions.util";
import type { DiaryPet } from "../../types/diary.type";

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <VStack align="flex-start" gap={{ base: "5px", md: "2px" }}>
            <Text fontSize="14" fontWeight="500" color="GreyMuted">
                {label}
            </Text>
            {children}
        </VStack>
    );
}

function Value({ children }: { children: React.ReactNode }) {
    return (
        <Text fontSize={{ base: "15", md: "16" }} fontWeight="500" color="Grey">
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
                    <Avatar.Fallback name={pet.petName} />
                    <Avatar.Image src={pet.petImageAddress[0]} />
                </Avatar.Root>

                <VStack align="flex-start" gap={{ base: "11px", md: "10px" }}>
                    <Text fontSize={{ base: "16", md: "20" }} fontWeight="600" color="Grey">
                        {pet.petName}
                    </Text>
                    {/* Figma: the "xs" Yellow button from the button sheet */}
                    <S2SButton text="Change" bgColor="Cream" size="xs" onClick={onChangeClick} />
                </VStack>
            </Flex>

            <SimpleGrid
                columns={2}
                columnGap={{ base: "27.12px", md: "32px" }}
                rowGap="8px"
                flex={{ md: "1" }}
                maxW={{ md: "460px" }}
                minW={{ md: "274px" }}
            >
                <Detail label="Age Group">
                    <Value>{formatAgeGroup(pet.petAgeGroup)}</Value>
                </Detail>
                <Detail label="Color">
                    <Value>{pet.petColor}</Value>
                </Detail>
                <Detail label="Gender">
                    <Flex align="center" gap="3px">
                        {/* Gender is stored uppercase ("FEMALE"), so compare on
                            the formatted label rather than the raw column. */}
                        <Icon
                            as={formatGender(pet.petGender) === "Female" ? IoFemale : IoMale}
                            boxSize={{ base: "17px", md: "16px" }}
                            color={formatGender(pet.petGender) === "Female" ? "pink.400" : "blue.400"}
                        />
                        <Value>{formatGender(pet.petGender)}</Value>
                    </Flex>
                </Detail>
                <Detail label="Breed">
                    <Value>{pet.petBreed}</Value>
                </Detail>
            </SimpleGrid>
        </S2SCardShell>
    );
}
