import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";

import { S2SButton, S2SPageTitle, S2SStepper } from "../components/S2S.components";
import {
    useBreeds,
    useBreedImages,
    usePetColors,
    usePetInfo,
    useSaveScreeningQuestions,
    useScreeningQuestions,
    useUpdatePet,
} from "../hooks/query/pet.query";

import PhotoPicker from "../components/rehome/photoPicker.component";
import Step3Details from "../components/rehome/step3Details.component";
import Step4ScreeningQuestions from "../components/rehome/step4ScreeningQuestions.component";
import { splitAddress } from "../utils/address.util";
import { uploadStagedScreeningImages } from "../utils/screeningImages.util";
import { petDetailsMissingLabels, petDetailsSchema } from "../validators/pet.validator";
import { screeningQuestionsError } from "../validators/screeningQuestions.validator";
import type { EditPetDraft, PetType } from "../types/rehome.type";
import type { CustomScreeningQuestion, CustomScreeningQuestionDraft } from "../types/profile.type";
import type { PetInfoResponse } from "../services/apis/pet.api";

// Same steps as Register a Pet; editing starts at step 2 because the species can't change
const STEPS = ["Select Species", "Upload Photos", "Fill in Details", "Screening Questions"];
const FIRST_EDIT_STEP = 2;

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

function toQuestionDrafts(questions: CustomScreeningQuestion[]): CustomScreeningQuestionDraft[] {
    return questions.map((q) => ({
        questionType: q.questionType,
        questionText: q.questionText,
        questionOptions: q.questionOptions ?? [],
        questionRequired: q.questionRequired,
        questionOrder: q.questionOrder,
    }));
}

export default function EditPet() {
    const { petId } = useParams();
    const { pet, isLoading, isError } = usePetInfo(petId);
    const { questions, locked, isLoading: questionsLoading } = useScreeningQuestions(petId);

    if (isLoading || questionsLoading) return <Box></Box>;

    if (isError || !pet) return <Navigate to="/profile" replace />;

    return (
        <EditPetForm
            key={petId}
            pid={pet.pid}
            initialDraft={toEditPetDraft(pet)}
            initialQuestions={toQuestionDrafts(questions)}
            questionsLocked={locked}
        />
    );
}

function EditPetForm({
    pid,
    initialDraft,
    initialQuestions,
    questionsLocked,
}: {
    pid: number;
    initialDraft: EditPetDraft;
    initialQuestions: CustomScreeningQuestionDraft[];
    questionsLocked: boolean;
}) {
    const navigate = useNavigate();

    const [step, setStep] = useState(FIRST_EDIT_STEP);
    const [draft, setDraft] = useState<EditPetDraft>(initialDraft);
    const [questions, setQuestions] = useState<CustomScreeningQuestionDraft[]>(initialQuestions);
    const [formError, setFormError] = useState("");
    const [isUploadingImages, setIsUploadingImages] = useState(false);
    const updatePetMutation = useUpdatePet();
    const saveScreeningQuestions = useSaveScreeningQuestions();

    const { breeds } = useBreeds(draft.petType);
    const { images: breedImages } = useBreedImages(draft.petType);
    const { colors } = usePetColors(draft.petType, draft.breed);

    const patchDraft = (patch: Partial<EditPetDraft>) =>
        setDraft((d) => ({ ...d, ...patch }));

    const canGoNext =
        step === 2 ? draft.photos.length > 0
            : step === 3 ? petDetailsSchema.safeParse(draft).success
                : true;

    const detailsError = () => {
        const parsed = petDetailsSchema.safeParse(draft);
        return parsed.success ? "" : `Please fill in: ${petDetailsMissingLabels(parsed.error).join(", ")}.`;
    };

    // Back to wherever the owner opened the editor from (pet profile or their profile list)
    const leave = () => navigate(-1);

    const handleSave = () => {
        const problem = detailsError() || (questionsLocked ? "" : screeningQuestionsError(questions));
        if (problem) {
            setFormError(problem);
            return;
        }

        setFormError("");
        updatePetMutation.mutate(
            { pid, draft },
            {
                onSuccess: () => {
                    if (questionsLocked) {
                        leave();
                        return;
                    }
                    // Image-question photos are only uploaded now, at save time
                    setIsUploadingImages(true);
                    uploadStagedScreeningImages(pid, questions)
                        .then((saved) =>
                            saveScreeningQuestions.mutate(
                                { pid, questions: saved },
                                {
                                    onSuccess: leave,
                                    onError: () =>
                                        setFormError("Pet details were saved, but the screening questions weren't. Please try again."),
                                },
                            ),
                        )
                        .catch(() => setFormError("Pet details were saved, but a question photo couldn't be uploaded. Please try again."))
                        .finally(() => setIsUploadingImages(false));
                },
                onError: () => setFormError("Failed to save changes. Please try again."),
            },
        );
    };

    const handleNext = () => {
        if (step === STEPS.length) {
            handleSave();
            return;
        }
        if (step === 3) {
            const problem = detailsError();
            if (problem) {
                setFormError(problem);
                return;
            }
        }
        setFormError("");
        setStep((s) => s + 1);
    };

    const handleBack = () => {
        setFormError("");
        if (step === FIRST_EDIT_STEP) leave();
        else setStep((s) => s - 1);
    };

    return (
        <Box width="100%" pb="64px" px={{ base: "24px", md: "9%" }}>
            <S2SPageTitle title="Edit Pet's Profile" />

            <Flex
                justify={{ base: "flex-start", md: "center" }}
                mt={{ base: "32px", md: "64px" }}
                overflowX="auto"
            >
                <S2SStepper steps={STEPS} current={step} />
            </Flex>

            {/* Figma: the details form (step 3) runs wider than the other steps */}
            <Box maxW={step === 3 ? "787px" : "736px"} mx="auto" mt={{ base: "40px", md: "80px" }}>
                {step === 2 && (
                    <PhotoPicker
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
                        questions={questions}
                        onChange={setQuestions}
                        locked={questionsLocked}
                    />
                )}

                {formError && (
                    <Text mt="16px" fontSize="14" color="red.500">
                        {formError}
                    </Text>
                )}

                <Flex justify="space-between" gap={4} mt={{ base: "48px", md: "80px" }}>
                    <S2SButton
                        text="Back"
                        variant="outline"
                        width={{ base: "106.94px", md: "120px" }}
                        height={{ base: "35.65px", md: "48px" }}
                        fontSize={{ base: "14", md: "20" }}
                        onClick={handleBack}
                    />
                    <S2SButton
                        text={step === STEPS.length ? "Finish" : "Next"}
                        width={{ base: "106.94px", md: "120px" }}
                        height={{ base: "35.65px", md: "48px" }}
                        fontSize={{ base: "14", md: "20" }}
                        disabled={!canGoNext}
                        loading={updatePetMutation.isPending || isUploadingImages || saveScreeningQuestions.isPending}
                        onClick={handleNext}
                    />
                </Flex>
            </Box>
        </Box>
    );
}
