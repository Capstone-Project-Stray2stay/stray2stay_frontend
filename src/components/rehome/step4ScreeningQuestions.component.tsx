import { useState } from "react";
import { Flex, Text, VStack } from "@chakra-ui/react";
import { LuEye } from "react-icons/lu";

import { S2SButton } from "../S2S.components";
import ScreeningQuestionsBuilder from "../profile/screeningQuestionsBuilder.component";
import AdoptScreeningForm from "../profile/adoptScreeningForm.component";
import type { CustomScreeningQuestionDraft } from "../../types/profile.type";

export default function Step4ScreeningQuestions({
    questions,
    onChange,
    locked = false,
}: {
    questions: CustomScreeningQuestionDraft[];
    onChange: (questions: CustomScreeningQuestionDraft[]) => void;
    /** Editing a pet that already has adoption requests: its questions can't change any more. */
    locked?: boolean;
}) {
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    return (
        <VStack align="stretch" gap="40px">
            <VStack align="stretch" gap="12px">
                <Flex justify="space-between" align={{ base: "flex-start", md: "flex-end" }} gap="12px" wrap="wrap">
                    <Text fontSize="20" fontWeight="600" color="Grey">
                        Screening Questions (Optional)
                    </Text>
                    {/* Shows what adopters will see: the standard form plus these questions */}
                    <S2SButton
                        text="Standard screening form"
                        variant="outline"
                        bgColor="BlueText"
                        size="sm"
                        icon={<LuEye />}
                        onClick={() => setIsPreviewOpen(true)}
                    />
                </Flex>
                <Text fontSize="16" fontWeight="400" color="Grey">
                    Add your own questions on top of the standard adoption screening form. This step is
                    optional — skip it and add questions later from the pet's profile page instead.
                </Text>
            </VStack>

            {locked && (
                <Text fontSize="16" color="Orange_active">
                    This pet already has adoption requests, so its screening questions are locked and can
                    no longer be edited.
                </Text>
            )}

            <ScreeningQuestionsBuilder questions={questions} onChange={onChange} disabled={locked} />

            {/* Only the standard questions — the owner's own ones are shown on the pet's profile page */}
            <AdoptScreeningForm
                isOpen={isPreviewOpen}
                petName="the pet"
                previewQuestions={[]}
                onClose={() => setIsPreviewOpen(false)}
            />
        </VStack>
    );
}
