import { useState } from "react";
import {
    Box,
    Circle,
    Dialog,
    Flex,
    Icon,
    IconButton,
    Input,
    Portal,
    Text,
    VStack,
} from "@chakra-ui/react";
import { IoClose } from "react-icons/io5";

import { S2SButton } from "../../components/S2S.components";
import { SCREENING_SECTIONS } from "./screeningForm";
import type { ScreeningQuestion } from "./screeningForm";
import type { AdoptRequestPayload } from "../../services/apis/pet.api";

/**
 * The write side of the screening questionnaire, asked on a pet's profile
 * before an adoption request is sent. It shares SCREENING_SECTIONS with
 * screeningAnswersModal — that modal renders the same catalogue read-only for
 * the rehomer, so the wording can only be changed in one place.
 *
 * Answers stay in the shapes the backend stores: choice questions keep the
 * 0-based option index, except the residence question, which keeps its label.
 */

/** A questionnaire mid-fill: unanswered is null (or "" for the free text). */
interface ScreeningDraft {
    Q1_1: boolean | null;
    Q1_2: boolean | null;
    Q1_3: string;
    Q2_1: string;
    Q2_2: boolean | null;
    Q2_3: boolean | null;
    /** Kept as a string while typing so the field can be empty. */
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

/** Hours in a day — the ceiling for "how long is the pet left alone". */
const MAX_HOURS_ALONE = 24;

/** What one answer can hold, across all three question kinds. */
type AnswerValue = boolean | number | string;

/** Clickable twin of screeningAnswersModal's read-only AnswerRadio. */
function Radio({
    selected,
    label,
    onSelect,
}: {
    selected: boolean;
    label: string;
    onSelect: () => void;
}) {
    return (
        <Flex
            as="button"
            align="center"
            gap="15px"
            textAlign="left"
            onClick={onSelect}
            aria-pressed={selected}
        >
            <Circle size="20px" borderWidth="1px" borderColor="BlueText" flexShrink={0}>
                {selected && <Circle size="12.73px" bg="BlueText" />}
            </Circle>
            <Text fontSize={{ base: "14px", md: "16px" }} fontWeight="500" color="Grey">
                {label}
            </Text>
        </Flex>
    );
}

/** The rounded pill free-text answers are typed into. */
function TextField({
    value,
    placeholder,
    numeric,
    onChange,
}: {
    value: string;
    placeholder: string;
    numeric?: boolean;
    onChange: (value: string) => void;
}) {
    return (
        <Input
            value={value}
            placeholder={placeholder}
            inputMode={numeric ? "numeric" : "text"}
            onChange={(e) => onChange(e.target.value)}
            w="100%"
            maxW="465px"
            minH="36px"
            px="20px"
            py="10px"
            bg="rgba(255,255,255,0.70)"
            borderRadius="132px"
            borderWidth="1px"
            borderColor="BlueText"
            fontSize={{ base: "14px", md: "16px" }}
            color="Grey"
            _placeholder={{ color: "GreyMuted" }}
            _focusVisible={{ borderColor: "Blue", outline: "none" }}
        />
    );
}

function Field({
    question,
    draft,
    onChange,
}: {
    question: ScreeningQuestion;
    draft: ScreeningDraft;
    onChange: (id: ScreeningQuestion["id"], value: AnswerValue) => void;
}) {
    if (question.kind === "boolean") {
        const value = draft[question.id];
        return (
            <Flex w="180px" justify="space-between" align="center">
                <Radio
                    selected={value === true}
                    label="Yes"
                    onSelect={() => onChange(question.id, true)}
                />
                <Radio
                    selected={value === false}
                    label="No"
                    onSelect={() => onChange(question.id, false)}
                />
            </Flex>
        );
    }

    if (question.kind === "text") {
        const isHours = question.id === "Q3_1";
        return (
            <TextField
                value={String(draft[question.id] ?? "")}
                numeric={isHours}
                placeholder={
                    isHours
                        ? `Hours (0-${MAX_HOURS_ALONE})`
                        : question.number === ""
                          ? "Anything else the rehomer should know (optional)"
                          : "Your answer"
                }
                onChange={(value) => onChange(question.id, value)}
            />
        );
    }

    // Two storage shapes share this branch, the same split the read-only modal
    // handles: the residence question saves the label, every other choice saves
    // its 0-based index.
    const value = draft[question.id];
    return (
        <Flex
            direction={question.layout === "stacked" ? "column" : "row"}
            align="flex-start"
            gap={question.layout === "stacked" ? "10px" : "24px"}
            wrap="wrap"
            w="100%"
        >
            {question.options.map((option, index) => {
                const stored = question.id === "Q2_1" ? option : index;
                return (
                    <Radio
                        key={option}
                        selected={value === stored}
                        label={option}
                        onSelect={() => onChange(question.id, stored)}
                    />
                );
            })}
        </Flex>
    );
}

/**
 * Everything still unanswered, named by question number so the message can
 * point at the exact rows. Note is the only optional field.
 */
function missingAnswers(draft: ScreeningDraft): string[] {
    const missing: string[] = [];

    for (const section of SCREENING_SECTIONS) {
        for (const question of section.questions) {
            if (question.id === "Note") continue;

            const value = draft[question.id];
            const answered =
                question.id === "Q3_1"
                    ? isValidHours(draft.Q3_1)
                    : typeof value === "string"
                      ? value.trim() !== ""
                      : value !== null;

            if (!answered) missing.push(question.number);
        }
    }

    return missing;
}

function isValidHours(value: string): boolean {
    const hours = Number(value);
    return (
        value.trim() !== "" &&
        Number.isInteger(hours) &&
        hours >= 0 &&
        hours <= MAX_HOURS_ALONE
    );
}

export default function AdoptionFormModal({
    isOpen,
    petName,
    isSubmitting,
    submitError,
    onClose,
    onSubmit,
}: {
    isOpen: boolean;
    petName: string;
    isSubmitting: boolean;
    submitError: string;
    onClose: () => void;
    onSubmit: (payload: AdoptRequestPayload) => void;
}) {
    const [draft, setDraft] = useState<ScreeningDraft>(EMPTY_DRAFT);
    const [validationError, setValidationError] = useState("");

    // Start from a blank form each time the dialog opens rather than keeping
    // the last attempt around. Done during render, as SelectAiPhotosModal does,
    // to avoid the extra render an effect would cost.
    const [wasOpen, setWasOpen] = useState(isOpen);
    if (isOpen !== wasOpen) {
        setWasOpen(isOpen);
        if (isOpen) {
            setDraft(EMPTY_DRAFT);
            setValidationError("");
        }
    }

    const setAnswer = (id: ScreeningQuestion["id"], value: AnswerValue) => {
        setValidationError("");
        // The cast covers the computed key: TypeScript widens `[id]` to a
        // string index, losing the per-field value types the union already
        // guarantees at every call site.
        setDraft((current) => ({ ...current, [id]: value }) as ScreeningDraft);
    };

    const submit = () => {
        const missing = missingAnswers(draft);
        if (missing.length > 0) {
            setValidationError(`Please answer: ${missing.join(", ")}.`);
            return;
        }

        setValidationError("");
        onSubmit({
            // Every field is non-null past missingAnswers, which is what lets
            // the draft's "unanswered" nulls be asserted away here.
            q1_1: draft.Q1_1 as boolean,
            q1_2: draft.Q1_2 as boolean,
            q1_3: draft.Q1_3.trim(),
            q2_1: draft.Q2_1,
            q2_2: draft.Q2_2 as boolean,
            q2_3: draft.Q2_3 as boolean,
            q3_1: Number(draft.Q3_1),
            q3_2: draft.Q3_2 as boolean,
            q3_3: draft.Q3_3.trim(),
            q4_1: draft.Q4_1 as number,
            q5_1: draft.Q5_1 as number,
            q6_1: draft.Q6_1 as number,
            q6_2: draft.Q6_2 as number,
            note: draft.Note.trim(),
        });
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()} placement="center">
            <Portal>
                <Dialog.Backdrop bg="blackAlpha.400" />
                <Dialog.Positioner>
                    <Dialog.Content
                        maxW="915px"
                        borderRadius={{ base: "25px", md: "50px" }}
                        p="0"
                        position="relative"
                        boxShadow="0px 3.37px 16.84px rgba(201,220,225,0.20)"
                    >
                        <IconButton
                            aria-label="Close"
                            onClick={onClose}
                            position="absolute"
                            top={{ base: "24px", md: "45px" }}
                            right={{ base: "24px", md: "45px" }}
                            boxSize="23.58px"
                            minW="unset"
                            p="0"
                            rounded="full"
                            bg="#EDEDED"
                            _hover={{ bg: "#e0e0e0" }}
                            zIndex={1}
                        >
                            <Icon as={IoClose} boxSize="12px" color="GreyText" />
                        </IconButton>

                        <VStack
                            pt="53px"
                            pb="40px"
                            px={{ base: "24px", md: "54px" }}
                            gap="30px"
                            align="stretch"
                        >
                            <VStack gap="21px" maxW="626px" alignSelf="center">
                                <Text fontSize="24px" fontWeight="600" color="Grey" textAlign="center">
                                    Adoption Screening Form
                                </Text>
                                <Text fontSize="16px" fontWeight="500" color="GreyText" textAlign="center">
                                    Your answers are shared with {petName}&apos;s finder to help
                                    them approve the adoption.
                                </Text>
                            </VStack>

                            {/* The questionnaire is far taller than any viewport,
                                so the body scrolls while the heading, the errors
                                and Submit stay put. */}
                            <VStack align="stretch" gap="30px" maxH="55vh" overflowY="auto" pr="8px">
                                {SCREENING_SECTIONS.map((section) => (
                                    <VStack key={section.title} align="stretch" gap="20px">
                                        <Text fontSize="16px" color="black">
                                            {section.title}
                                        </Text>

                                        <VStack align="stretch" gap="25px" px={{ base: "8px", md: "25px" }}>
                                            {section.questions.map((question) => (
                                                <VStack key={question.id} align="flex-start" gap="12px">
                                                    {question.text && (
                                                        <Text fontSize="16px" color="black">
                                                            {question.number} {question.text}
                                                        </Text>
                                                    )}
                                                    <Field
                                                        question={question}
                                                        draft={draft}
                                                        onChange={setAnswer}
                                                    />
                                                </VStack>
                                            ))}
                                        </VStack>
                                    </VStack>
                                ))}
                                <Box h="1px" flexShrink={0} />
                            </VStack>

                            {(validationError || submitError) && (
                                <Text fontSize="14px" color="red.500">
                                    {validationError || submitError}
                                </Text>
                            )}

                            <Flex justify={{ base: "center", md: "flex-end" }}>
                                <S2SButton
                                    text="Send Request"
                                    width={{ base: "230px", md: "180px" }}
                                    height={{ base: "40px", md: "44.80px" }}
                                    fontSize={{ base: "14px", md: "20px" }}
                                    loading={isSubmitting}
                                    onClick={submit}
                                />
                            </Flex>
                        </VStack>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}
