import { useEffect, useMemo } from "react"
import {
    Box,
    Combobox,
    HStack,
    Image,
    Portal,
    Span,
    useFilter,
    useListCollection,
} from "@chakra-ui/react"

import type { S2SDropDownType } from "../types/component.type"
import CloseIcon from "./icons/closeIcon.component"
import CheckIcon from "./icons/checkIcon.component"
import ChevronDownIcon from "./icons/chevronDownIcon.component"

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
    paddingX,
    gutter = 0,
    variant = "default",
}: S2SDropDownType) {
    const isFilterList = variant === "filter"
    // Figma: once a clearable field has a value, ✕ moves into its own segment 2px to the right
    const isSplit = clearable && !!value && !disabled
    // Filter fields have no border until filled (Figma: --bluetext); other pages keep their own border
    const splitBorder = isFilterList ? "BlueText" : borderColor
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
            // Figma open state: the list hangs straight off the control unless a gap is asked for
            positioning={{ gutter }}
            // Chakra drives both the input's start padding and the indicator group's padding from this var
            style={paddingX ? ({ "--combobox-input-padding-x": paddingX } as React.CSSProperties) : undefined}
            {...controlProps}
        >
            <Combobox.Control display="flex" gap="2px">
                {/* Own positioning box so the chevron stays on the field, not on the ✕ segment */}
                <Box position="relative" flex="1" minW={0}>
                    <Combobox.Input
                        placeholder={placeholder}
                        rounded="full"
                        roundedRight={isSplit ? "0" : undefined}
                        h={height}
                        fontSize={fontSize}
                        // Figma: text, 12px gap, 20px chevron, then the edge padding. Chakra's own reserve
                        // (~56px) left a 20px gap and clipped values early.
                        pe="calc(var(--combobox-input-padding-x) + 32px)"
                        textOverflow="ellipsis"
                        // Form fields: chosen value in --font (#595959), same as typed text. The Adopt filter
                        // keeps Figma's --gray (#7E7E7E) value text.
                        color={isFilterList ? "GreyText" : "Grey"}
                        borderColor={isSplit ? splitBorder : borderColor}
                        bg={bg}
                        boxShadow={boxShadow}
                        transition="background 0.15s ease, border-color 0.15s ease"
                        _placeholder={placeholderColor ? { color: placeholderColor } : undefined}
                        // Figma hover: rgba(247,247,247,0.8) fill; empty filter fields also get a --baby-gray border
                        _hover={isFilterList && !isSplit ? { bg: "White_hover", borderColor: "BabyGray" } : { bg: "White_hover" }}
                        _active={{ bg: "White_active" }}
                        // Grey is for hover only (user brief): while the list is open the field keeps its own fill
                        _open={{ bg }}
                        focusRingColor="BlueText"
                        _focus={{ borderColor: "Blue" }}
                        _disabled={{ opacity: 1, color: "Grey", cursor: "not-allowed", bg }}
                    />
                    <Combobox.IndicatorGroup>
                        {/* Figma "Vector (3)" chevron, at Chakra's default indicator size (the original size) */}
                        <Combobox.Trigger color="GreyText">
                            <ChevronDownIcon />
                        </Combobox.Trigger>
                    </Combobox.IndicatorGroup>
                </Box>
                {isSplit && (
                    // ✕ segment: Figma 12/16 padding, same border and shadow as the field. At rest it takes the
                    // field's own fill (user brief: no grey once the list is closed); grey only on hover.
                    <Combobox.ClearTrigger
                        aria-label="Clear"
                        display="flex"
                        alignItems="center"
                        flexShrink={0}
                        w="auto"
                        minW="auto"
                        h={height ?? "var(--combobox-input-height)"}
                        // Figma's stroke sits inside the 12/16 padding; a CSS border adds 1px each side, so
                        // 11/15 keeps the segment 40px wide like Figma
                        ps="11px"
                        pe="15px"
                        bg={bg}
                        borderWidth="1px"
                        borderColor={splitBorder}
                        roundedLeft="0"
                        roundedRight="full"
                        boxShadow={boxShadow}
                        color="GreyText"
                        cursor="pointer"
                        transition="background 0.15s ease"
                        _hover={{ bg: "White_hover" }}
                        _active={{ bg: "White_active" }}
                    >
                        <CloseIcon />
                    </Combobox.ClearTrigger>
                )}
            </Combobox.Control>
            <Portal>
                <Combobox.Positioner>
                    {/* Figma filter list, used by every dropdown: 16px padding top/bottom, side padding equal to
                        the field's text inset (the list is portalled, so it can't read the field's CSS var),
                        16 radius, 80% white, 40px rows 10px apart, 500 text at the field's own size */}
                    <Combobox.Content
                        bg="rgba(255, 255, 255, 0.80)"
                        borderRadius="16px"
                        boxShadow="0px 4px 20px rgba(201, 220, 225, 0.20)"
                        maxH="376px"
                        // The rows' -8px hover bleed otherwise triggers a sideways scrollbar
                        overflowX="hidden"
                        // Scrollbar look comes from the site-wide style in theme.tsx; here the track just
                        // stops 16px short so the thumb clears the list's rounded corners
                        css={{ "&::-webkit-scrollbar-track": { marginBlock: "16px" } }}
                        py="16px"
                        px={paddingX ?? "12px"}
                        display="flex"
                        flexDirection="column"
                        gap="10px"
                    >
                        <Combobox.Empty px="0" color="GreyText" fontSize={{ base: "14", md: "16" }}>No items found</Combobox.Empty>
                        {collection.items.map((item) => (
                            <Combobox.Item
                                item={item}
                                key={item.value}
                                // The grey hover pill bleeds 8px past the text on each side (negative margin),
                                // so the text itself stays aligned with the field's text
                                mx="-8px"
                                px="8px"
                                // Figma: text rows are 40 (4px top/bottom); photo rows are just the 36px photo
                                py={item.image ? "0" : "4px"}
                                minH={item.image ? "36px" : "40px"}
                                flexShrink={0}
                                rounded="8px"
                                color="GreyText"
                                fontSize={{ base: "14", md: "16" }}
                                fontWeight="500"
                                lineHeight="normal"
                                _hover={{ bg: "White_active" }}
                                _highlighted={{ bg: "White_active" }}
                            >
                                <HStack gap={2}>
                                    {item.image && (
                                        <Image src={item.image} alt="" boxSize="36px" borderRadius="8px" objectFit="cover" flexShrink={0} />
                                    )}
                                    <Span>{item.label}</Span>
                                </HStack>
                                {/* Figma "Vector (4)" check in --bluetext, at Chakra's default indicator size (the original size) */}
                                <Combobox.ItemIndicator color="BlueText" flexShrink={0}>
                                    <CheckIcon />
                                </Combobox.ItemIndicator>
                            </Combobox.Item>
                        ))}
                    </Combobox.Content>
                </Combobox.Positioner>
            </Portal>
        </Combobox.Root>
    )
}
