import { Checkbox } from "@chakra-ui/react"

import type { S2SCheckboxType } from "../types/component.type"

export default function S2SCheckbox({ label, checked, onChange }: S2SCheckboxType) {
    return (
        <Checkbox.Root
            checked={checked}
            onCheckedChange={(e) => onChange(!!e.checked)}
            cursor="pointer"
            gap={{ base: "13.73px", md: "15px" }}
        >
            <Checkbox.HiddenInput />
            <Checkbox.Control
                boxSize={{ base: "18.31px", md: "20px" }}
                flexShrink={0}
                bg="white"
                borderRadius={{ base: "2.75px", md: "3px" }}
                borderWidth={{ base: "0.92px", md: "1px" }}
                borderColor="BlueText"
                _checked={{ bg: "Blue", borderColor: "Blue" }}
            >
                <Checkbox.Indicator />
            </Checkbox.Control>
            <Checkbox.Label fontSize={{ base: "14px", md: "16px" }} fontWeight="500" color="Grey">
                {label}
            </Checkbox.Label>
        </Checkbox.Root>
    )
}
