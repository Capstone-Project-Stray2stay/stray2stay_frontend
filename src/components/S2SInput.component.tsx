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
                // Chakra's default disabled state dims the whole input to 50%
                // opacity, which washes the text out — keep it fully readable
                // (still Grey, not the placeholder's lighter tone) and rely on
                // the not-allowed cursor for the disabled affordance instead.
                _disabled={{ opacity: 1, color: "Grey", cursor: "not-allowed" }}
                {...rest}
            />
        </InputGroup>
    )
}