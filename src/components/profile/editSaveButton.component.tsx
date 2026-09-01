import { Icon, IconButton } from "@chakra-ui/react";
import { LuCheck, LuPencil } from "react-icons/lu";

/** Shared filled-circle edit/save toggle used by the header of both profile edit cards. */
export default function EditSaveButton({
    label,
    isEditing,
    saving,
    onToggleEdit,
    onSave,
}: {
    label: string;
    isEditing: boolean;
    saving: boolean;
    onToggleEdit: () => void;
    onSave: () => void;
}) {
    return (
        <IconButton
            aria-label={isEditing ? `Save ${label}` : `Edit ${label}`}
            onClick={isEditing ? onSave : onToggleEdit}
            loading={saving}
            boxSize="36px"
            minW="unset"
            p="0"
            rounded="full"
            bg="Blue"
            color="white"
            _hover={{ bg: "Blue" }}
        >
            <Icon as={isEditing ? LuCheck : LuPencil} boxSize="16px" />
        </IconButton>
    );
}
