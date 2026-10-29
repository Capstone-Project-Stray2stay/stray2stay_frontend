import { Button, Flex} from "@chakra-ui/react";

import type { S2SButtonSize, S2SButtonType } from "../types/component.type"

// Figma button sheet: padding, min width, type and icon size per size
const SIZES: Record<S2SButtonSize, { minW: string; px: string; py: string; fontSize: string; fontWeight: string; gap: string; iconSize: string }> = {
    lg:      { minW: "160px", px: "24px", py: "12px", fontSize: "20", fontWeight: "600", gap: "8px", iconSize: "24px" },
    lgShort: { minW: "120px", px: "16px", py: "12px", fontSize: "20", fontWeight: "600", gap: "8px", iconSize: "24px" },
    md:      { minW: "180px", px: "16px", py: "8px",  fontSize: "20", fontWeight: "600", gap: "8px", iconSize: "20px" },
    sm:      { minW: "120px", px: "16px", py: "8px",  fontSize: "18", fontWeight: "500", gap: "4px", iconSize: "20px" },
    xs:      { minW: "100px", px: "8px",  py: "4px",  fontSize: "16", fontWeight: "500", gap: "4px", iconSize: "20px" },
};

// Light fills that need dark text instead of white
const DARK_TEXT_FILLS = ["Cream", "White"];

export default function S2SButton({ icon, type = "button", text, bgColor, variant = "solid", size, width, height, fontSize, loading, disabled, onClick }: S2SButtonType) {
    const color = bgColor || "Blue";
    const isOutline = variant === "outline";
    const sizing = size ? SIZES[size] : undefined;
    const textColor = isOutline ? color : DARK_TEXT_FILLS.includes(color) ? "GreyText" : "white";

    return (
        <Button
            type={type}
            rounded="full"
            fontWeight={sizing?.fontWeight ?? "semibold"}
            bg={isOutline ? "transparent" : color}
            color={textColor}
            borderWidth={isOutline ? "1px" : undefined}
            borderColor={isOutline ? color : undefined}
            _hover={isOutline ? { bg: "LineHover" } : { bg: `${color}_hover` }}
            _active={isOutline ? { bg: "LineActive" } : { bg: `${color}_active` }}
            minW={sizing?.minW}
            px={sizing?.px}
            py={sizing?.py}
            gap={sizing?.gap}
            w={width ?? (sizing ? "auto" : undefined)}
            h={height ?? (sizing ? "auto" : undefined)}
            fontSize={fontSize ?? sizing?.fontSize}
            loading={loading}
            disabled={disabled}
            onClick={onClick}
        >
            {icon && (
                <Flex
                    pr={sizing ? undefined : 2}
                    css={sizing ? { "& svg": { width: sizing.iconSize, height: sizing.iconSize } } : undefined}
                >
                    {icon}
                </Flex>
            )}
            {text}
        </Button>
    );
}
