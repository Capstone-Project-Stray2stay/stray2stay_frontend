import type { ReactNode } from "react";
import { Flex, Text } from "@chakra-ui/react";

export function RequiredAsterisk() {
    return (
        <Text as="span" color="red.500" aria-hidden="true">
            {" *"}
        </Text>
    );
}

export default function DetailField({
    label,
    children,
    required = false,
}: {
    label: string;
    children: ReactNode;
    required?: boolean;
}) {
    return (
        <Flex direction="column" align="stretch" gap={{ base: "5.71px", md: "6.52px" }} w="100%">
            <Text fontSize={{ base: "14px", md: "16px" }} fontWeight="500" color="GreyText">
                {label}
                {required && <RequiredAsterisk />}
            </Text>
            {children}
        </Flex>
    );
}

export function DetailSection({
    title,
    children,
    required = false,
}: {
    title: string;
    children: ReactNode;
    required?: boolean;
}) {
    return (
        <Flex
            direction={{ base: "column", md: "row" }}
            align={{ base: "stretch", md: "flex-start" }}
            w="100%"
            gap={{ base: "20px", md: "32px" }}
        >
            <Text
                w={{ base: "auto", md: "200px" }}
                flexShrink={0}
                fontSize={{ base: "16px", md: "20px" }}
                fontWeight="600"
                color="Grey"
            >
                {title}
                {required && <RequiredAsterisk />}
            </Text>
            <Flex direction="column" align="stretch" flex={{ base: "0 1 auto", md: "1 1 0" }} minW={0}>
                {children}
            </Flex>
        </Flex>
    );
}
