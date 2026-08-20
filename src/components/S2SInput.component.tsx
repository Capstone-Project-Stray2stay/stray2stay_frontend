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
    // p={4} is the original default padding for the rounded-full look; once a
    // caller opts into custom sizing (h or px, e.g. detailInputStyle), that
    // default backs off so it can't fight the caller's own px.
    const hasCustomSizing = h !== undefined || px !== undefined;

    return (
        <InputGroup
            startElement={startIcon}
            endElement={endIcon}>
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
                _focus={{ borderColor: "Blue" }}
                {...rest}
            />
        </InputGroup>
    )
}