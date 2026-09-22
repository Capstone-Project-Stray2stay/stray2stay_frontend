import { Text, VStack } from "@chakra-ui/react";

import ScreeningQuestionsBuilder from "../profile/screeningQuestionsBuilder.component";
import type { CustomScreeningQuestionDraft } from "../../types/profile.type";

export default function Step4ScreeningQuestions({
    questions,
    onChange,
}: {
    questions: CustomScreeningQuestionDraft[];
    onChange: (questions: CustomScreeningQuestionDraft[]) => void;
}) {
    return (
        <VStack align="stretch" gap="24px">
            <VStack align="flex-start" gap="4px">
                <Text fontSize="20px" fontWeight="600" color="Grey">
                    Screening Questions (Optional)
                </Text>
                <Text fontSize="14px" color="GreyText">
                    Add your own questions on top of the standard adoption screening form. This step is
                    optional — skip it and add questions later from the pet's profile page instead.
                </Text>
            </VStack>

            <ScreeningQuestionsBuilder questions={questions} onChange={onChange} />
        </VStack>
    );
}
