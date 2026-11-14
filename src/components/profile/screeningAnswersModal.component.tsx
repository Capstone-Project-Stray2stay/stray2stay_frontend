import { Box, Dialog, HStack, Icon, Image, Input, Portal, RadioGroup, Text, VStack } from "@chakra-ui/react";
import { LuSparkles } from "react-icons/lu";

import { S2SDialogCloseButton } from "../S2S.components";
import QuestionPhotos from "./questionPhotos.component";
import { SCREENING_SECTIONS } from "../../utils/screeningForm";
import type { ScreeningQuestion } from "../../utils/screeningForm";
import type {
    AiSummaryStatus,
    CustomAnswerResponse,
    ScreeningAnswersWithCustom,
} from "../../types/profile.type";

function AnswerRadioGroup({
    value,
    options,
    flexDirection = "row",
    justifyContent,
    gap = "15px",
    flexWrap,
    width,
}: {
    value: string;
    options: { value: string; label: string }[];
    flexDirection?: "row" | "column";
    justifyContent?: string;
    gap?: string;
    flexWrap?: "wrap" | "nowrap";
    width?: string;
}) {
    return (
        <RadioGroup.Root
            value={value}
            readOnly
            display="flex"
            flexDirection={flexDirection}
            alignItems={flexDirection === "row" ? "center" : "flex-start"}
            justifyContent={justifyContent}
            gap={gap}
            flexWrap={flexWrap}
            width={width}
        >
            {options.map((option) => (
                <RadioGroup.Item key={option.value} value={option.value} gap="15px" cursor="default">
                    <RadioGroup.ItemHiddenInput />
                    <RadioGroup.ItemIndicator
                        boxSize="20px"
                        borderWidth="1px"
                        borderColor="BlueText"
                        bg="transparent"
                        color="BlueText"
                        _checked={{ bg: "transparent", borderColor: "BlueText", color: "BlueText" }}
                    />
                    <RadioGroup.ItemText fontSize="16" fontWeight="500" color="Grey">
                        {option.label}
                    </RadioGroup.ItemText>
                </RadioGroup.Item>
            ))}
        </RadioGroup.Root>
    );
}

function TextAnswer({ value, full }: { value: string; full?: boolean }) {
    return (
        <Input
            value={value}
            readOnly
            placeholder="No answer given"
            cursor="default"
            w={full ? "100%" : "465px"}
            maxW="100%"
            minH="36px"
            px="20px"
            py="10px"
            fontSize="16"
            color="Grey"
            _placeholder={{ color: "GreyMuted" }}
            bg="rgba(255,255,255,0.70)"
            borderRadius="132px"
            borderWidth="1px"
            borderColor="BlueText"
            focusRingColor="BlueText"
        />
    );
}

function Answer({
    question,
    answers,
}: {
    question: ScreeningQuestion;
    answers: ScreeningAnswersWithCustom;
}) {
    const value = answers[question.id];

    if (question.kind === "boolean") {
        return (
            <AnswerRadioGroup
                value={value === true ? "true" : value === false ? "false" : ""}
                options={[
                    { value: "true", label: "Yes" },
                    { value: "false", label: "No" },
                ]}
                justifyContent="space-between"
                width="180px"
            />
        );
    }

    if (question.kind === "text") {
        return <TextAnswer value={String(value ?? "")} full={question.number === ""} />;
    }

    const isIndexStored = typeof value === "number";

    return (
        <AnswerRadioGroup
            value={isIndexStored ? String(value) : typeof value === "string" ? value : ""}
            options={question.options.map((option, index) => ({
                value: isIndexStored ? String(index) : option,
                label: option,
            }))}
            flexDirection={question.layout === "stacked" ? "column" : "row"}
            gap={question.layout === "stacked" ? "10px" : "24px"}
            flexWrap="wrap"
            width="100%"
        />
    );
}

/**
 * Marks the panel as machine-written at a glance, so it is never mistaken
 * for something the adopter or the platform wrote.
 */
const AI_GRADIENT =
    "linear-gradient(45deg, #FFAFBD, #FFD3A5, #FFE29A, #B5EAD7, #A8D8F0, #C7B9F5)";

function AiBadge() {
    return (
        <HStack
            gap="5px"
            px="10px"
            py="3px"
            borderRadius="999px"
            bgImage={AI_GRADIENT}
            color="Grey"
            flexShrink={0}
        >
            <Icon as={LuSparkles} boxSize="13px" aria-hidden />
            <Text fontSize="12" fontWeight="700" letterSpacing="0.6px" lineHeight="1.4">
                AI
            </Text>
        </HStack>
    );
}

/**
 * The AI briefing of this adopter's form, shown above the answers so the
 * owner gets the gist before scrolling.
 *
 * The gradient border and badge are not decoration: this sits in front of
 * someone deciding who gets to adopt a pet, so it has to be obvious at a
 * glance that a machine wrote it and that a summary can omit or soften
 * something the form itself says. The answers below it stay the record.
 */
function AiSummaryPanel({
    summary,
    status,
}: {
    summary: string | undefined;
    status: AiSummaryStatus | undefined;
}) {
    const text = summary?.trim();

    // An older backend sends neither field; render nothing rather than an
    // empty box that looks broken.
    if (!text && status === undefined) {
        return null;
    }

    const pending = !text && status !== "FAILED";

    return (
        // The gradient lives on an outer wrapper used as a 2px frame: a
        // border cannot itself take a gradient, and painting one behind a
        // translucent panel would tint the text area too.
        <Box borderRadius="26px" p="2px" bgImage={AI_GRADIENT} flexShrink={0}>
            <Box
                bg="white"
                borderRadius="24px"
                px={{ base: "18px", md: "26px" }}
                py="18px"
            >
                {/* A summary is normally a few lines, but it is capped at 2000
                    characters server-side. Bound it so a long one scrolls
                    rather than squeezing the answers out of view. */}
                <VStack align="stretch" gap="10px" overflowY="auto">
                    <HStack gap="10px">
                        <AiBadge />
                        <Text fontSize="16" fontWeight="600" color="Grey">
                            Summary
                        </Text>
                    </HStack>

                    {text ? (
                        <>
                            <Text fontSize="16" fontWeight="500" color="Grey" whiteSpace="pre-wrap">
                                {text}
                            </Text>
                            <Text fontSize="14" fontWeight="500" color="GreyText">
                                Written by AI from the answers below. Please read the full form
                                before deciding.
                            </Text>
                        </>
                    ) : (
                        <Text fontSize="16" fontWeight="500" color="GreyText">
                            {pending
                                ? "The summary is still being written. Reopen this form in a moment to see it."
                                : "A summary could not be generated for this request."}
                        </Text>
                    )}
                </VStack>
            </Box>
        </Box>
    );
}

function CustomAnswerView({ answer }: { answer: CustomAnswerResponse }) {
    if (answer.questionType === "ESSAY") {
        return <TextAnswer value={String(answer.value ?? "")} full />;
    }

    if (answer.questionType === "IMAGE") {
        const url = typeof answer.value === "string" ? answer.value : "";
        return url ? (
            <Image
                src={url}
                alt={answer.questionText}
                w="100%"
                maxH="400px"
                objectFit="cover"
                borderRadius="12px"
            />
        ) : (
            <TextAnswer value="" full />
        );
    }

    if (answer.questionType === "CHECKLIST") {
        const selected = Array.isArray(answer.value) ? answer.value : [];
        return <TextAnswer value={selected.join(", ")} full />;
    }

    // MULTIPLE_CHOICE
    return <TextAnswer value={typeof answer.value === "string" ? answer.value : ""} full />;
}

export default function ScreeningAnswersModal({
    isOpen,
    adopterName,
    answers,
    onClose,
}: {
    isOpen: boolean;
    adopterName: string;
    answers: ScreeningAnswersWithCustom | undefined;
    onClose: () => void;
}) {
    return (
        <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()} placement="center">
            <Portal>
                <Dialog.Backdrop bg="blackAlpha.400" />
                <Dialog.Positioner>
                    {/* Same shell as the adopter's Adoption Screening Form (adoptScreeningForm.component) */}
                    <Dialog.Content
                        maxW="800px"
                        maxH="90vh"
                        borderRadius="24px"
                        p="0"
                        position="relative"
                        boxShadow="0px 3.37px 16.84px rgba(201,220,225,0.20)"
                    >
                        <S2SDialogCloseButton onClick={onClose} top="32px" right="32px" boxSize="28px" zIndex={1} />

                        {/* Dialog.Content is a flex column with a maxH, so this
                            fills it and clips; the answers below take whatever
                            height is left. Sizing any part of this in vh would
                            double-count the header and summary and spill past
                            the rounded corners. */}
                        <VStack
                            py="32px"
                            px={{ base: "24px", md: "32px" }}
                            gap="24px"
                            align="stretch"
                            flex="1"
                            minH="0"
                            overflow="hidden"
                        >
                            {/* Same header as the adopter form: 28px title line level with the ✕, 12px gap, balanced subtitle */}
                            <VStack gap="12px" maxW="626px" alignSelf="center" flexShrink={0} px={{ base: "28px", md: 0 }}>
                                <Text fontSize={{base: "20", md: "24"}} fontWeight="600" color="Grey" textAlign="center" lineHeight="28px">
                                    Adoption Screening Form
                                </Text>
                                <Text fontSize={{base: "14", md: "16"}} fontWeight="500" color="Grey" textAlign="center" css={{ textWrap: "balance" }}>
                                    {adopterName}&apos;s responses, shared to assist in the adoption
                                    approval process.
                                </Text>
                            </VStack>


                            {answers === undefined ? (
                                <Text fontSize="16" color="GreyText" textAlign="center" py="40px">
                                    No screening answers were submitted with this request.
                                </Text>
                            ) : (
                                // Section/question spacing and type mirror the adopter form: 16 between sections,
                                // 12 inside, questions indented 24, 8 from question to answer, 16/400 --font text
                                <VStack
                                    align="stretch"
                                    gap="16px"
                                    flex="1"
                                    minH="0"
                                    overflowY="auto"
                                    pr="8px"
                                >
                                    <AiSummaryPanel
                                        summary={answers.aiSummary}
                                        status={answers.aiSummaryStatus}
                                    />
                                    {SCREENING_SECTIONS.map((section, sectionIndex) => (
                                        <VStack key={section.title} align="stretch" gap="12px">
                                            <Text fontSize="16" fontWeight="400" color="Grey">
                                                {section.questions.some((q) => q.number !== "") && `${sectionIndex + 1}. `}
                                                {section.title}
                                            </Text>

                                            <VStack
                                                align="stretch"
                                                gap="12px"
                                                px={section.questions.every((q) => q.number === "") ? 0 : "24px"}
                                            >
                                                {section.questions.map((question) => (
                                                    <VStack
                                                        key={question.id}
                                                        align="flex-start"
                                                        gap="8px"
                                                    >
                                                        {question.text && (
                                                            <Text fontSize="16" fontWeight="400" color="Grey">
                                                                {question.number} {question.text}
                                                            </Text>
                                                        )}
                                                        <Answer
                                                            question={question}
                                                            answers={answers}
                                                        />
                                                    </VStack>
                                                ))}
                                            </VStack>
                                        </VStack>
                                    ))}

                                    {answers.CustomAnswers && answers.CustomAnswers.length > 0 && (
                                        <VStack align="stretch" gap="12px">
                                            <Text fontSize="16" fontWeight="400" color="Grey">
                                                Additional Questions
                                            </Text>
                                            <VStack align="stretch" gap="12px" px="24px">
                                                {answers.CustomAnswers.map((answer) => (
                                                    <VStack
                                                        key={answer.questionId}
                                                        align="stretch"
                                                        gap="8px"
                                                        w="100%"
                                                    >
                                                        <Text fontSize="16" fontWeight="400" color="Grey">
                                                            {answer.questionText}
                                                        </Text>
                                                        {/* The owner's illustration photos, as the adopter saw them */}
                                                        <QuestionPhotos
                                                            urls={answer.questionImages ?? []}
                                                            label={answer.questionText || "Question photo"}
                                                        />
                                                        <CustomAnswerView answer={answer} />
                                                    </VStack>
                                                ))}
                                            </VStack>
                                        </VStack>
                                    )}

                                    <Box h="1px" flexShrink={0} />
                                </VStack>
                            )}
                        </VStack>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}
