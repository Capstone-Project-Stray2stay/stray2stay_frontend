import { Box, Circle, Dialog, Flex, Icon, IconButton, Portal, Text, VStack } from "@chakra-ui/react";
import { IoClose } from "react-icons/io5";

import { SCREENING_SECTIONS } from "./screeningForm";
import type { ScreeningQuestion } from "./screeningForm";
import type { ScreeningAnswers } from "./profile.type";

/**
 * Read-only radio. The whole modal shows someone else's submitted answers, so
 * these are indicators rather than inputs — no click handling, no form
 * semantics.
 */
function AnswerRadio({ selected, label }: { selected: boolean; label: string }) {
    return (
        <Flex align="center" gap="15px">
            <Circle
                size="20px"
                borderWidth="1px"
                borderColor="BlueText"
                flexShrink={0}
                aria-hidden
            >
                {selected && <Circle size="12.73px" bg="BlueText" />}
            </Circle>
            <Text fontSize="16px" fontWeight="500" color="Grey">
                {label}
            </Text>
        </Flex>
    );
}

/** The rounded pill that free-text answers sit in. */
function TextAnswer({ value, full }: { value: string; full?: boolean }) {
    return (
        <Flex
            w={full ? "100%" : "465px"}
            maxW="100%"
            minH="36px"
            align="center"
            px="20px"
            py="10px"
            bg="rgba(255,255,255,0.70)"
            borderRadius="132px"
            borderWidth="1px"
            borderColor="BlueText"
        >
            <Text fontSize="16px" color={value ? "Grey" : "GreyMuted"}>
                {value || "No answer given"}
            </Text>
        </Flex>
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
            <Flex w="180px" justify="space-between" align="center">
                <AnswerRadio selected={value === true} label="Yes" />
                <AnswerRadio selected={value === false} label="No" />
            </Flex>
        );
    }

    if (question.kind === "text") {
        return <TextAnswer value={String(value ?? "")} full={question.number === ""} />;
    }

    return (
        <Flex
            direction={question.layout === "stacked" ? "column" : "row"}
            align="flex-start"
            gap={question.layout === "stacked" ? "10px" : "24px"}
            wrap="wrap"
            w="100%"
        >
            {question.options.map((option, index) => (
                <AnswerRadio
                    key={option}
                    // Two storage shapes share this branch: the residence
                    // question saves the label itself, every other choice saves
                    // a 0-based index.
                    selected={typeof value === "number" ? value === index : value === option}
                    label={option}
                />
            ))}
        </Flex>
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
                        <IconButton
                            aria-label="Close"
                            onClick={onClose}
                            position="absolute"
                            top="45px"
                            right="45px"
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
