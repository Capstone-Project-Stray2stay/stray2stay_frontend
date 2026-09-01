import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";

import { S2SButton, S2SPageTitle } from "../components/S2S.components";
import { useBreeds, usePetColors, usePetInfo, useUpdatePet } from "../hooks/query/pet.query";

import PhotoPicker from "../components/rehome/photoPicker.component";
import Step3Details from "../components/rehome/step3Details.component";
import { splitAddress } from "../utils/address.util";
import { missingFields } from "../utils/validation";
import type { EditPetDraft, PetType } from "../types/rehome.type";
import type { PetInfoResponse } from "../services/apis/pet.api";

function toEditPetDraft(pet: PetInfoResponse): EditPetDraft {
    const petType = pet.petType.toLowerCase() as PetType;
    const { street, subDistrict, district, state } = splitAddress(pet.petAddress);

    return {
        petType: petType === "dog" || petType === "cat" ? petType : null,
        name: pet.petName,
        breed: pet.petBreed,
        color: pet.petColor,
        ageGroup: pet.petAgeGroup,
        gender: pet.petGender,
        personality: pet.petPersonality,
        vaccinations: pet.petVaccination,
        sterilized: pet.petSterilized,
        specialCare: (pet.petSpecialCare ?? "")
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        note: pet.note,
        location: {
            street,
            subDistrict,
            district,
            state,
            lat: pet.petAddressLat || null,
            long: pet.petAddressLong || null,
        },
        photos: pet.petImageAddress,
    };
}

export default function EditPet() {
    const { petId } = useParams();
    const { pet, isLoading, isError } = usePetInfo(petId);

    if (isLoading) return <Box></Box>;

    if (isError || !pet) return <Navigate to="/profile" replace />;

    return <EditPetForm key={petId} pid={pet.pid} initialDraft={toEditPetDraft(pet)} />;
}

function EditPetForm({ pid, initialDraft }: { pid: number; initialDraft: EditPetDraft }) {
    const navigate = useNavigate();

    const [draft, setDraft] = useState<EditPetDraft>(initialDraft);
    const [formError, setFormError] = useState("");
    const updatePetMutation = useUpdatePet();

    const { breeds } = useBreeds(draft.petType);
    const { colors } = usePetColors(draft.petType, draft.breed);

    const patchDraft = (patch: Partial<EditPetDraft>) =>
        setDraft((d) => ({ ...d, ...patch }));

    const handleSave = () => {
        const missing = missingFields(draft);
        if (missing.length > 0) {
            setFormError(`Please fill in: ${missing.join(", ")}.`);
            return;
        }

        setFormError("");
        updatePetMutation.mutate(
            { pid, draft },
            {
                onSuccess: () => navigate("/profile"),
                onError: () => setFormError("Failed to save changes. Please try again."),
            }
        );
    };

    return (
        // The sidebar is hidden below lg, so on a phone the page is the whole
        // viewport and has to supply its own side padding.
        <Box width={{ base: "100%", md: "80vw" }} px={{ base: "30px", md: "0" }}>
            <S2SPageTitle title="Edit Pet's Profile" />

            <Box maxW="736px" mx="auto" mt={{ base: "32px", md: "64px" }}>
                <PhotoPicker
                    photos={draft.photos}
                    onChange={(photos) => patchDraft({ photos })}
                />

                <Box mt={{ base: "32px", md: "48px" }}>
                    <Step3Details
                        draft={draft}
                        breeds={breeds}
                        colors={colors}
                        onChange={patchDraft}
                    />
                </Box>

                {formError && (
                    <Text mt="16px" fontSize="14px" color="red.500">
                        {formError}
                    </Text>
                )}

                <Flex justify="space-between" gap={4} mt={{ base: "48px", md: "80px" }}>
                    <S2SButton
                        text="Back"
                        variant="outline"
                        width={{ base: "116.42px", md: "134.39px" }}
                        height={{ base: "38.81px", md: "44.80px" }}
                        fontSize={{ base: "17.33px", md: "20px" }}
                        onClick={() => navigate(-1)}
                    />
                    <S2SButton
                        text="Finish"
                        width={{ base: "116.42px", md: "134.39px" }}
                        height={{ base: "38.81px", md: "44.80px" }}
                        fontSize={{ base: "17.33px", md: "20px" }}
                        loading={updatePetMutation.isPending}
                        onClick={handleSave}
                    />
                </Flex>
            </Box>
        </Box>
    );
}
