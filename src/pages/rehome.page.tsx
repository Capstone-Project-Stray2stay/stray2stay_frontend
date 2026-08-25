import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import { isAxiosError } from "axios";

import { S2SPageTitle, S2SStepper, S2SButton } from "../components/S2S.components";
import { useBreeds, useClassifyPet, usePetColors, useRegisterPet } from "../hooks/query/pet.query";

import Step1Species from "./rehome/step1Species.component";
import Step2Photos from "./rehome/step2Photos.component";
import Step3Details from "./rehome/step3Details.component";
import SelectAiPhotosModal from "./rehome/selectAiPhotosModal.component";
import { emptyRehomeDraft, MAX_AI_PHOTOS, type RehomeDraft } from "./rehome/rehome.type";
import { missingFields } from "./rehome/validation";

const STEPS = ["Select Species", "Upload Photos", "Fill in Details"];

/**
 * Pull the server's own message out of a failed request. The pet handlers
 * answer with { error } or { message }, and showing that beats a generic
 * "try again" — without it a rejected payload is undiagnosable from the UI.
 */
function serverMessage(error: unknown): string {
    if (isAxiosError(error)) {
        const data = error.response?.data as { error?: string; message?: string } | undefined;
        return data?.error ?? data?.message ?? error.message;
    }
    return error instanceof Error ? error.message : "Unknown error";
}

export default function Rehome() {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [draft, setDraft] = useState<RehomeDraft>(emptyRehomeDraft);
    const [classifyError, setClassifyError] = useState("");
    const [formError, setFormError] = useState("");
    const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

    const classify = useClassifyPet();
    const register = useRegisterPet();

    const { breeds } = useBreeds(draft.petType);
    const { colors } = usePetColors(draft.petType, draft.breed);

    const patchDraft = (patch: Partial<RehomeDraft>) =>
        setDraft((d) => ({ ...d, ...patch }));

    const canGoNext =
        step === 1 ? draft.petType !== null
            : step === 2 ? draft.photos.length > 0
                : true;

    const goNext = () => setStep((s) => Math.min(s + 1, STEPS.length));

    /**
     * Match the AI's label (Title Case, e.g. "Golden Retriever") against the
     * breed list from Mongo. Falls back to unselected when there is no
     * counterpart rather than sending a breed the backend won't recognise.
     */
    const prefillBreed = (detectedBreed: string | null) => {
        if (!detectedBreed) return "";
        return breeds.find((b) => b.toLowerCase() === detectedBreed.toLowerCase()) ?? "";
    };

    // Shared by both the direct (<=2 photos) and modal-confirmed (>2 photos)
    // paths, so the "advance even on failure" rule only has to be written once.
    const runClassifyAndAdvance = (images: File[]) => {
        if (draft.petType === null) {
            goNext();
            return;
        }

        setClassifyError("");
        classify.mutate(
            { petType: draft.petType, images },
            {
                onSuccess: (breed) => {
                    patchDraft({
                        aiPhotos: images,
                        detectedBreed: breed,
                        breed: prefillBreed(breed),
                    });
                    setIsPhotoModalOpen(false);
                    goNext();
                },
                // A failed detection must not trap the user on this step — the
                // breed can still be picked by hand in step 3. Note that dog
                // classification fails every time until the AI service's
                // dog_router.py is finished.
                onError: () => {
                    setClassifyError(
                        "Couldn't detect the breed — you can pick it manually in the next step.",
                    );
                    patchDraft({ aiPhotos: images, detectedBreed: null });
                    setIsPhotoModalOpen(false);
                    goNext();
                },
            },
        );
    };

    const handleSubmit = () => {
        const missing = missingFields(draft);
        if (missing.length > 0) {
            setFormError(`Please fill in: ${missing.join(", ")}.`);
            return;
        }

        setFormError("");
        // The step-2 "couldn't detect the breed" hint is stale by now — the
        // user has been through the breed field.
        setClassifyError("");
        register.mutate(draft, {
            onSuccess: () => {
                setDraft(emptyRehomeDraft);
                navigate("/adopt");
            },
            // Unlike step 2's classify, a failed submit must not advance —
            // keep the user here with their input intact.
            onError: (error) => {
                setFormError(`Couldn't register the pet: ${serverMessage(error)}`);
            },
        });
    };

    const handleNext = () => {
        if (step === 3) {
            handleSubmit();
            return;
        }

        if (step !== 2) {
            goNext();
            return;
        }

        // With more candidates than the AI accepts, let the user pick which
        // ones to send instead of silently taking the first two.
        if (draft.photos.length > MAX_AI_PHOTOS) {
            setIsPhotoModalOpen(true);
            return;
        }

        runClassifyAndAdvance(draft.photos);
    };

    return (
        <Box width={{ base: "100%", md: "80vw" }}>
            <S2SPageTitle title="Register a Pet" />

            <Flex justify="center" mt="64px" overflowX="auto">
                <S2SStepper steps={STEPS} current={step} />
            </Flex>

            <Box maxW="736px" mx="auto" mt="80px">
                {step === 1 && (
                    <Step1Species
                        value={draft.petType}
                        onChange={(petType) => patchDraft({ petType })}
                    />
                )}
                {step === 2 && (
                    <Step2Photos
                        photos={draft.photos}
                        onChange={(photos) => patchDraft({ photos })}
                    />
                )}
                {step === 3 && (
                    <Step3Details
                        draft={draft}
                        breeds={breeds}
                        colors={colors}
                        onChange={patchDraft}
                    />
                )}

                {classifyError && (
                    <Text mt="16px" fontSize="14px" color="red.500">
                        {classifyError}
                    </Text>
                )}
                {formError && (
                    <Text mt="16px" fontSize="14px" color="red.500">
                        {formError}
                    </Text>
                )}

                {/* Back and Next share one space-between row; Back is absent on the
                    first step, matching the design's hidden Back button there. */}
                <Flex justify="space-between" gap={4} mt="80px">
                    {step > 1 ? (
                        <S2SButton
                            text="Back"
                            variant="outline"
                            width="134.39px"
                            height="44.80px"
                            fontSize="20px"
                            onClick={() => setStep((s) => s - 1)}
                        />
                    ) : (
                        <Box />
                    )}
                    <S2SButton
                        text="Next"
                        width="134.39px"
                        height="44.80px"
                        fontSize="20px"
                        disabled={!canGoNext}
                        loading={classify.isPending || register.isPending}
                        onClick={handleNext}
                    />
                </Flex>
            </Box>

            <SelectAiPhotosModal
                isOpen={isPhotoModalOpen}
                photos={draft.photos}
                isSubmitting={classify.isPending}
                onClose={() => setIsPhotoModalOpen(false)}
                onConfirm={runClassifyAndAdvance}
            />
        </Box>
    );
}
