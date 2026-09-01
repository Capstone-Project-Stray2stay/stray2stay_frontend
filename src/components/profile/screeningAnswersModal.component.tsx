import { Box, Dialog, Input, Portal, RadioGroup, Text, VStack } from "@chakra-ui/react";

import { S2SDialogCloseButton } from "../S2S.components";
import { SCREENING_SECTIONS } from "../../utils/screeningForm";
import type { ScreeningQuestion } from "../../utils/screeningForm";
import type { ScreeningAnswers } from "../../types/profile.type";

/**
 * Read-only radio group. The whole modal shows someone else's already
 * submitted answers, so this is a display rather than an input — Chakra's
 * RadioGroup in `readOnly` mode keeps real radio semantics (so screen readers
 * correctly announce it as non-interactive) without allowing changes.
 */
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
                    <RadioGroup.ItemText fontSize="16px" fontWeight="500" color="Grey">
                        {option.label}
                    </RadioGroup.ItemText>
                </RadioGroup.Item>
            ))}
        </RadioGroup.Root>
    );
}

/** The rounded pill that free-text answers sit in. */
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
            fontSize="16px"
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
    answers: ScreeningAnswers;
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

    // Two storage shapes share this branch: the residence question saves the
    // label itself, every other choice saves a 0-based index.
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

export default function ScreeningAnswersModal({
    isOpen,
    adopterName,
    answers,
    onClose,
}: {
    isOpen: boolean;
    adopterName: string;
    answers: ScreeningAnswers | undefined;
    onClose: () => void;
}) {
    return (
        <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()} placement="center">
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
                        <S2SDialogCloseButton onClick={onClose} zIndex={1} />

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
                                    {adopterName}&apos;s responses, shared to assist in the adoption
                                    approval process.
                                </Text>
                            </VStack>

                            {answers === undefined ? (
                                <Text fontSize="16px" color="GreyText" textAlign="center" py="40px">
                                    No screening answers were submitted with this request.
                                </Text>
                            ) : (
                                // The questionnaire is far taller than any viewport,
                                // so the body scrolls while the heading and the close
                                // button stay put.
                                <VStack
                                    align="stretch"
                                    gap="30px"
                                    maxH="55vh"
                                    overflowY="auto"
                                    pr="8px"
                                >
                                    {SCREENING_SECTIONS.map((section) => (
                                        <VStack key={section.title} align="stretch" gap="20px">
                                            <Text fontSize="16px" color="black">
                                                {section.title}
                                            </Text>

                                            <VStack align="stretch" gap="25px" px="25px">
                                                {section.questions.map((question) => (
                                                    <VStack
                                                        key={question.id}
                                                        align="flex-start"
                                                        gap="12px"
                                                    >
                                                        {question.text && (
                                                            <Text fontSize="16px" color="black">
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
