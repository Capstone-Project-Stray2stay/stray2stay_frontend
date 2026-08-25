import { Accordion, Span } from "@chakra-ui/react"
import { FaAngleDown } from "react-icons/fa6";

import type { S2SAccordionType } from "../types/component.type"

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
}: S2SAccordionType) {
    const itemValue: string = value ?? title

    return (
        <Accordion.Root collapsible width={width} bg="white" borderRadius="25px" overflow="hidden">
            <Accordion.Item value={itemValue} borderWidth="0">
                <Accordion.ItemTrigger py={py} px={px}>
                    <Span flex="1" color="Grey" fontWeight="semibold" fontSize={fontSize}>
                        {title}
                    </Span>
                    <Accordion.ItemIndicator>
                        <FaAngleDown color="Grey" />
                    </Accordion.ItemIndicator>
                </Accordion.ItemTrigger>
                <Accordion.ItemContent px={px} color={contentColor} fontSize={contentFontSize}>
                    <Accordion.ItemBody pt={contentPt} pb={contentPb}>{content}</Accordion.ItemBody>
                </Accordion.ItemContent>
            </Accordion.Item>
        </Accordion.Root>
    )
}