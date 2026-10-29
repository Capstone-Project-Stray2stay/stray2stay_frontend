import { useEffect, useMemo } from "react"
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
    boxShadow,
    placeholderColor,
    clearable = false,
}: S2SDropDownType) {
    const { contains } = useFilter({ sensitivity: "base" })
    const items = useMemo(
        () => data.filter((item) => typeof item?.value === "string" && item.value.trim() !== ""),
        [data],
    )

    const { collection, filter, set } = useListCollection({
        initialItems: items,
        filter: contains,
    })
    useEffect(() => {
        set(items)
    }, [items, set])

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
            // Figma open state: the list hangs straight off the control
            positioning={{ gutter: 0 }}
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
                    boxShadow={boxShadow}
                    transition="background 0.15s ease"
                    _placeholder={placeholderColor ? { color: placeholderColor } : undefined}
                    _hover={{ bg: "White_hover" }}
                    _active={{ bg: "White_active" }}
                    _open={{ bg: "white" }}
                    focusRingColor="BlueText"
                    _focus={{ borderColor: "Blue" }}
                    _disabled={{ opacity: 1, color: "Grey", cursor: "not-allowed", bg }}
                />
                <Combobox.IndicatorGroup>
                    {clearable && value && !disabled && (
                        <Combobox.ClearTrigger aria-label="Clear" color="GreyText" />
                    )}
                    <Combobox.Trigger color="GreyText" />
                </Combobox.IndicatorGroup>
            </Combobox.Control>
            <Portal>
                <Combobox.Positioner>
                    <Combobox.Content
                        bg="white"
                        borderTopRadius="10px"
                        borderBottomRadius="10px"
                        boxShadow="0px 4px 20px rgba(201, 220, 225, 0.20)"
                        maxH="376px"
                        py="12px"
                    >
                        <Combobox.Empty px="25px" color="GreyText" fontSize={{ base: "14", md: "16" }}>No items found</Combobox.Empty>
                        {collection.items.map((item) => (
                            <Combobox.Item
                                item={item}
                                key={item.value}
                                px="25px"
                                py="9.5px"
                                rounded="0"
                                color="GreyText"
                                fontSize={{ base: "14", md: "16" }}
                                fontWeight="500"
                                _hover={{ bg: "gray.50" }}
                                _highlighted={{ bg: "gray.50" }}
                            >
                                <HStack gap={2}>
                                    {item.image && (
                                        <Image src={item.image} alt="" boxSize="36px" borderRadius="5px" objectFit="cover" flexShrink={0} />
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
