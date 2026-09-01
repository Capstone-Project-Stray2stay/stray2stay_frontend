import { S2SCardShell } from "../S2S.components";

import EditSaveButton from "./editSaveButton.component";
import PetPreferencesFields from "./petPreferencesFields.component";
import type { PetPreferenceDraft } from "../../types/profile.type";

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
                    <EditSaveButton
                        label="pet preferences"
                        isEditing={isEditing}
                        saving={saving}
                        onToggleEdit={onToggleEdit}
                        onSave={onSave}
                    />
                }
            />
        </S2SCardShell>
    );
}
