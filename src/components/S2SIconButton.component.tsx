import { IconButton } from "@chakra-ui/react"

export default function S2SIconButton({ icon, ariaLabel, bgColor, iconColor, onClick }: { icon: React.ReactElement, ariaLabel?: string, bgColor?: string, iconColor?: string, onClick?: () => void }) {
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