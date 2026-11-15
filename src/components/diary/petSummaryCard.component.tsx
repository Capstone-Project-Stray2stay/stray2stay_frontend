import { Avatar, Flex, Icon, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { IoFemale, IoMale } from "react-icons/io5";

import { S2SButton, S2SCardShell } from "../S2S.components";

import { formatAgeGroup, formatGender, GENDER_COLORS } from "../../utils/petOptions.util";
import type { DiaryPet } from "../../types/diary.type";

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <VStack align="flex-start" gap="2px">
            <Text fontSize="14" fontWeight="500" color="GreyMuted">
                {label}
            </Text>
            {children}
        </VStack>
    );
}

function Value({ children }: { children: React.ReactNode }) {
    return (
        <Text fontSize="16" fontWeight="500" color="Grey">
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
            railWidth="14px"
            w="100%"
            direction={{ base: "column", md: "row" }}
            // Figma mobile (Frame 1009:2097): 16px top/bottom, content 40px in from the left edge, 2px under the avatar row
            py="16px"
            px={{ base: "40px", md: "32px" }}
            gap={{ base: "2px", md: "32px" }}
            // Figma Frame 250: 95 content + 16/16 padding = 127 tall; finder card matches this height.
            // Text boxes use Figma's Auto line height
            minH={{ md: "127px" }}
            lineHeight="normal"
            align={{ base: "stretch", md: "center" }}
            justify={{ md: "center" }}
            wrap={{ md: "wrap" }}
        >
            {/* Mobile: avatar and name column top-aligned in a 94px row */}
            <Flex gap="24px" align={{ base: "flex-start", md: "center" }} h={{ base: "94px", md: "auto" }}>
                <Avatar.Root boxSize="85px" flexShrink={0}>
                    <Avatar.Fallback name={pet.petName} />
                    <Avatar.Image src={pet.petImageAddress[0]} />
                </Avatar.Root>

                <VStack align="flex-start" gap="10px" minW="0">
                    <Text fontSize="20" fontWeight="600" color="Grey" truncate maxW="100%">
                        {pet.petName}
                    </Text>
                    {/* Figma: the "xs" Yellow button from the button sheet; mobile is a smaller 83 x 22 / 15px instance */}
                    <S2SButton
                        text="Change"
                        bgColor="Cream"
                        size="xs"
                        width={{ base: "83.13px", md: "auto" }}
                        minWidth={{ base: "0", md: "100px" }}
                        height={{ base: "22.28px", md: "auto" }}
                        fontSize={{ base: "15", md: "16" }}
                        onClick={onChangeClick}
                    />
                </VStack>
            </Flex>

            {/* Figma: the second column starts 119px in on both rows (mobile rows 7px apart in a 95px block) */}
            <SimpleGrid
                templateColumns={{ base: "89px minmax(0, 1fr)", md: "89px max-content" }}
                columnGap="30px"
                rowGap={{ base: "7px", md: "8px" }}
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
                            boxSize="16px"
                            color={formatGender(pet.petGender) === "Female" ? GENDER_COLORS.female : GENDER_COLORS.male}
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
