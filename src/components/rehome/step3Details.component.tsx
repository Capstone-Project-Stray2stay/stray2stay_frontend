import { useMemo, useState } from "react";
import { Box, Button, Flex, Icon, IconButton, Text, Textarea } from "@chakra-ui/react";
import { IoAdd, IoInformationCircleOutline } from "react-icons/io5";

import { S2SChip, S2SCheckbox, S2SDropDown, S2SInput } from "../S2S.components";
import { ageGroupOptions, genderOptions } from "../../utils/petOptions.util";
import DetailField, { DetailSection } from "./detailField.component";
import { detailDropDownStyle, detailInputStyle } from "../../utils/detailField.style";
import PetLocationSection from "./petLocationSection.component";
import { PERSONALITY_OPTIONS } from "../../utils/personalityOptions";
import { VACCINE_OPTIONS, type PetDetailsDraft, type PetType } from "../../types/rehome.type";
import type { S2SDropDownOption } from "../../types/component.type";

/** Breed options come back as plain strings; color options already come pre-built (with swatch images) from usePetColors. */
const toOptions = (values: string[]) => values.map((v) => ({ value: v, label: v }));

/**
 * The whole pet-details form. Typed on PetDetailsDraft rather than RehomeDraft
 * so both the wizard's step 3 and the Edit Pet's Profile page can drive it —
 * the two differ only in how they store photos, which this form never touches.
 */
export default function Step3Details({
    draft,
    breeds,
    colors,
    onChange,
}: {
    draft: PetDetailsDraft;
    breeds: string[];
    colors: S2SDropDownOption[];
    onChange: (patch: Partial<PetDetailsDraft>) => void;
}) {
    const [customPersonality, setCustomPersonality] = useState("");
    const [isAddingPersonality, setIsAddingPersonality] = useState(false);
    const [specialCareDraft, setSpecialCareDraft] = useState("");

    const petType: PetType = draft.petType ?? "dog";

    // Must be stable references: S2SDropDown pushes a changed `data` into its
    // collection, and doing so clears the combobox's filter text — so building
    // these inline would wipe the filter on every keystroke elsewhere in the form.
    const breedItems = useMemo(() => toOptions(breeds), [breeds]);
    const colorItems = colors;

    // Custom entries the user typed sit alongside the fixed list so they keep
    // rendering as chips after being added.
    const personalityChips = [
        ...PERSONALITY_OPTIONS,
        ...draft.personality.filter((p) => !PERSONALITY_OPTIONS.includes(p)),
    ];

    const togglePersonality = (text: string) => {
        onChange({
            personality: draft.personality.includes(text)
                ? draft.personality.filter((p) => p !== text)
                : [...draft.personality, text],
        });
    };

    const commitCustomPersonality = () => {
        const text = customPersonality.trim();
        if (text && !draft.personality.includes(text)) {
            onChange({ personality: [...draft.personality, text] });
        }
        setCustomPersonality("");
        setIsAddingPersonality(false);
    };

    const toggleVaccination = (vaccine: string) => {
        onChange({
            vaccinations: draft.vaccinations.includes(vaccine)
                ? draft.vaccinations.filter((v) => v !== vaccine)
                : [...draft.vaccinations, vaccine],
        });
    };

    const addSpecialCare = () => {
        const text = specialCareDraft.trim();
        if (text && !draft.specialCare.includes(text)) {
            onChange({ specialCare: [...draft.specialCare, text] });
        }
        setSpecialCareDraft("");
    };

    const divider = <Box h="1px" bg="SkyBlue" w="100%" />;

    return (
        <Flex direction="column" align="stretch" gap={{ base: "30px", md: "51px" }} w="100%">
            {/* ---------------- Pet's Profile ---------------- */}
            <DetailSection title="Pet's Profile">
                <Flex direction="column" align="stretch" gap={{ base: "18.38px", md: "21px" }}>
                    <DetailField label="Name (optional)">
                        <S2SInput
                            {...detailInputStyle}
                            placeholder="Leave blank if this pet has no name yet"
                            value={draft.name}
                            onChange={(e) => onChange({ name: e.target.value })}
                        />
                    </DetailField>

                    <DetailField label="Breed">
                        <S2SDropDown
                            // Remount once options finish loading: the underlying
                            // combobox doesn't resync its displayed text if `data`
                            // arrives async (useBreeds) after `value` is already
                            // set — it looks empty even though a value is selected
                            // (same fix as petLocationSection/petPreferencesFields).
                            key={breedItems.length === 0 ? "loading" : "loaded"}
                            placeholder=""
                            {...detailDropDownStyle}
                            data={breedItems}
                            value={draft.breed}
                            // Colors are breed-specific, so a breed change
                            // invalidates any colour already picked.
                            onValueChange={(breed) => onChange({ breed, color: "" })}
                        />
                    </DetailField>

                    <DetailField label="Color">
                        <S2SDropDown
                            key={colorItems.length === 0 ? "loading" : "loaded"}
                            placeholder=""
                            {...detailDropDownStyle}
                            data={colorItems}
                            value={draft.color}
                            // The endpoint needs a breed, so there is nothing
                            // to offer until one is chosen.
                            disabled={draft.breed === ""}
                            onValueChange={(color) => onChange({ color })}
                        />
                    </DetailField>

                    <DetailField label="Age Group">
                        <S2SDropDown
                            placeholder=""
                            {...detailDropDownStyle}
                            data={ageGroupOptions}
                            value={draft.ageGroup}
                            onValueChange={(ageGroup) => onChange({ ageGroup })}
                        />
                    </DetailField>

                    <DetailField label="Gender">
                        <S2SDropDown
                            placeholder=""
                            {...detailDropDownStyle}
                            data={genderOptions}
                            value={draft.gender}
                            onValueChange={(gender) => onChange({ gender })}
                        />
                    </DetailField>
                </Flex>
            </DetailSection>

            {/* ---------------- Pet's Personality ---------------- */}
            <DetailSection title="Pet's Personality">
                <Flex wrap="wrap" gap={{ base: "6.97px", md: "12px" }} align="center">
                    {personalityChips.map((text) => (
                        <S2SChip
                            key={text}
                            text={text}
                            selected={draft.personality.includes(text)}
                            onToggle={() => togglePersonality(text)}
                        />
                    ))}

                    {isAddingPersonality ? (
                        <S2SInput
                            {...detailInputStyle}
                            w="150px"
                            autoFocus
                            placeholder="Add trait"
                            value={customPersonality}
                            onChange={(e) => setCustomPersonality(e.target.value)}
                            onBlur={commitCustomPersonality}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") commitCustomPersonality();
                                if (e.key === "Escape") {
                                    setCustomPersonality("");
                                    setIsAddingPersonality(false);
                                }
                            }}
                        />
                    ) : (
                        <Button
                            variant="plain"
                            gap="6px"
                            h={{ base: "30px", md: "38px" }}
                            px={{ base: "12px", md: "16px" }}
                            borderRadius={{ base: "27.88px", md: "48px" }}
                            bg="rgba(255,255,255,0.70)"
                            borderWidth={{ base: "0.58px", md: "1px" }}
                            borderColor="BlueText"
                            onClick={() => setIsAddingPersonality(true)}
                        >
                            <Icon as={IoAdd} boxSize={{ base: "7.22px", md: "10.5px" }} color="GreyText" />
                            <Text fontSize={{ base: "14px", md: "16px" }} fontWeight="500" color="GreyText">
                                Add
                            </Text>
                        </Button>
                    )}
                </Flex>
            </DetailSection>

            {/* ---------------- Pet's Location ---------------- */}
            <PetLocationSection
                value={draft.location}
                onChange={(patch) => onChange({ location: { ...draft.location, ...patch } })}
            />

            {/* ---------------- Health & Conditions ---------------- */}
            <DetailSection title="Health & Conditions">
                <Flex direction="column" align="stretch" gap={{ base: "16px", md: "24px" }}>
                    {/* Mobile keeps the label on the left but stacks the boxes
                        down the right-hand side; there isn't room for a row. */}
                    <Flex align="flex-start" justify="space-between" gap="12px">
                        <Flex
                            w={{ base: "auto", md: "180px" }}
                            align="center"
                            gap={{ base: "8.24px", md: "9px" }}
                            flexShrink={0}
                        >
                            <Text fontSize={{ base: "16px", md: "18px" }} fontWeight="500" color="Grey">
                                Vaccinations
                            </Text>
                            <Icon
                                as={IoInformationCircleOutline}
                                boxSize={{ base: "16.48px", md: "18px" }}
                                color="BlueText"
                            />
                        </Flex>
                        <Flex
                            direction={{ base: "column", md: "row" }}
                            align="flex-start"
                            gap={{ base: "16.48px", md: "32px" }}
                            w={{ base: "94px", md: "auto" }}
                            flexShrink={0}
                        >
                            {VACCINE_OPTIONS[petType].map((vaccine) => (
                                <S2SCheckbox
                                    key={vaccine}
                                    label={vaccine}
                                    checked={draft.vaccinations.includes(vaccine)}
                                    onChange={() => toggleVaccination(vaccine)}
                                />
                            ))}
                        </Flex>
                    </Flex>

                    {divider}

                    <Flex align="flex-start" justify="space-between" gap="12px">
                        <Text
                            w={{ base: "auto", md: "180px" }}
                            flexShrink={0}
                            fontSize={{ base: "16px", md: "18px" }}
                            fontWeight="500"
                            color="Grey"
                        >
                            Sterilized
                        </Text>
                        {/* Drawn as two checkboxes but mutually exclusive, so
                            they act as a radio pair over one boolean. */}
                        <Flex
                            direction={{ base: "column", md: "row" }}
                            w={{ base: "94px", md: "180px" }}
                            justify={{ base: "flex-start", md: "space-between" }}
                            align="flex-start"
                            gap={{ base: "16.48px", md: "0" }}
                            flexShrink={0}
                        >
                            <S2SCheckbox
                                label="Yes"
                                checked={draft.sterilized === true}
                                onChange={() => onChange({ sterilized: true })}
                            />
                            <S2SCheckbox
                                label="No"
                                checked={draft.sterilized === false}
                                onChange={() => onChange({ sterilized: false })}
                            />
                        </Flex>
                    </Flex>

                    {divider}

                    {/* Mobile puts the label on its own line and drops the add
                        button below the input, aligned right. */}
                    <Flex
                        direction={{ base: "column", md: "row" }}
                        align={{ base: "stretch", md: "flex-start" }}
                        gap={{ base: "11.90px", md: "12px" }}
                    >
                        <Text
                            w={{ base: "auto", md: "180px" }}
                            flexShrink={0}
                            fontSize={{ base: "16px", md: "18px" }}
                            fontWeight="500"
                            color="Grey"
                        >
                            Special Care
                        </Text>
                        <Flex direction="column" gap={{ base: "11.90px", md: "12px" }} w="100%">
                            <Flex
                                direction={{ base: "column", md: "row" }}
                                align={{ base: "flex-end", md: "center" }}
                                gap={{ base: "11.90px", md: "13px" }}
                            >
                                <S2SInput
                                    {...detailInputStyle}
                                    w={{ base: "100%", md: "250px" }}
                                    borderRadius={{ base: "120.86px", md: "132px" }}
                                    placeholder="e.g. Disabilities , Chronic"
                                    value={specialCareDraft}
                                    onChange={(e) => setSpecialCareDraft(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            addSpecialCare();
                                        }
                                    }}
                                />
                                <IconButton
                                    aria-label="Add special care"
                                    boxSize={{ base: "27.47px", md: "30px" }}
                                    minW="unset"
                                    flexShrink={0}
                                    rounded="full"
                                    bg="Blue"
                                    color="white"
                                    onClick={addSpecialCare}
                                >
                                    <Icon as={IoAdd} boxSize={{ base: "13.73px", md: "15px" }} />
                                </IconButton>
                            </Flex>

                            {draft.specialCare.length > 0 && (
                                <Flex wrap="wrap" gap="12px">
                                    {draft.specialCare.map((item) => (
                                        <S2SChip
                                            key={item}
                                            text={item}
                                            selected
                                            onToggle={() =>
                                                onChange({
                                                    specialCare: draft.specialCare.filter(
                                                        (c) => c !== item,
                                                    ),
                                                })
                                            }
                                        />
                                    ))}
                                </Flex>
                            )}
                        </Flex>
                    </Flex>
                </Flex>
            </DetailSection>

            {/* ---------------- Note ---------------- */}
            <DetailSection title="Note">
                <Textarea
                    h="114px"
                    px="16px"
                    py="12px"
                    borderRadius={{ base: "15px", md: "21px" }}
                    bg="rgba(255,255,255,0.70)"
                    borderWidth="1px"
                    borderColor="BlueText"
                    fontSize={{ base: "14px", md: "16px" }}
                    color="Grey"
                    resize="none"
                    value={draft.note}
                    onChange={(e) => onChange({ note: e.target.value })}
                />
            </DetailSection>
        </Flex>
    );
}
