import { Icon, IconButton } from "@chakra-ui/react";
import { LuCheck, LuPencil } from "react-icons/lu";

/** Figma: outlined 38px circle, pencil while viewing and a check while editing */
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
            boxSize="38px"
            minW="unset"
            p="0"
            rounded="full"
            flexShrink={0}
            bg="white"
            borderWidth="1.36px"
            borderColor="Blue"
            color="Blue"
            transition="background 0.15s ease"
            _hover={{ bg: "LineHover" }}
            _active={{ bg: "LineActive" }}
        >
            <Icon as={isEditing ? LuCheck : LuPencil} boxSize="20px" />
        </IconButton>
    );
}
