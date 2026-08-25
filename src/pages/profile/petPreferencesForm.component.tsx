import { Circle, Icon, Spinner } from "@chakra-ui/react";
import { LuCheck, LuPencil } from "react-icons/lu";

import { S2SCardShell } from "../../components/S2S.components";

import PetPreferencesFields from "./petPreferencesFields.component";
import type { PetPreferenceDraft } from "./profile.type";

/** The Profile page's railed card around the shared Pet Preferences fields. */
export default function PetPreferencesForm({
    dog,
    cat,
    onDogChange,
    onCatChange,
    isEditing,
    saving,
    onToggleEdit,
    onSave,
}: {
    dog: PetPreferenceDraft;
    cat: PetPreferenceDraft;
    onDogChange: (patch: Partial<PetPreferenceDraft>) => void;
    onCatChange: (patch: Partial<PetPreferenceDraft>) => void;
    isEditing: boolean;
    saving: boolean;
    onToggleEdit: () => void;
    onSave: () => void;
}) {
    return (
        <S2SCardShell
            railColor="Cream"
            bg="white"
            flex={{ base: "none", lg: "7 1 0" }}
            minW={0}
            py="32px"
            px={{ base: "36px", md: "48px" }}
            align="flex-start"
        >
            <PetPreferencesFields
                dog={dog}
                cat={cat}
                onDogChange={onDogChange}
                onCatChange={onCatChange}
                disabled={!isEditing}
                headerAction={
                    <Circle
                        as="button"
                        aria-label={isEditing ? "Save pet preferences" : "Edit pet preferences"}
                        onClick={() => {
                            if (saving) return;
                            if (isEditing) onSave();
                            else onToggleEdit();
                        }}
                        size="36px"
                        bg="Blue"
                        color="white"
                        cursor={saving ? "default" : "pointer"}
                        opacity={saving ? 0.6 : 1}
                    >
                        {saving ? (
                            <Spinner size="sm" color="white" />
                        ) : (
                            <Icon as={isEditing ? LuCheck : LuPencil} boxSize="16px" />
                        )}
                    </Circle>
                }
            />
        </S2SCardShell>
    );
}
