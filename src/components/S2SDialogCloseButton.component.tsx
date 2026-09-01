import { Icon, IconButton } from "@chakra-ui/react";
import { IoClose } from "react-icons/io5";

import type { S2SDialogCloseButtonType } from "../types/component.type";

export default function S2SDialogCloseButton({
    onClick,
    top = "32px",
    right = "32px",
    boxSize = "40px",
    iconBoxSize = "20px",
    zIndex,
}: S2SDialogCloseButtonType) {
    return (
        <IconButton
            aria-label="Close"
            onClick={onClick}
            position="absolute"
            top={top}
            right={right}
            boxSize={boxSize}
            minW="unset"
            p="0"
            rounded="full"
            bg="#EDEDED"
            _hover={{ bg: "#e0e0e0" }}
            zIndex={zIndex}
        >
            <Icon as={IoClose} boxSize={iconBoxSize} color="GreyText" />
        </IconButton>
    );
}
