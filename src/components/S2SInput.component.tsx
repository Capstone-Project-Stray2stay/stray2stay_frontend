import { Input, InputGroup } from "@chakra-ui/react";

import type { S2SInputType } from "../types/component.type"

export default function S2SInput({
    startIcon,
    endIcon,
    placeholder,
    type = "text",
    value,
    onChange,
    h,
    px,
    bg = "White",
    borderRadius = "full",
    borderColor = "BlueText",
    ...rest
}: S2SInputType) {
    const hasCustomSizing = h !== undefined || px !== undefined;

    return (
        <InputGroup
            startElement={startIcon}
            endElement={endIcon}
        >
            <Input
                placeholder={placeholder}
                type={type}
                value={value}
                onChange={onChange}
                h={h}
                px={px}
                p={hasCustomSizing ? undefined : 4}
                bg={bg}
                borderRadius={borderRadius}
                borderColor={borderColor}
                focusRingColor="BlueText"
                _focus={{ borderColor: "Blue" }}
                _disabled={{ opacity: 1, color: "Grey", cursor: "not-allowed" }}
                {...rest}
            />
        </InputGroup>
    )
}
