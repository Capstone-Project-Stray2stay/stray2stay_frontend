import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";

import { S2SButton, S2SPageTitle } from "../components/S2S.components";
import { useBreeds, usePetColors } from "../hooks/query/pet.query";

import PhotoPicker from "./rehome/photoPicker.component";
import Step3Details from "./rehome/step3Details.component";
import { getMockEditPet } from "./rehome/mockEditPet";
import { missingFields } from "./rehome/validation";
import type { EditPetDraft } from "./rehome/rehome.type";

/**
 * Edit Pet's Profile — reached from the pencil button on the Profile page's
 * "My Rehoming" list. Everything the Register a Pet wizard spreads across three
 * steps sits on one page here, since nothing needs discovering the second time
 * around: the photos and the whole details form, with no stepper and no AI
 * classification.
 *
 * Resolves the pet before mounting the form so its draft state can initialize
 * straight from the pet's values, instead of syncing them in after the fact via
 * an effect (same split as profile.page.tsx).
 */
export default function EditPet() {
    const { petId } = useParams();

    // TODO: swap for GET /pets/:pid once that route exists. While the lookup is
    // synchronous there is no loading state to render.
    const pet = getMockEditPet(petId);

    // A hand-typed or stale URL shouldn't strand the user on an empty form.
    if (!pet) return <Navigate to="/profile" replace />;

    // Keyed so navigating straight from one pet's edit page to another's
    // rebuilds the draft rather than keeping the first pet's values.
    return <EditPetForm key={petId} initialDraft={pet} />;
}

function EditPetForm({ initialDraft }: { initialDraft: EditPetDraft }) {
    const navigate = useNavigate();

    const [draft, setDraft] = useState<EditPetDraft>(initialDraft);
    const [formError, setFormError] = useState("");

    // The breed/color vocabularies are real even though the pet itself is not —
    // /pets/breeds and /pets/breed/color both exist.
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
        // TODO: PUT /pets/:pid once the route exists. Photos will need splitting
        // first — the `string` entries are already on the server and only the
        // `File` ones get re-uploaded. Until then the edits are simply dropped.
        navigate("/profile");
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
                        onClick={handleSave}
                    />
                </Flex>
            </Box>
        </Box>
    );
}
