import { IconButton } from "@chakra-ui/react";

import type { S2SDialogCloseButtonType } from "../types/component.type";
import CloseIcon from "./icons/closeIcon.component";

// Fixed 36px #EBEBEB circle with the Figma ✕ ("Vector.svg") in #7E7E7E — same size everywhere
const BOX_SIZE = "36px";
const ICON_BOX_SIZE = "12px";

export default function S2SDialogCloseButton({
    onClick,
    top = "32px",
    right = "32px",
    zIndex,
    inline = false,
    boxSize = BOX_SIZE,
    iconBoxSize = ICON_BOX_SIZE,
}: S2SDialogCloseButtonType) {
    return (
        <IconButton
            aria-label="Close"
            onClick={onClick}
            // inline: sits in the layout (e.g. a header row) instead of pinned to the dialog's corner
            position={inline ? undefined : "absolute"}
            top={inline ? undefined : top}
            right={inline ? undefined : right}
            flexShrink={0}
            boxSize={boxSize}
            minW="unset"
            p="0"
            rounded="full"
            bg="#EBEBEB"
            _hover={{ bg: "#e0e0e0" }}
            color="GreyText"
            // Chakra's IconButton sizes its svg itself; pin it to the Figma ✕
            css={{ "& svg": { width: iconBoxSize, height: iconBoxSize } }}
            zIndex={zIndex}
        >
            <CloseIcon />
        </IconButton>
    );
}
