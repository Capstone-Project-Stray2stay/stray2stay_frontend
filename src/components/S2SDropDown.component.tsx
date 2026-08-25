import { useEffect } from "react"
import {
    Combobox,
    Portal,
    useFilter,
    useListCollection,
} from "@chakra-ui/react"

import type { S2SDropDownType } from "../types/component.type"

export default function S2SDropDown({
    placeholder,
    width,
    data,
    value,
    onValueChange,
    disabled,
    height,
    borderColor,
    bg="white",
}: S2SDropDownType) {
    const { contains } = useFilter({ sensitivity: "base" })

    const { collection, filter, set } = useListCollection({
        initialItems: data,
        filter: contains,
    })
    useEffect(() => {
        set(data)
    }, [data, set])

    const controlProps = onValueChange
        ? {
            value: value ? [value] : [],
            onValueChange: (e: { value: string[] }) => onValueChange(e.value[0] ?? ""),
        }
        : {}

    return (
        <Combobox.Root
            collection={collection}
            onInputValueChange={(e) => filter(e.inputValue)}
            openOnClick
            disabled={disabled}
            width={width}
            {...controlProps}
        >
            <Combobox.Control>
                <Combobox.Input
                    placeholder={placeholder}
                    rounded="full"
                    h={height}
                    borderColor={borderColor}
                    bg={bg}
                    // Same fix as S2SInput: don't let Chakra's default disabled
                    // 50% opacity wash the selected value's text out.
                    _disabled={{ opacity: 1, color: "Grey", cursor: "not-allowed" }}
                />
                <Combobox.IndicatorGroup>
                    <Combobox.Trigger />
                </Combobox.IndicatorGroup>
            </Combobox.Control>
            <Portal>
                <Combobox.Positioner>
                    <Combobox.Content>
                        <Combobox.Empty>No items found</Combobox.Empty>
                        {collection.items.map((item) => (
                            <Combobox.Item item={item} key={item.value}>
                                {item.label}
                                <Combobox.ItemIndicator />
                            </Combobox.Item>
                        ))}
                    </Combobox.Content>
                </Combobox.Positioner>
            </Portal>
        </Combobox.Root>
    )
}
