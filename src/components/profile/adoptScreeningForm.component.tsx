import { useState } from "react";
import { Dialog, Flex, Portal, RadioGroup, Text, VStack } from "@chakra-ui/react";

import { S2SButton, S2SInput, S2SDialogCloseButton } from "../S2S.components";
import { SCREENING_SECTIONS } from "../../utils/screeningForm";
import type { ScreeningQuestion } from "../../utils/screeningForm";
import type { AdoptSubmission } from "../../services/apis/pet.api";

/**
 * Same shape as ScreeningAnswers, but every question starts unanswered —
 * nullable booleans/indexes distinguish "hasn't answered yet" from a real
 * "No" or a real first option, neither of which should count as blank.
 */
interface ScreeningDraft {
    Q1_1: boolean | null;
    Q1_2: boolean | null;
    Q1_3: string;
    /** Stores the option label itself, not an index — matches ScreeningAnswers.Q2_1. */
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

/** Every required question ("Other Notes" aside) still left blank, by number — e.g. ["1.1", "2.2"]. */
function missingQuestions(draft: ScreeningDraft): string[] {
    const missing: string[] = [];

    for (const section of SCREENING_SECTIONS) {
        for (const question of section.questions) {
            if (question.id === "Note") continue; // optional

            const value = draft[question.id];
            const isBlank =
                question.kind === "boolean"
                    ? value === null
                    : question.id === "Q2_1"
                        ? value === ""
                        : question.kind === "choice"
                            ? value === null
                            : typeof value === "string" && value.trim() === "";

            if (isBlank) missing.push(question.number);
        }
    }

    return missing;
}

function toSubmission(draft: ScreeningDraft): AdoptSubmission {
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
    };
}

/**
 * One radio-group's worth of options, styled to match the design's 20px
 * outlined circle + 12.73px filled dot. Built on Chakra's RadioGroup (real
 * <input type="radio"> + arrow-key navigation + ARIA), unlike the old
 * hand-rolled Flex-as-button + Circle pair it replaces — the input equivalent
 * of ScreeningAnswersModal's read-only AnswerRadio.
 */
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
                    {/* ItemIndicator draws both the ring and the checked-state
                        dot itself (the dot is `bg: currentColor`, so setting
                        `color` here is what makes it BlueText). Chakra's
                        default recipe otherwise fills the whole ring on
                        checked — overridden below so only the dot shows it. */}
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

    // "choice": Q2_1 stores the label itself, every other choice question stores a 0-based index.
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
    petName,
    isSubmitting,
    serverError,
    onClose,
    onSubmit,
}: {
    isOpen: boolean;
    petName: string;
    isSubmitting: boolean;
    /** Set by the caller when a submit attempt fails server-side (e.g. already-pending, no longer available). */
    serverError?: string;
    onClose: () => void;
    onSubmit: (answers: AdoptSubmission) => void;
}) {
    const [draft, setDraft] = useState<ScreeningDraft>(EMPTY_DRAFT);
    const [formError, setFormError] = useState("");

    const patchDraft = (patch: Partial<ScreeningDraft>) =>
        setDraft((d) => ({ ...d, ...patch }));

    const handleSubmit = () => {
        const missing = missingQuestions(draft);
        if (missing.length > 0) {
            setFormError(`Please answer: ${missing.join(", ")}.`);
            return;
        }
        setFormError("");
        onSubmit(toSubmission(draft));
    };

    const handleClose = () => {
        setDraft(EMPTY_DRAFT);
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
