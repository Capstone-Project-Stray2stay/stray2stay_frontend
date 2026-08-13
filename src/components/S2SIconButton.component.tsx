import { IconButton } from "@chakra-ui/react"

import type { S2SIconButtonType } from "../types/component.type"

export default function S2SIconButton({ icon, ariaLabel, bgColor, iconColor, onClick }: S2SIconButtonType) {
    return (
        <IconButton
            aria-label={ariaLabel || "icon-button"}
            rounded="full"
            bg={bgColor || "Blue"}
            color={iconColor || "white"}
            _hover={{ bg: `${bgColor || "Blue"}_hover` }}
            _active={{ bg: `${bgColor || "Blue"}_active` }}
            onClick={onClick}
        >
            {icon}
        </IconButton>
    )
}