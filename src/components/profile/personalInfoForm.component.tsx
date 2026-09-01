import { S2SCardShell } from "../S2S.components";

import EditSaveButton from "./editSaveButton.component";
import PersonalInfoFields from "./personalInfoFields.component";
import type { PersonalInfoDraft } from "../../types/profile.type";

export default function PersonalInfoForm({
    value,
    onChange,
    isEditing,
    saving,
    onToggleEdit,
    onSave,
}: {
    value: PersonalInfoDraft;
    onChange: (patch: Partial<PersonalInfoDraft>) => void;
    isEditing: boolean;
    saving: boolean;
    onToggleEdit: () => void;
    onSave: () => void;
}) {
    return (
        <S2SCardShell
            railColor="SkyBlue"
            bg="white"
            flex={{ base: "none", lg: "7 1 0" }}
            minW={0}
            py="32px"
            px={{base: "36px", md: "48px"}}
            align="flex-start"
        >
            <PersonalInfoFields
                value={value}
                onChange={onChange}
                disabled={!isEditing}
                headerAction={
                    <EditSaveButton
                        label="personal information"
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
