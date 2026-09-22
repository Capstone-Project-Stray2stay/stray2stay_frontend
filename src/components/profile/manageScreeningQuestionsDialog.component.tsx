import { useEffect, useState } from "react";
import { Dialog, Flex, Portal, Text, VStack } from "@chakra-ui/react";
import { isAxiosError } from "axios";

import { S2SButton, S2SDialogCloseButton } from "../S2S.components";
import ScreeningQuestionsBuilder from "./screeningQuestionsBuilder.component";
import { useScreeningQuestions, useSaveScreeningQuestions } from "../../hooks/query/pet.query";
import type { CustomScreeningQuestionDraft } from "../../types/profile.type";

function toDraft(questions: { questionType: string; questionText: string; questionOptions?: string[]; questionRequired: boolean; questionOrder: number }[]): CustomScreeningQuestionDraft[] {
    return questions.map((q) => ({
        questionType: q.questionType as CustomScreeningQuestionDraft["questionType"],
        questionText: q.questionText,
        questionOptions: q.questionOptions ?? [],
        questionRequired: q.questionRequired,
        questionOrder: q.questionOrder,
    }));
}

function serverMessage(error: unknown): string {
    if (isAxiosError(error)) {
        const data = error.response?.data as { error?: string; message?: string } | undefined;
        return data?.error ?? data?.message ?? error.message;
    }
    return error instanceof Error ? error.message : "Unknown error";
}

export default function ManageScreeningQuestionsDialog({
    isOpen,
    pid,
    onClose,
}: {
    isOpen: boolean;
    pid: string | number;
    onClose: () => void;
}) {
    const { questions, locked, isLoading } = useScreeningQuestions(isOpen ? pid : undefined);
    const saveQuestions = useSaveScreeningQuestions();

    const [draft, setDraft] = useState<CustomScreeningQuestionDraft[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isOpen) {
            setDraft(toDraft(questions));
            setError("");
        }
    }, [isOpen, questions]);

    const handleSave = () => {
        const missingText = draft.find((q) => q.questionText.trim().length === 0);
        if (missingText) {
            setError("Every question needs question text.");
            return;
        }
        const missingOptions = draft.find(
            (q) =>
                (q.questionType === "CHECKLIST" || q.questionType === "MULTIPLE_CHOICE") &&
                q.questionOptions.length < 2,
        );
        if (missingOptions) {
            setError("Checklist and multiple-choice questions need at least 2 options.");
            return;
        }

        setError("");
        saveQuestions.mutate(
            { pid, questions: draft },
            {
                onSuccess: () => onClose(),
                onError: (err) => setError(serverMessage(err)),
            },
        );
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()} placement="center">
            <Portal>
                <Dialog.Backdrop bg="blackAlpha.400" />
                <Dialog.Positioner>
                    <Dialog.Content
                        maxW={{ base: "calc(100vw - 48px)", md: "800px" }}
                        borderRadius="50px"
                        p="0"
                        position="relative"
                        boxShadow="0px 3.37px 16.84px rgba(201,220,225,0.20)"
                    >
                        <S2SDialogCloseButton onClick={onClose} zIndex={1} />

                        <VStack pt="53px" pb="40px" px={{ base: "24px", md: "54px" }} gap="30px" align="stretch">
                            <VStack gap="12px" pt="24px" alignSelf="center">
                                <Text fontSize={{base: "18px", md: "24px"}} fontWeight="600" color="Grey" textAlign="center">
                                    Manage Screening Questions
                                </Text>
                                <Text fontSize="16px" fontWeight="500" color="GreyText" textAlign="center">
                                    Add your own questions on top of the standard screening form. Adopters
                                    will answer these when they apply.
                                </Text>
                            </VStack>

                            {locked && (
                                <Text fontSize="14px" color="Yellow" textAlign="center">
                                    This pet already has adoption applications, so its screening questions
                                    are locked and can no longer be edited.
                                </Text>
                            )}

                            {isLoading ? (
                                <Text fontSize="16px" color="GreyText" textAlign="center" py="40px">
                                    Loading...
                                </Text>
                            ) : (
                                <Flex maxH="55vh" overflowY="auto" pr="8px" pb="10px">
                                    <ScreeningQuestionsBuilder
                                        questions={draft}
                                        onChange={setDraft}
                                        disabled={locked}
                                    />
                                </Flex>
                            )}

                            {error && (
                                <Text fontSize="14px" color="red.500" textAlign="center">
                                    {error}
                                </Text>
                            )}

                            {!locked && (
                                <Flex justify="center">
                                    <S2SButton
                                        text="Save Questions"
                                        width="200px"
                                        height="51px"
                                        fontSize="18px"
                                        loading={saveQuestions.isPending}
                                        onClick={handleSave}
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
