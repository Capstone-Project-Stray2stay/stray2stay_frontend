import { useState } from "react";
import { Dialog, Flex, Grid, Image, Input, Portal, RadioGroup, Text, VStack } from "@chakra-ui/react";

import { S2SButton, S2SCheckbox, S2SInput, S2SDialogCloseButton } from "../S2S.components";
import { SCREENING_SECTIONS } from "../../utils/screeningForm";
import type { ScreeningQuestion } from "../../utils/screeningForm";
import type { AdoptSubmission } from "../../services/apis/pet.api";
import { screeningAnswersSchema, screeningMissingNumbers } from "../../validators/screening.validator";
import { useScreeningQuestions } from "../../hooks/query/pet.query";
import {
    OTHER_ANSWER_PREFIX,
    OTHER_OPTION,
    type CustomScreeningQuestion,
    type CustomScreeningQuestionDraft,
} from "../../types/profile.type";

/** Draft value for one custom question — string for essay/multiple-choice, string[] for checklist. IMAGE questions take no answer. */
type CustomDraft = Record<number, string | string[]>;

// Figma text field: 36px pill, frosted white, BlueText outline
const TEXT_FIELD_PROPS = {
    h: "36px",
    px: "20px",
    bg: "rgba(255, 255, 255, 0.70)",
    borderRadius: "132px",
    fontSize: "16",
    _placeholder: { color: "GreyText" },
} as const;

/** An "Other: " entry with nothing typed after it doesn't count as an answer. */
function isFilled(entry: string): boolean {
    const text = entry.trim();
    return text !== "" && text !== OTHER_ANSWER_PREFIX.trim();
}

function isAnswered(value: string | string[] | undefined): boolean {
    if (value === undefined) return false;
    return Array.isArray(value) ? value.some(isFilled) : isFilled(value);
}

/** Drops empty "Other" entries so they are never submitted. */
function cleanAnswer(value: string | string[]): string | string[] {
    return Array.isArray(value) ? value.filter(isFilled) : value.trim();
}

// Figma "Other:" field: just an underline that runs to the end of the row
function OtherTextInput({ value, onFocus, onChange }: { value: string; onFocus: () => void; onChange: (text: string) => void }) {
    return (
        <Input
            flex="1"
            minW={0}
            h="28px"
            px="4px"
            border="none"
            borderBottom="1px solid"
            borderColor="BlueText"
            borderRadius="0"
            bg="transparent"
            fontSize="16"
            color="Grey"
            _focusVisible={{ outline: "none", borderColor: "Blue" }}
            value={value}
            onFocus={onFocus}
            onChange={(e) => onChange(e.target.value)}
        />
    );
}

function CustomQuestionInput({
    question,
    value,
    onChange,
}: {
    question: CustomScreeningQuestion;
    value: string | string[] | undefined;
    onChange: (value: string | string[]) => void;
}) {
    const options = question.questionOptions ?? [];
    const hasOther = options.includes(OTHER_OPTION);
    const choices = options.filter((option) => option !== OTHER_OPTION);

    if (question.questionType === "ESSAY") {
        return (
            <S2SInput
                {...TEXT_FIELD_PROPS}
                w="465px"
                maxW="100%"
                placeholder="Type here.."
                value={typeof value === "string" ? value : ""}
                onChange={(e) => onChange(e.target.value)}
            />
        );
    }

    if (question.questionType === "MULTIPLE_CHOICE") {
        const raw = typeof value === "string" ? value : "";
        const isOther = raw.startsWith(OTHER_ANSWER_PREFIX);
        const otherText = isOther ? raw.slice(OTHER_ANSWER_PREFIX.length) : "";
        const radioItem = (itemValue: string, label: string) => (
            <RadioGroup.Item key={itemValue} value={itemValue} gap="15px" cursor="pointer" flexShrink={0}>
                <RadioGroup.ItemHiddenInput />
                <RadioGroup.ItemIndicator
                    boxSize="20px"
                    borderWidth="1px"
                    borderColor="BlueText"
                    bg="transparent"
                    color="BlueText"
                    _checked={{ bg: "transparent", borderColor: "BlueText", color: "BlueText" }}
                />
                <RadioGroup.ItemText fontSize="16" fontWeight="400" color="Grey">
                    {label}
                </RadioGroup.ItemText>
            </RadioGroup.Item>
        );
        return (
            <RadioGroup.Root
                value={isOther ? OTHER_OPTION : raw}
                onValueChange={(e) =>
                    onChange(e.value === OTHER_OPTION ? OTHER_ANSWER_PREFIX + otherText : e.value ?? "")
                }
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
                gap="8px"
                w="100%"
            >
                {choices.map((option) => radioItem(option, option))}
                {hasOther && (
                    <Flex align="center" gap="8px" w="100%">
                        {radioItem(OTHER_OPTION, "Other:")}
                        <OtherTextInput
                            value={otherText}
                            onFocus={() => !isOther && onChange(OTHER_ANSWER_PREFIX)}
                            onChange={(text) => onChange(OTHER_ANSWER_PREFIX + text)}
                        />
                    </Flex>
                )}
            </RadioGroup.Root>
        );
    }

    if (question.questionType === "CHECKLIST") {
        const selected = Array.isArray(value) ? value : [];
        const otherEntry = selected.find((s) => s.startsWith(OTHER_ANSWER_PREFIX));
        const withoutOther = selected.filter((s) => s !== otherEntry);
        const toggle = (option: string) =>
            onChange(
                selected.includes(option)
                    ? selected.filter((o) => o !== option)
                    : [...selected, option],
            );
        const setOther = (text: string | null) =>
            onChange(text === null ? withoutOther : [...withoutOther, OTHER_ANSWER_PREFIX + text]);
        return (
            <VStack align="stretch" gap="8px" w="100%">
                {choices.map((option) => (
                    <S2SCheckbox
                        key={option}
                        label={option}
                        checked={selected.includes(option)}
                        onChange={() => toggle(option)}
                    />
                ))}
                {hasOther && (
                    <Flex align="center" gap="8px" w="100%">
                        <S2SCheckbox
                            label="Other:"
                            checked={otherEntry !== undefined}
                            onChange={(checked) => setOther(checked ? "" : null)}
                        />
                        <OtherTextInput
                            value={otherEntry ? otherEntry.slice(OTHER_ANSWER_PREFIX.length) : ""}
                            onFocus={() => otherEntry === undefined && setOther("")}
                            onChange={setOther}
                        />
                    </Flex>
                )}
            </VStack>
        );
    }

    // IMAGE: the owner's photos, shown for context only — nothing to answer
    if (choices.length === 0) return null;
    return (
        <Grid
            w="100%"
            gap="10px"
            templateColumns={{
                base: "1fr",
                md: choices.length === 1 ? "1fr" : choices.length === 2 ? "1fr 2fr" : "repeat(3, 1fr)",
            }}
        >
            {choices.map((url, i) => (
                <Image
                    key={url}
                    src={url}
                    alt={`${question.questionText || "Owner photo"} ${i + 1}`}
                    w="100%"
                    h={{ base: "220px", md: "320px" }}
                    objectFit="cover"
                    bg="#E9E9E9"
                />
            ))}
        </Grid>
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
            .map(([questionId, value]) => ({ questionId: Number(questionId), value: cleanAnswer(value) })),
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
                    <RadioGroup.ItemText fontSize="16" fontWeight="400" color="Grey">
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
                {...TEXT_FIELD_PROPS}
                w={question.number === "" ? "100%" : "465px"}
                maxW="100%"
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
            gap={question.layout === "stacked" ? "8px" : "24px"}
            // Figma: inline options spread across a 603px row
            justifyContent={question.layout === "stacked" ? undefined : "space-between"}
            flexWrap="wrap"
            width={question.layout === "stacked" ? "100%" : "min(603px, 100%)"}
        />
    );
}

export default function AdoptScreeningForm({
    isOpen,
    pid,
    petName,
    isSubmitting = false,
    serverError,
    onClose,
    onSubmit,
    preview = false,
    previewQuestions,
}: {
    isOpen: boolean;
    pid?: string | number;
    petName: string;
    isSubmitting?: boolean;
    serverError?: string;
    onClose: () => void;
    onSubmit?: (answers: AdoptSubmission) => void;
    /** Preview mode (owner checking what adopters see): no Submit button. */
    preview?: boolean;
    /** Unsaved questions to preview instead of the pet's saved ones (Register a Pet, step 4). Implies preview. */
    previewQuestions?: CustomScreeningQuestionDraft[];
}) {
    const [draft, setDraft] = useState<ScreeningDraft>(EMPTY_DRAFT);
    const [customDraft, setCustomDraft] = useState<CustomDraft>({});
    const [formError, setFormError] = useState("");
    const isPreview = preview || previewQuestions !== undefined;
    const { questions: savedQuestions } = useScreeningQuestions(
        isOpen && previewQuestions === undefined ? pid : undefined,
    );
    // Drafts have no id yet, so their position stands in for one
    const customQuestions: CustomScreeningQuestion[] = previewQuestions
        ? previewQuestions.map((q, i) => ({ ...q, questionId: i }))
        : savedQuestions;
    // IMAGE questions only show the owner's photos, so they get no number
    const answerableNumbers = new Map<number, number>();
    customQuestions
        .filter((q) => q.questionType !== "IMAGE")
        .forEach((q, i) => answerableNumbers.set(q.questionId, i + 1));

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
            (q) => q.questionType !== "IMAGE" && q.questionRequired && !isAnswered(customDraft[q.questionId]),
        );
        if (missingCustom.length > 0) {
            setFormError(
                `Please answer: ${missingCustom.map((q) => q.questionText).join(", ")}.`,
            );
            return;
        }

        setFormError("");
        onSubmit?.(toSubmission(draft, customDraft));
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
                        maxW="800px"
                        borderRadius="24px"
                        p="0"
                        position="relative"
                        boxShadow="0px 3.37px 16.84px rgba(201,220,225,0.20)"
                    >
                        <S2SDialogCloseButton onClick={handleClose} top="32px" right="32px" boxSize="28px" iconBoxSize="14px" zIndex={1} />

                        <VStack py="32px" px={{ base: "24px", md: "32px" }} gap="24px" align="stretch">
                            <VStack gap="8px" maxW="626px" alignSelf="center" px={{ base: "28px", md: 0 }}>
                                <Text fontSize="24" fontWeight="600" color="Grey" textAlign="center">
                                    Adoption Screening Form
                                </Text>
                                <Text fontSize="16" fontWeight="400" color="Grey" textAlign="center">
                                    Your responses will be shared with {petName}&apos;s current owner/finder to
                                    assist in the adoption approval process.
                                </Text>
                            </VStack>

                            <VStack align="stretch" gap="16px" maxH="55vh" overflowY="auto" pr="8px" pb="10px">
                                {SCREENING_SECTIONS.map((section, sectionIndex) => (
                                    <VStack key={section.title} align="stretch" gap="12px">
                                        <Text fontSize="16" fontWeight="400" color="Grey">
                                            {/* Other Notes (the last, unnumbered section) has no number */}
                                            {section.questions.some((q) => q.number !== "") && `${sectionIndex + 1}. `}
                                            {section.title}
                                        </Text>
                                        {/* Figma: numbered questions are indented 24px; the bare Other Notes field is not */}
                                        <VStack
                                            align="stretch"
                                            gap="12px"
                                            px={section.questions.every((q) => q.number === "") ? 0 : "24px"}
                                        >
                                            {section.questions.map((question) => (
                                                <VStack key={question.id} align="flex-start" gap="8px">
                                                    {question.text && (
                                                        <Text fontSize="16" fontWeight="400" color="Grey">
                                                            {question.number} {question.text}{" "}
                                                            <Text as="span" color="#FF5151">*</Text>
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
                                    <VStack align="stretch" gap="12px">
                                        <Text fontSize="16" fontWeight="500" color="BlueText" textDecoration="underline">
                                            Owner&apos;s Additional Questions
                                        </Text>
                                        <VStack align="stretch" gap="12px" px="24px">
                                            {customQuestions.map((question) => (
                                                <VStack key={question.questionId} align="flex-start" gap="8px">
                                                    {question.questionType === "IMAGE" ? (
                                                        question.questionText && (
                                                            <Text fontSize="16" fontWeight="400" color="Grey">
                                                                {question.questionText}
                                                            </Text>
                                                        )
                                                    ) : (
                                                        <Text fontSize="16" fontWeight="400" color="Grey">
                                                            {answerableNumbers.get(question.questionId)}. {question.questionText}
                                                            {question.questionRequired
                                                                ? <>{" "}<Text as="span" color="#FF5151">*</Text></>
                                                                : " (optional)"}
                                                        </Text>
                                                    )}
                                                    <CustomQuestionInput
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

                            {!isPreview && (formError || serverError) && (
                                <Text fontSize="14" color="red.500" textAlign="center">
                                    {formError || serverError}
                                </Text>
                            )}

                            {!isPreview && (
                                <Flex justify="center">
                                    <S2SButton
                                        text="Submit"
                                        size="lg"
                                        loading={isSubmitting}
                                        onClick={handleSubmit}
                                    />
                                </Flex>
                            )}
                        </VStack>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}
