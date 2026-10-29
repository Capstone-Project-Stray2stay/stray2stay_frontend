import { useState } from "react";
import { Dialog, Flex, Portal, Text } from "@chakra-ui/react";

import { S2SButton } from "../S2S.components";

import PetPreferencesFields from "./petPreferencesFields.component";
import type { PetPreferenceDraft } from "../../types/profile.type";

/**
 * Figma "Pet Preferences" popup. Edits a copy of the list, so Cancel simply drops it;
 * mount it only while open so each opening starts from the saved preferences.
 */
export default function PetPreferencesDialog({
    initialPreferences,
    saving,
    error,
    onCancel,
    onFinish,
}: {
    initialPreferences: PetPreferenceDraft[];
    saving: boolean;
    error: string;
    onCancel: () => void;
    onFinish: (preferences: PetPreferenceDraft[]) => void;
}) {
    const [draft, setDraft] = useState(initialPreferences);

    return (
        <Dialog.Root
            open
            onOpenChange={(e) => {
                if (!e.open && !saving) onCancel();
            }}
            placement="center"
        >
            <Portal>
                <Dialog.Backdrop bg="blackAlpha.400" />
                <Dialog.Positioner px="16px">
                    <Dialog.Content
                        w="100%"
                        maxW="848px"
                        maxH="calc(100dvh - 64px)"
                        borderRadius="24px"
                        p={{ base: "20px", md: "32px" }}
                        gap="24px"
                    >
                        <Dialog.Title fontSize={{ base: "18", md: "24" }} fontWeight="600" color="Grey">
                            Pet Preferences
                        </Dialog.Title>

                        <Dialog.Body p="0" flex="1" minH={0} overflowY="auto">
                            <PetPreferencesFields preferences={draft} onChange={setDraft} showHeader={false} />
                        </Dialog.Body>

                        {error && (
                            <Text fontSize="14" color="red.500">
                                {error}
                            </Text>
                        )}

                        <Flex justify="space-between" align="center" gap="12px">
                            <S2SButton
                                text="Cancel"
                                variant="outline"
                                bgColor="BlueText"
                                size="lg"
                                disabled={saving}
                                onClick={onCancel}
                            />
                            <S2SButton text="Finish" size="lg" loading={saving} onClick={() => onFinish(draft)} />
                        </Flex>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}
