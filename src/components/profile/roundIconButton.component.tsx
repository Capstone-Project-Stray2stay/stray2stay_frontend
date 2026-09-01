import { Icon, IconButton } from "@chakra-ui/react";
import type { IconType } from "react-icons";

export default function RoundIconButton({
    icon,
    ariaLabel,
    color,
    onClick,
}: {
    icon: IconType;
    ariaLabel: string;
    color: string;
    onClick?: () => void;
}) {
    return (
        <IconButton
            aria-label={ariaLabel}
            boxSize="38px"
            minW="unset"
            p="0"
            rounded="full"
            flexShrink={0}
            bg="white"
            borderWidth="1.36px"
            borderColor={color}
            color={color}
            transition="background 0.15s ease"
            _hover={{ bg: "blackAlpha.50" }}
            onClick={onClick}
        >
            <Icon as={icon} boxSize="18px" />
        </IconButton>
    );
}
