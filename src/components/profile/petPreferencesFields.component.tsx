import { useMemo } from "react";
import { Box, Circle, Flex, Grid, Icon, IconButton, Image, Text, VStack } from "@chakra-ui/react";
import { IoClose } from "react-icons/io5";
import { LuPlus } from "react-icons/lu";

import { S2SButton, S2SDropDown } from "../S2S.components";
import { detailDropDownStyle } from "../../utils/detailField.style";
import { ageGroupOptions, genderOptions } from "../../utils/petOptions.util";
import { useBreeds, useBreedImages, usePetColors, toBreedOptions } from "../../hooks/query/pet.query";

import ProfileField from "./profileField.component";
import { emptyPetPreference, type PetPreferenceDraft, type Species } from "../../types/profile.type";

const LABEL = { labelColor: "GreyText", labelSize: "16" } as const;

// Every preference field is optional, so each one can be cleared back to "no preference"
const PREFERENCE_DROPDOWN = { ...detailDropDownStyle, placeholder: "", clearable: true } as const;

const SPECIES_ICON: Record<Species, string> = {
    dog: "/assets/icons/dog.png",
    cat: "/assets/icons/cat.png",
};

/** One preference card (Figma "Dog #1"): species pill header with a remove button, then the four fields. */
function PreferenceCard({
    value,
    number,
    onChange,
    onRemove,
    disabled,
}: {
    value: PetPreferenceDraft;
    number: number;
    onChange: (patch: Partial<PetPreferenceDraft>) => void;
    onRemove: () => void;
    disabled?: boolean;
}) {
    const { breeds } = useBreeds(value.species);
    const { images: breedImages } = useBreedImages(value.species);
    const { colors: colorItems } = usePetColors(value.species, value.breed);

    const breedItems = useMemo(() => toBreedOptions(breeds, breedImages), [breeds, breedImages]);
    const label = `${value.species === "dog" ? "Dog" : "Cat"} #${number}`;

    return (
        <VStack
            align="stretch"
            gap="12px"
            p="16px"
            bg="rgba(255, 255, 255, 0.70)"
            borderRadius="24px"
            borderWidth="1px"
            borderColor="BabyGray"
        >
            {/* The species circle sits over the left end of the light-blue pill */}
            <Flex h="44px" align="center" position="relative" bg="rgba(198, 231, 247, 0.30)" borderRadius="32px" pl="56px" pr="8px">
                <Circle size="44px" bg="Cream" position="absolute" left="0" top="0">
                    <Image src={SPECIES_ICON[value.species]} alt="" w="29.33px" h="26.67px" objectFit="contain" />
                </Circle>
                <Text flex="1" fontSize="18" fontWeight="600" color="Grey">
                    {label}
                </Text>
                {!disabled && (
                    <IconButton
                        aria-label={`Remove ${label}`}
                        boxSize="28px"
                        minW="unset"
                        rounded="full"
                        bg="#EBEBEB"
                        _hover={{ bg: "#e0e0e0" }}
                        onClick={onRemove}
                    >
                        <Icon as={IoClose} boxSize="14px" color="GreyText" />
                    </IconButton>
                )}
            </Flex>

            <VStack align="stretch" gap="8px">
                <ProfileField label="Breed" {...LABEL}>
                    <S2SDropDown
                        key={breedItems.length === 0 ? "loading" : "loaded"}
                        {...PREFERENCE_DROPDOWN}
                        data={breedItems}
                        value={value.breed}
                        onValueChange={(breed) => onChange({ breed, color: "" })}
                        disabled={disabled}
                    />
                </ProfileField>
                <ProfileField label="Color" {...LABEL}>
                    <S2SDropDown
                        key={colorItems.length === 0 ? "loading" : "loaded"}
                        {...PREFERENCE_DROPDOWN}
                        data={colorItems}
                        value={value.color}
                        onValueChange={(color) => onChange({ color })}
                        disabled={disabled}
                    />
                </ProfileField>
                <ProfileField label="Age Group" {...LABEL}>
                    <S2SDropDown
                        {...PREFERENCE_DROPDOWN}
                        data={ageGroupOptions}
                        value={value.ageGroup}
                        onValueChange={(ageGroup) => onChange({ ageGroup })}
                        disabled={disabled}
                    />
                </ProfileField>
                <ProfileField label="Gender" {...LABEL}>
                    <S2SDropDown
                        {...PREFERENCE_DROPDOWN}
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

/** Dogs in the left column, cats in the right, each ending with its own "Add" button. */
function SpeciesColumn({
    species,
    preferences,
    onChange,
    disabled,
}: {
    species: Species;
    preferences: PetPreferenceDraft[];
    onChange: (preferences: PetPreferenceDraft[]) => void;
    disabled?: boolean;
}) {
    const cards = preferences.filter((p) => p.species === species);
    const update = (id: string, patch: Partial<PetPreferenceDraft>) =>
        onChange(preferences.map((p) => (p.id === id ? { ...p, ...patch } : p)));

    return (
        <VStack align="stretch" gap="16px" minW={0}>
            {cards.map((card, i) => (
                <PreferenceCard
                    key={card.id}
                    value={card}
                    number={i + 1}
                    disabled={disabled}
                    onChange={(patch) => update(card.id, patch)}
                    onRemove={() => onChange(preferences.filter((p) => p.id !== card.id))}
                />
            ))}
            {!disabled && (
                // Figma: "Add Dog" sits on the left, "Add Cat" on the right
                <Flex justify={species === "dog" ? "flex-start" : { base: "flex-start", md: "flex-end" }}>
                    <S2SButton
                        text={species === "dog" ? "Add Dog" : "Add Cat"}
                        variant="outline"
                        bgColor="BlueText"
                        size="lg"
                        icon={<LuPlus />}
                        onClick={() => onChange([...preferences, emptyPetPreference(species)])}
                    />
                </Flex>
            )}
        </VStack>
    );
}

export default function PetPreferencesFields({
    preferences,
    onChange,
    disabled = false,
    headerAction,
    showHeader = true,
}: {
    preferences: PetPreferenceDraft[];
    onChange: (preferences: PetPreferenceDraft[]) => void;
    disabled?: boolean;
    headerAction?: React.ReactNode;
    /** Off when the parent draws its own title, e.g. the popup that keeps it pinned above the scrolling cards */
    showHeader?: boolean;
}) {
    return (
        <VStack align="stretch" gap="16px" w="100%" minW={0}>
            {showHeader && (
                <Flex align="center" justify="space-between">
                    <Text fontSize={{ base: "18", md: "24" }} fontWeight="600" color="Grey">
                        Pet Preferences
                    </Text>
                    {headerAction}
                </Flex>
            )}

            {disabled && preferences.length === 0 ? (
                <Box py="8px">
                    <Text fontSize="16" fontWeight="500" color="GreyMuted">
                        No pet preferences yet.
                    </Text>
                </Box>
            ) : (
                <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} columnGap="28px" rowGap="16px" alignItems="start">
                    <SpeciesColumn species="dog" preferences={preferences} onChange={onChange} disabled={disabled} />
                    <SpeciesColumn species="cat" preferences={preferences} onChange={onChange} disabled={disabled} />
                </Grid>
            )}
        </VStack>
    );
}
