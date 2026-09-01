import { useMemo } from "react";
import { Circle, Flex, Image, Text, VStack } from "@chakra-ui/react";

import { S2SDropDown } from "../S2S.components";
import { detailDropDownStyle } from "../../utils/detailField.style";
import { ageGroupOptions, genderOptions } from "../../utils/petOptions.util";
import { useBreeds, usePetColors } from "../../hooks/query/pet.query";

import ProfileField from "./profileField.component";
import type { PetPreferenceDraft, Species } from "../../types/profile.type";

const LABEL = { labelColor: "GreyText", labelSize: "13.05px" } as const;

const toOptions = (values: string[]) => values.map((v) => ({ value: v, label: v }));

function SpeciesColumn({
    species,
    value,
    onChange,
    disabled,
}: {
    species: Species;
    value: PetPreferenceDraft;
    onChange: (patch: Partial<PetPreferenceDraft>) => void;
    disabled?: boolean;
}) {
    const isDog = species === "dog";

    const { breeds } = useBreeds(species);
    const { colors: colorItems } = usePetColors(species, value.breed);

    const breedItems = useMemo(() => toOptions(breeds), [breeds]);

    return (
        <VStack align="stretch" gap="12px" flex="1 1 265px" minW="240px" maxW="320px">
            <Flex
                h="40px"
                align="center"
                bg="rgba(198,231,246,0.36)"
                borderRadius="49.77px"
                pr="16px"
                position="relative"
            >
                <Circle size="40px" bg="Cream" flexShrink={0}>
                    {isDog ? (
                        <Image src="/assets/icons/dog.png" alt="" w="26px" h="22px" />
                    ) : (
                        <Image src="/assets/icons/cat.png" alt="" w="28px" h="28px" />
                    )}
                </Circle>
                <Text
                    flex="1"
                    textAlign="center"
                    fontSize="16.32px"
                    fontWeight="600"
                    color="Grey"
                    ml="-20px"
                >
                    {isDog ? "Dog" : "Cat"}
                </Text>
            </Flex>

            <VStack align="stretch" gap="12px">
                <ProfileField label="Breed" {...LABEL}>
                    <S2SDropDown
                        key={breedItems.length === 0 ? "loading" : "loaded"}
                        {...detailDropDownStyle}
                        placeholder=""
                        data={breedItems}
                        value={value.breed}
                        onValueChange={(breed) => onChange({ breed, color: "" })}
                        disabled={disabled}
                    />
                </ProfileField>
                <ProfileField label="Color" {...LABEL}>
                    <S2SDropDown
                        key={colorItems.length === 0 ? "loading" : "loaded"}
                        {...detailDropDownStyle}
                        placeholder=""
                        data={colorItems}
                        value={value.color}
                        onValueChange={(color) => onChange({ color })}
                        disabled={disabled}
                    />
                </ProfileField>
                <ProfileField label="Age Group" {...LABEL}>
                    <S2SDropDown
                        {...detailDropDownStyle}
                        placeholder=""
                        data={ageGroupOptions}
                        value={value.ageGroup}
                        onValueChange={(ageGroup) => onChange({ ageGroup })}
                        disabled={disabled}
                    />
                </ProfileField>
                <ProfileField label="Gender" {...LABEL}>
                    <S2SDropDown
                        {...detailDropDownStyle}
                        placeholder=""
                        data={genderOptions}
                        value={value.gender}
                        onValueChange={(gender) => onChange({ gender })}
                        disabled={disabled}
                    />
                </ProfileField>
            </VStack>
        </VStack>
    );
}

export default function PetPreferencesFields({
    dog,
    cat,
    onDogChange,
    onCatChange,
    disabled = false,
    headerAction,
}: {
    dog: PetPreferenceDraft;
    cat: PetPreferenceDraft;
    onDogChange: (patch: Partial<PetPreferenceDraft>) => void;
    onCatChange: (patch: Partial<PetPreferenceDraft>) => void;
    disabled?: boolean;
    headerAction?: React.ReactNode;
}) {
    return (
        <VStack align="stretch" gap="16px" w="100%" minW={0}>
            <Flex align="center" justify="space-between">
                <Text fontSize="24px" fontWeight="600" color="Grey">
                    Pet Preferences
                </Text>
                {headerAction}
            </Flex>

            <Flex gap="32px" wrap="wrap" justify="space-between" w="100%">
                <SpeciesColumn species="dog" value={dog} onChange={onDogChange} disabled={disabled} />
                <SpeciesColumn species="cat" value={cat} onChange={onCatChange} disabled={disabled} />
            </Flex>
        </VStack>
    );
}
