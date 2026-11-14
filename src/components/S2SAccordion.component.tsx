import { Accordion, Span } from "@chakra-ui/react"

import type { S2SAccordionType } from "../types/component.type"
import ChevronDownIcon from "./icons/chevronDownIcon.component"

export default function S2SAccordion({
    title,
    content,
    value,
    width = "100%",
    px = 6,
    py = 4,
    fontSize,
    contentFontSize,
    contentPt,
    contentPb,
    contentColor = "Grey",
    contentFontWeight,
}: S2SAccordionType) {
    const itemValue: string = value ?? title

    return (
        <Accordion.Root collapsible width={width} bg="rgba(255, 255, 255, 0.70)" borderRadius="24px" overflow="hidden">
            <Accordion.Item value={itemValue} borderWidth="0">
                {/* Figma: header row is 30px tall; once open, the frame's 24px gap separates it from the body */}
                <Accordion.ItemTrigger py={py} px={px} cursor="pointer" _open={{ pb: "24px" }}>
                    <Span flex="1" color="Grey" fontWeight="semibold" fontSize={fontSize} lineHeight="30px">
                        {title}
                    </Span>
                    {/* Figma chevron: the dropdown "Vector (3)" art at 17.65x10.10, i.e. a 22.57px frame, --font */}
                    <Accordion.ItemIndicator color="Grey" css={{ "& svg": { width: "22.57px", height: "22.57px" } }}>
                        <ChevronDownIcon size="22.57px" />
                    </Accordion.ItemIndicator>
                </Accordion.ItemTrigger>
                <Accordion.ItemContent px={px} color={contentColor} fontSize={contentFontSize} fontWeight={contentFontWeight}>
                    <Accordion.ItemBody pt={contentPt} pb={contentPb}>{content}</Accordion.ItemBody>
                </Accordion.ItemContent>
            </Accordion.Item>
        </Accordion.Root>
    )
}
