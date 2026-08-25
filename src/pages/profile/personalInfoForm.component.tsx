import { Circle, Icon, Spinner } from "@chakra-ui/react";
import { LuCheck, LuPencil } from "react-icons/lu";

import { S2SCardShell } from "../../components/S2S.components";

import PersonalInfoFields from "./personalInfoFields.component";
import type { PersonalInfoDraft } from "./profile.type";

/** The Profile page's railed card around the shared Personal Information fields. */
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
                    <Circle
                        as="button"
                        aria-label={isEditing ? "Save personal information" : "Edit personal information"}
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
