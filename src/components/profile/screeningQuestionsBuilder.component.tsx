import { useState } from "react";
import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import { LuChevronDown, LuChevronUp, LuPlus, LuTrash2 } from "react-icons/lu";

import { S2SButton, S2SCheckbox, S2SChip, S2SDropDown, S2SIconButton, S2SInput } from "../S2S.components";
import type { CustomQuestionType, CustomScreeningQuestionDraft } from "../../types/profile.type";

const QUESTION_TYPE_OPTIONS: { value: string; label: string }[] = [
    { value: "ESSAY", label: "Essay / Short Answer" },
    { value: "MULTIPLE_CHOICE", label: "Multiple Choice" },
    { value: "CHECKLIST", label: "Checklist" },
    { value: "IMAGE", label: "Image Upload" },
];

export function emptyScreeningQuestion(order: number): CustomScreeningQuestionDraft {
    return {
        questionType: "ESSAY",
        questionText: "",
        questionOptions: [],
        questionRequired: true,
        questionOrder: order,
    };
}

function OptionsEditor({
    options,
    onChange,
    disabled,
}: {
    options: string[];
    onChange: (options: string[]) => void;
    disabled?: boolean;
}) {
    const [draftOption, setDraftOption] = useState("");

    const commit = () => {
        const text = draftOption.trim();
        if (text && !options.includes(text)) {
            onChange([...options, text]);
        }
        setDraftOption("");
    };

    return (
        <VStack align="flex-start" gap="10px" w="100%">
            <Flex gap="10px" wrap="wrap">
                {options.map((option) => (
                    <S2SChip
                        key={option}
                        text={option}
                        selected
                        readOnly={disabled}
                        onToggle={() => onChange(options.filter((o) => o !== option))}
                    />
                ))}
            </Flex>
            {!disabled && (
                <Flex gap="10px" align="center" w="100%">
                    <S2SInput
                        flex="1"
                        minW={0}
                        placeholder="Add an option.."
                        value={draftOption}
                        onChange={(e) => setDraftOption(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                commit();
                            }
                        }}
                    />
                    <Box flexShrink={0}>
                        <S2SIconButton icon={<LuPlus />} ariaLabel="Add option" onClick={commit} />
                    </Box>
                </Flex>
            )}
        </VStack>
    );
}

export default function ScreeningQuestionsBuilder({
    questions,
    onChange,
    disabled,
}: {
    questions: CustomScreeningQuestionDraft[];
    onChange: (questions: CustomScreeningQuestionDraft[]) => void;
    disabled?: boolean;
}) {
    const updateAt = (index: number, patch: Partial<CustomScreeningQuestionDraft>) => {
        if (disabled) return;
        onChange(questions.map((q, i) => (i === index ? { ...q, ...patch } : q)));
    };

    const removeAt = (index: number) => {
        onChange(
            questions.filter((_, i) => i !== index).map((q, i) => ({ ...q, questionOrder: i })),
        );
    };

    const moveAt = (index: number, direction: -1 | 1) => {
        const target = index + direction;
        if (target < 0 || target >= questions.length) return;
        const next = [...questions];
        [next[index], next[target]] = [next[target], next[index]];
        onChange(next.map((q, i) => ({ ...q, questionOrder: i })));
    };

    const addQuestion = () => {
        onChange([...questions, emptyScreeningQuestion(questions.length)]);
    };

    return (
        <VStack align="stretch" gap="20px" w="100%">
            {questions.length === 0 && (
                <Text fontSize="14px" color="GreyText">
                    No additional questions yet.
                </Text>
            )}

            {questions.map((question, index) => (
                <Box key={index} borderWidth="1px" borderColor="#E9E9E9" borderRadius="16px" p="20px">
                    <VStack align="stretch" gap="14px">
                        <Flex justify="space-between" align="center" gap="10px" wrap="wrap">
                            <S2SDropDown
                                placeholder="Question type"
                                width={{base: "200px", md: "220px"}}
                                data={QUESTION_TYPE_OPTIONS}
                                value={question.questionType}
                                onValueChange={(value) =>
                                    updateAt(index, {
                                        questionType: value as CustomQuestionType,
                                        questionOptions: [],
                                    })
                                }
                                disabled={disabled}
                            />
                            <Flex gap="6px">
                                <S2SIconButton
                                    icon={<LuChevronUp />}
                                    ariaLabel="Move up"
                                    onClick={() => moveAt(index, -1)}
                                />
                                <S2SIconButton
                                    icon={<LuChevronDown />}
                                    ariaLabel="Move down"
                                    onClick={() => moveAt(index, 1)}
                                />
                                {!disabled && (
                                    <S2SIconButton
                                        icon={<LuTrash2 />}
                                        ariaLabel="Remove question"
                                        onClick={() => removeAt(index)}
                                    />
                                )}
                            </Flex>
                        </Flex>

                        <S2SInput
                            placeholder="Question text"
                            value={question.questionText}
                            onChange={(e) => updateAt(index, { questionText: e.target.value })}
                            disabled={disabled}
                        />

                        {(question.questionType === "CHECKLIST" ||
                            question.questionType === "MULTIPLE_CHOICE") && (
                            <OptionsEditor
                                options={question.questionOptions}
                                onChange={(questionOptions) => updateAt(index, { questionOptions })}
                                disabled={disabled}
                            />
                        )}

                        <S2SCheckbox
                            label="Required"
                            checked={question.questionRequired}
                            onChange={(checked) => updateAt(index, { questionRequired: checked })}
                        />
                    </VStack>
                </Box>
            ))}

            {!disabled && (
                <S2SButton
                    text="Add Question"
                    variant="outline"
                    width="180px"
                    height="40px"
                    fontSize="14px"
                    onClick={addQuestion}
                />
            )}
        </VStack>
    );
}
