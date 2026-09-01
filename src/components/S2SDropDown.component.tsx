import { useEffect } from "react"
import {
    Combobox,
    HStack,
    Image,
    Portal,
    Span,
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
    fontSize,
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
                    fontSize={fontSize}
                    borderColor={borderColor}
                    bg={bg}
                    // Chakra's default focus ring uses the "gray" colorPalette
                    // since none is set here, so it renders grey — match
                    // S2SInput's blue focus border instead.
                    focusRingColor="BlueText"
                    _focus={{ borderColor: "Blue" }}
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
                                <HStack gap={2}>
                                    {item.image && (
                                        <Image src={item.image} alt="" boxSize="36px" borderRadius="full" objectFit="cover" flexShrink={0} />
                                    )}
                                    <Span>{item.label}</Span>
                                </HStack>
                                <Combobox.ItemIndicator />
                            </Combobox.Item>
                        ))}
                    </Combobox.Content>
                </Combobox.Positioner>
            </Portal>
        </Combobox.Root>
    )
}
