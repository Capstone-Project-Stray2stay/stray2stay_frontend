import { Checkbox } from "@chakra-ui/react"

import type { S2SCheckboxType } from "../types/component.type"

export default function S2SCheckbox({ label, checked, onChange }: S2SCheckboxType) {
    return (
        <Checkbox.Root
            checked={checked}
            onCheckedChange={(e) => onChange(!!e.checked)}
            cursor="pointer"
            gap="15px"
        >
            <Checkbox.HiddenInput />
            <Checkbox.Control
                boxSize="20px"
                bg="white"
                borderRadius="3px"
                borderWidth="1px"
                borderColor="BlueText"
                _checked={{ bg: "Blue", borderColor: "Blue" }}
            >
                <Checkbox.Indicator />
            </Checkbox.Control>
            <Checkbox.Label fontSize="16px" fontWeight="500" color="Grey">
                {label}
            </Checkbox.Label>
        </Checkbox.Root>
    )
}
