import { Button, Flex} from "@chakra-ui/react";

import type { S2SButtonType } from "../types/component.type"

export default function S2SButton({ icon, type = "button", text, bgColor, variant = "solid", width, height, fontSize, loading, disabled, onClick }: S2SButtonType) {
    const color = bgColor || "Blue";
    const isOutline = variant === "outline";

    return (
        <Button
            type={type}
            rounded="full"
            fontWeight="bold"
            bg={isOutline ? "transparent" : color}
            color={isOutline ? color : "white"}
            borderWidth={isOutline ? "1.76px" : undefined}
            borderColor={isOutline ? color : undefined}
            _hover={isOutline ? { bg: "whiteAlpha.700" } : { bg: `${color}_hover` }}
            _active={isOutline ? { bg: "whiteAlpha.800" } : { bg: `${color}_active` }}
            w={width}
            h={height}
            fontSize={fontSize}
            loading={loading}
            disabled={disabled}
            onClick={onClick}
        >
            {icon && <Flex pr={2}>{icon}</Flex>}
            {text}
        </Button>
    );
}