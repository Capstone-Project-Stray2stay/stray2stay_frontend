import type { ReactNode } from "react";
import { Flex, Text } from "@chakra-ui/react";

export default function ProfileField({
    label,
    labelColor = "BlueText",
    labelSize = "16px",
    children,
}: {
    label: string;
    labelColor?: string;
    labelSize?: string;
    children: ReactNode;
}) {
    return (
        <Flex direction="column" align="stretch" gap="4px" w="100%" minW={0}>
            <Text fontSize={labelSize} fontWeight="500" color={labelColor}>
                {label}
            </Text>
            {children}
        </Flex>
    );
}
