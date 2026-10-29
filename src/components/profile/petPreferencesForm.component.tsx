import { S2SCardShell } from "../S2S.components";

import EditSaveButton from "./editSaveButton.component";
import PetPreferencesFields from "./petPreferencesFields.component";
import type { PetPreferenceDraft } from "../../types/profile.type";

export default function PetPreferencesForm({
    preferences,
    onChange,
    isEditing,
    saving,
    onToggleEdit,
    onSave,
}: {
    preferences: PetPreferenceDraft[];
    onChange: (preferences: PetPreferenceDraft[]) => void;
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
                preferences={preferences}
                onChange={onChange}
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
