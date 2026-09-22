import { useRef, useState } from "react";
import { Dialog, Flex, Image, Portal, RadioGroup, Text, VStack } from "@chakra-ui/react";

import { S2SButton, S2SCheckbox, S2SInput, S2SDialogCloseButton } from "../S2S.components";
import { SCREENING_SECTIONS } from "../../utils/screeningForm";
import type { ScreeningQuestion } from "../../utils/screeningForm";
import type { AdoptSubmission } from "../../services/apis/pet.api";
import { screeningAnswersSchema, screeningMissingNumbers } from "../../validators/screening.validator";
import { useScreeningQuestions, useUploadScreeningAnswerImage } from "../../hooks/query/pet.query";
import type { CustomScreeningQuestion } from "../../types/profile.type";

/** Draft value for one custom question — string for essay/multiple-choice/image, string[] for checklist. */
type CustomDraft = Record<number, string | string[]>;

function isAnswered(value: string | string[] | undefined): boolean {
    if (value === undefined) return false;
    return Array.isArray(value) ? value.length > 0 : value.trim().length > 0;
}

function CustomQuestionInput({
    pid,
    question,
    value,
    onChange,
}: {
    pid: string | number;
    question: CustomScreeningQuestion;
    value: string | string[] | undefined;
    onChange: (value: string | string[]) => void;
}) {
    const uploadImage = useUploadScreeningAnswerImage();
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (question.questionType === "ESSAY") {
        return (
            <S2SInput
                w="465px"
                maxW="100%"
                borderRadius="132px"
                placeholder="Type here.."
                value={typeof value === "string" ? value : ""}
                onChange={(e) => onChange(e.target.value)}
            />
        );
    }

    if (question.questionType === "MULTIPLE_CHOICE") {
        const selected = typeof value === "string" ? value : "";
        return (
            <RadioGroup.Root
                value={selected}
                onValueChange={(e) => onChange(e.value ?? "")}
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
                gap="10px"
            >
                {(question.questionOptions ?? []).map((option) => (
                    <RadioGroup.Item key={option} value={option} gap="15px" cursor="pointer">
                        <RadioGroup.ItemHiddenInput />
                        <RadioGroup.ItemIndicator
                            boxSize="20px"
                            borderWidth="1px"
                            borderColor="BlueText"
                            bg="transparent"
                            color="BlueText"
                            _checked={{ bg: "transparent", borderColor: "BlueText", color: "BlueText" }}
                        />
                        <RadioGroup.ItemText fontSize="16px" fontWeight="500" color="Grey">
                            {option}
                        </RadioGroup.ItemText>
                    </RadioGroup.Item>
                ))}
            </RadioGroup.Root>
        );
    }

    if (question.questionType === "CHECKLIST") {
        const selected = Array.isArray(value) ? value : [];
        const toggle = (option: string) =>
            onChange(
                selected.includes(option)
                    ? selected.filter((o) => o !== option)
                    : [...selected, option],
            );
        return (
            <VStack align="flex-start" gap="10px">
                {(question.questionOptions ?? []).map((option) => (
                    <S2SCheckbox
                        key={option}
                        label={option}
                        checked={selected.includes(option)}
                        onChange={() => toggle(option)}
                    />
                ))}
            </VStack>
        );
    }

    // IMAGE
    const imageUrl = typeof value === "string" ? value : "";
    return (
        <VStack align="stretch" gap="10px" w="100%">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    uploadImage.mutate(
                        { pid, file },
                        { onSuccess: (url) => onChange(url) },
                    );
                    e.target.value = "";
                }}
            />
            <S2SButton
                text={uploadImage.isPending ? "Uploading..." : imageUrl ? "Replace Image" : "Upload Image"}
                variant="outline"
                width="180px"
                height="40px"
                fontSize="14px"
                loading={uploadImage.isPending}
                onClick={() => fileInputRef.current?.click()}
            />
            {imageUrl && (
                <Image
                    src={imageUrl}
                    alt={question.questionText}
                    w="100%"
                    maxH="400px"
                    objectFit="cover"
                    borderRadius="12px"
                />
            )}
        </VStack>
    );
}

interface ScreeningDraft {
    Q1_1: boolean | null;
    Q1_2: boolean | null;
    Q1_3: string;
    Q2_1: string;
    Q2_2: boolean | null;
    Q2_3: boolean | null;
    Q3_1: string;
    Q3_2: boolean | null;
    Q3_3: string;
    Q4_1: number | null;
    Q5_1: number | null;
    Q6_1: number | null;
    Q6_2: number | null;
    Note: string;
}

const EMPTY_DRAFT: ScreeningDraft = {
    Q1_1: null,
    Q1_2: null,
    Q1_3: "",
    Q2_1: "",
    Q2_2: null,
    Q2_3: null,
    Q3_1: "",
    Q3_2: null,
    Q3_3: "",
    Q4_1: null,
    Q5_1: null,
    Q6_1: null,
    Q6_2: null,
    Note: "",
};

function toSubmission(draft: ScreeningDraft, customDraft: CustomDraft): AdoptSubmission {
    return {
        q1_1: draft.Q1_1 === true,
        q1_2: draft.Q1_2 === true,
        q1_3: draft.Q1_3.trim(),
        q2_1: draft.Q2_1,
        q2_2: draft.Q2_2 === true,
        q2_3: draft.Q2_3 === true,
        q3_1: Number(draft.Q3_1) || 0,
        q3_2: draft.Q3_2 === true,
        q3_3: draft.Q3_3.trim(),
        q4_1: draft.Q4_1 ?? 0,
        q5_1: draft.Q5_1 ?? 0,
        q6_1: draft.Q6_1 ?? 0,
        q6_2: draft.Q6_2 ?? 0,
        note: draft.Note.trim(),
        answers: Object.entries(customDraft)
            .filter(([, value]) => isAnswered(value))
            .map(([questionId, value]) => ({ questionId: Number(questionId), value })),
    };
}

function RadioOptionGroup({
    name,
    value,
    options,
    onValueChange,
    flexDirection = "row",
    justifyContent,
    gap = "15px",
    flexWrap,
    width,
}: {
    name: string;
    value: string;
    options: { value: string; label: string }[];
    onValueChange: (value: string) => void;
    flexDirection?: "row" | "column";
    justifyContent?: string;
    gap?: string;
    flexWrap?: "wrap" | "nowrap";
    width?: string;
}) {
    return (
        <RadioGroup.Root
            name={name}
            value={value}
            onValueChange={(e) => onValueChange(e.value ?? "")}
            display="flex"
            flexDirection={flexDirection}
            alignItems={flexDirection === "row" ? "center" : "flex-start"}
            justifyContent={justifyContent}
            gap={gap}
            flexWrap={flexWrap}
            width={width}
        >
            {options.map((option) => (
                <RadioGroup.Item key={option.value} value={option.value} gap="15px" cursor="pointer">
                    <RadioGroup.ItemHiddenInput />
                    <RadioGroup.ItemIndicator
                        boxSize="20px"
                        borderWidth="1px"
                        borderColor="BlueText"
                        bg="transparent"
                        color="BlueText"
                        _checked={{ bg: "transparent", borderColor: "BlueText", color: "BlueText" }}
                    />
                    <RadioGroup.ItemText fontSize="16px" fontWeight="500" color="Grey">
                        {option.label}
                    </RadioGroup.ItemText>
                </RadioGroup.Item>
            ))}
        </RadioGroup.Root>
    );
}

function QuestionInput({
    question,
    draft,
    onChange,
}: {
    question: ScreeningQuestion;
    draft: ScreeningDraft;
    onChange: (patch: Partial<ScreeningDraft>) => void;
}) {
    if (question.kind === "boolean") {
        const value = draft[question.id] as boolean | null;
        return (
            <RadioOptionGroup
                name={question.id}
                value={value === null ? "" : String(value)}
                options={[
                    { value: "true", label: "Yes" },
                    { value: "false", label: "No" },
                ]}
                onValueChange={(v) => onChange({ [question.id]: v === "true" })}
                justifyContent="space-between"
                width="180px"
            />
        );
    }

    if (question.kind === "text") {
        const value = draft[question.id] as string;
        return (
            <S2SInput
                w={question.number === "" ? "100%" : "465px"}
                maxW="100%"
                borderRadius="132px"
                placeholder="Type here.."
                value={value}
                onChange={(e) => onChange({ [question.id]: e.target.value })}
            />
        );
    }

    const isLabelStored = question.id === "Q2_1";
    const value = draft[question.id] as string | number | null;

    return (
        <RadioOptionGroup
            name={question.id}
            value={value === null ? "" : String(value)}
            options={question.options.map((option, index) => ({
                value: isLabelStored ? option : String(index),
                label: option,
            }))}
            onValueChange={(v) => onChange({ [question.id]: isLabelStored ? v : Number(v) })}
            flexDirection={question.layout === "stacked" ? "column" : "row"}
            gap={question.layout === "stacked" ? "10px" : "24px"}
            flexWrap="wrap"
            width="100%"
        />
    );
}

export default function AdoptScreeningForm({
    isOpen,
    pid,
    petName,
    isSubmitting,
    serverError,
    onClose,
    onSubmit,
}: {
    isOpen: boolean;
    pid: string | number;
    petName: string;
    isSubmitting: boolean;
    serverError?: string;
    onClose: () => void;
    onSubmit: (answers: AdoptSubmission) => void;
}) {
    const [draft, setDraft] = useState<ScreeningDraft>(EMPTY_DRAFT);
    const [customDraft, setCustomDraft] = useState<CustomDraft>({});
    const [formError, setFormError] = useState("");
    const { questions: customQuestions } = useScreeningQuestions(isOpen ? pid : undefined);

    const patchDraft = (patch: Partial<ScreeningDraft>) =>
        setDraft((d) => ({ ...d, ...patch }));

    const patchCustomDraft = (questionId: number, value: string | string[]) =>
        setCustomDraft((d) => ({ ...d, [questionId]: value }));

    const handleSubmit = () => {
        const parsed = screeningAnswersSchema.safeParse(draft);
        if (!parsed.success) {
            setFormError(`Please answer: ${screeningMissingNumbers(parsed.error).join(", ")}.`);
            return;
        }

        const missingCustom = customQuestions.filter(
            (q) => q.questionRequired && !isAnswered(customDraft[q.questionId]),
        );
        if (missingCustom.length > 0) {
            setFormError(
                `Please answer: ${missingCustom.map((q) => q.questionText).join(", ")}.`,
            );
            return;
        }

        setFormError("");
        onSubmit(toSubmission(draft, customDraft));
    };

    const handleClose = () => {
        setDraft(EMPTY_DRAFT);
        setCustomDraft({});
        setFormError("");
        onClose();
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && handleClose()} placement="center">
            <Portal>
                <Dialog.Backdrop bg="blackAlpha.400" />
                <Dialog.Positioner>
                    <Dialog.Content
                        maxW="915px"
                        borderRadius="50px"
                        p="0"
                        position="relative"
                        boxShadow="0px 3.37px 16.84px rgba(201,220,225,0.20)"
                    >
                        <S2SDialogCloseButton onClick={handleClose} zIndex={1} />

                        <VStack pt="53px" pb="40px" px={{ base: "24px", md: "54px" }} gap="30px" align="stretch">
                            <VStack gap="12px" maxW="626px" alignSelf="center">
                                <Text fontSize="24px" fontWeight="600" color="Grey" textAlign="center">
                                    Adoption Screening Form
                                </Text>
                                <Text fontSize="16px" fontWeight="500" color="GreyText" textAlign="center">
                                    Your responses will be shared with {petName}&apos;s current owner/finder to
                                    assist in the adoption approval process.
                                </Text>
                            </VStack>

                            <VStack align="stretch" gap="30px" maxH="55vh" overflowY="auto" pr="8px" pb="10px">
                                {SCREENING_SECTIONS.map((section) => (
                                    <VStack key={section.title} align="stretch" gap="20px">
                                        <Text fontSize="16px" color="black">
                                            {section.title}
                                        </Text>
                                        <VStack align="stretch" gap="25px" px="25px">
                                            {section.questions.map((question) => (
                                                <VStack key={question.id} align="flex-start" gap="12px">
                                                    {question.text && (
                                                        <Text fontSize="16px" color="black">
                                                            {question.number} {question.text}
                                                        </Text>
                                                    )}
                                                    <QuestionInput
                                                        question={question}
                                                        draft={draft}
                                                        onChange={patchDraft}
                                                    />
                                                </VStack>
                                            ))}
                                        </VStack>
                                    </VStack>
                                ))}

                                {customQuestions.length > 0 && (
                                    <VStack align="stretch" gap="20px">
                                        <Text fontSize="16px" color="black">
                                            Additional Questions
                                        </Text>
                                        <VStack align="stretch" gap="25px" px="25px">
                                            {customQuestions.map((question) => (
                                                <VStack key={question.questionId} align="flex-start" gap="12px">
                                                    <Text fontSize="16px" color="black">
                                                        {question.questionText}
                                                        {!question.questionRequired && " (optional)"}
                                                    </Text>
                                                    <CustomQuestionInput
                                                        pid={pid}
                                                        question={question}
                                                        value={customDraft[question.questionId]}
                                                        onChange={(value) =>
                                                            patchCustomDraft(question.questionId, value)
                                                        }
                                                    />
                                                </VStack>
                                            ))}
                                        </VStack>
                                    </VStack>
                                )}
                            </VStack>

                            {(formError || serverError) && (
                                <Text fontSize="14px" color="red.500" textAlign="center">
                                    {formError || serverError}
                                </Text>
                            )}

                            <Flex justify="center">
                                <S2SButton
                                    text="Submit"
                                    width="185px"
                                    height="51px"
                                    fontSize="20px"
                                    loading={isSubmitting}
                                    onClick={handleSubmit}
                                />
                            </Flex>
                        </VStack>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}
