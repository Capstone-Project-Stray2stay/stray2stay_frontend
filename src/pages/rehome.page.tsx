import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import { isAxiosError } from "axios";

import { S2SPageTitle, S2SStepper, S2SButton } from "../components/S2S.components";
import {
    useBreeds,
    useBreedImages,
    useClassifyPet,
    usePetColors,
    useRegisterPet,
    useSaveScreeningQuestions,
} from "../hooks/query/pet.query";

import Step1Species from "../components/rehome/step1Species.component";
import Step2Photos from "../components/rehome/step2Photos.component";
import Step3Details from "../components/rehome/step3Details.component";
import Step4ScreeningQuestions from "../components/rehome/step4ScreeningQuestions.component";
import SelectAiPhotosModal from "../components/rehome/selectAiPhotosModal.component";
import { emptyRehomeDraft, MAX_AI_PHOTOS, type RehomeDraft } from "../types/rehome.type";
import { petDetailsMissingLabels, petDetailsSchema } from "../validators/pet.validator";

const STEPS = ["Select Species", "Upload Photos", "Fill in Details", "Screening Questions"];

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
    const saveScreeningQuestions = useSaveScreeningQuestions();

    const { breeds } = useBreeds(draft.petType);
    const { images: breedImages } = useBreedImages(draft.petType);
    const { colors } = usePetColors(draft.petType, draft.breed);

    const patchDraft = (patch: Partial<RehomeDraft>) =>
        setDraft((d) => ({ ...d, ...patch }));

    const canGoNext =
        step === 1 ? draft.petType !== null
            : step === 2 ? draft.photos.length > 0
                : step === 3 ? petDetailsSchema.safeParse(draft).success
                    : true;

    const finishRegistration = () => {
        setDraft(emptyRehomeDraft);
        navigate("/adopt");
    };

    const goNext = () => setStep((s) => Math.min(s + 1, STEPS.length));

    const prefillBreed = (detectedBreed: string | null) => {
        if (!detectedBreed) return "";
        return breeds.find((b) => b.toLowerCase() === detectedBreed.toLowerCase()) ?? "";
    };

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
        const parsed = petDetailsSchema.safeParse(draft);
        if (!parsed.success) {
            setFormError(`Please fill in: ${petDetailsMissingLabels(parsed.error).join(", ")}.`);
            return;
        }

        setFormError("");
        // The step-2 "couldn't detect the breed" hint is stale by now — the
        // user has been through the breed field.
        setClassifyError("");
        register.mutate(draft, {
            onSuccess: (newPid) => {
                if (draft.customQuestions.length === 0) {
                    finishRegistration();
                    return;
                }
                // The pet is already created at this point — a failure here
                // shouldn't block navigation; the owner can still add
                // questions later from the pet's profile page.
                saveScreeningQuestions.mutate(
                    { pid: newPid, questions: draft.customQuestions },
                    { onSuccess: finishRegistration, onError: finishRegistration },
                );
            },
            // Unlike step 2's classify, a failed submit must not advance —
            // keep the user here with their input intact.
            onError: (error) => {
                setFormError(`Couldn't register the pet: ${serverMessage(error)}`);
            },
        });
    };

    const handleNext = () => {
        if (step === STEPS.length) {
            handleSubmit();
            return;
        }

        if (step === 3) {
            const parsed = petDetailsSchema.safeParse(draft);
            if (!parsed.success) {
                setFormError(`Please fill in: ${petDetailsMissingLabels(parsed.error).join(", ")}.`);
                return;
            }
            setFormError("");
            goNext();
            return;
        }

        if (step !== 2) {
            goNext();
            return;
        }

        if (draft.photos.length > MAX_AI_PHOTOS) {
            setIsPhotoModalOpen(true);
            return;
        }

        runClassifyAndAdvance(draft.photos);
    };

    return (
        <Box width="100%" pb="64px" px={{ base: "24px", md: "9%" }}>
            <S2SPageTitle title="Register a Pet" />

            <Flex
                justify={{ base: "flex-start", md: "center" }}
                mt={{ base: "32px", md: "64px" }}
                overflowX="auto"
            >
                <S2SStepper steps={STEPS} current={step} />
            </Flex>

            <Box maxW="736px" mx="auto" mt={{ base: "40px", md: "80px" }}>
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
                        breedImages={breedImages}
                        colors={colors}
                        onChange={patchDraft}
                    />
                )}
                {step === 4 && (
                    <Step4ScreeningQuestions
                        questions={draft.customQuestions}
                        onChange={(customQuestions) => patchDraft({ customQuestions })}
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

                <Flex justify="space-between" gap={4} mt={{ base: "48px", md: "80px" }}>
                    {step > 1 ? (
                        <S2SButton
                            text="Back"
                            variant="outline"
                            width={{ base: "106.94px", md: "134.39px" }}
                            height={{ base: "35.65px", md: "44.80px" }}
                            fontSize={{ base: "14.32px", md: "20px" }}
                            onClick={() => setStep((s) => s - 1)}
                        />
                    ) : (
                        <Box />
                    )}
                    <S2SButton
                        text={step === STEPS.length ? "Finish" : "Next"}
                        width={{ base: "106.94px", md: "134.39px" }}
                        height={{ base: "35.65px", md: "44.80px" }}
                        fontSize={{ base: "14.32px", md: "20px" }}
                        disabled={!canGoNext}
                        loading={classify.isPending || register.isPending || saveScreeningQuestions.isPending}
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
