import type { ReactNode } from "react";
import { Flex, Text } from "@chakra-ui/react";

/** One labelled field: 16px/500 GreyText label above the control. */
export default function DetailField({
    label,
    children,
}: {
    label: string;
    children: ReactNode;
}) {
    return (
        <Flex direction="column" align="stretch" gap="6.52px" w="100%">
            <Text fontSize="16px" fontWeight="500" color="GreyText">
                {label}
            </Text>
            {children}
        </Flex>
    );
}

/** A section row: fixed 200px heading on the left, content on the right. */
export function DetailSection({
    title,
    children,
}: {
    title: string;
    children: ReactNode;
}) {
    return (
        <Flex align="flex-start" w="100%" gap="32px">
            <Text w="200px" flexShrink={0} fontSize="20px" fontWeight="600" color="Grey">
                {title}
            </Text>
            <Flex direction="column" align="stretch" flex="1 1 0" minW={0}>
                {children}
            </Flex>
        </Flex>
    );
}
