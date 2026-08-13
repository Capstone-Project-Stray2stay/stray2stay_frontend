import { Input, InputGroup } from "@chakra-ui/react";

import type { S2SInputType } from "../types/component.type"

export default function S2SInput({ startIcon, endIcon, placeholder, type = "text", value, onChange }: S2SInputType) {
    return (
        <InputGroup
            startElement={startIcon}
            endElement={endIcon}>
            <Input
                placeholder={placeholder}
                type={type}
                value={value}
                onChange={onChange}
                rounded="full"
                p={4}
                borderColor="LightGrey"
                _focus={{ borderColor: "Blue" }}
            />
        </InputGroup>
    )
}