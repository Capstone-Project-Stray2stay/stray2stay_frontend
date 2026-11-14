import { Dialog, Flex, Portal, Text, VStack } from "@chakra-ui/react";

import { S2SButton } from "../S2S.components";

// Copy from the Figma "Vaccination Information" frame (DHPPi, Rabies). FVRCP isn't in Figma; its line is a
// placeholder until the team confirms the wording.
const VACCINE_DESCRIPTIONS: Record<string, string> = {
    DHPPi: "Combined vaccine protecting against Distemper, Hepatitis, Parainfluenza, and Parvovirus.",
    FVRCP: "Combined vaccine protecting against Feline Viral Rhinotracheitis, Calicivirus, and Panleukopenia.",
    Rabies: "Vaccine protecting against the rabies virus.",
};

// Figma "Frame 554": 460px card (396 content + 32 padding), 24 radius, 32px between title, body and button;
// 24/600 title, 20px body (vaccine name 600, description 500) in --font, "Large" Close button bottom-right.
export default function VaccinationInfoModal({
    isOpen,
    onClose,
    vaccines,
}: {
    isOpen: boolean;
    onClose: () => void;
    vaccines: string[];
}) {
    return (
        <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()} placement="center">
            <Portal>
                <Dialog.Backdrop bg="blackAlpha.400" />
                <Dialog.Positioner px={4}>
                    <Dialog.Content maxW="460px" borderRadius="24px" p="0" bg="white" boxShadow="0px 3.37px 16.84px rgba(201,220,225,0.20)">
                        <VStack p="32px" gap="32px" align="stretch" lineHeight="normal">
                            <Dialog.Title fontSize="24" fontWeight="600" color="Grey" textAlign="center" lineHeight="normal">
                                Vaccination Information
                            </Dialog.Title>

                            <Text fontSize="20" fontWeight="500" color="Grey">
                                {vaccines.map((vaccine, i) => (
                                    <span key={vaccine}>
                                        {i > 0 && <br />}
                                        <Text as="span" fontWeight="600">{vaccine}</Text>
                                        : {VACCINE_DESCRIPTIONS[vaccine] ?? ""}
                                    </span>
                                ))}
                            </Text>

                            <Flex justify="flex-end">
                                {/* Figma "Large": 24/12 padding, 160 min width, 20/600; 12 + 24 + 12 = 48 tall */}
                                <S2SButton text="Close" size="lg" height="48px" onClick={onClose} />
                            </Flex>
                        </VStack>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}
