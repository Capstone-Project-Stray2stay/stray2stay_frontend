import type { ReactNode } from "react";
import { Flex, Text } from "@chakra-ui/react";

import { RequiredAsterisk } from "../rehome/detailField.component";

export default function ProfileField({
    label,
    labelColor = "BlueText",
    labelSize = "16",
    children,
    gap = "4px",
    required = false,
}: {
    label: string;
    labelColor?: string;
    labelSize?: string;
    children: ReactNode;
    gap?: string;
    /** Red asterisk after the label, same as the Rehome form's required fields */
    required?: boolean;
}) {
    return (
        <Flex direction="column" align="stretch" gap={gap} w="100%" minW={0}>
            <Text fontSize={labelSize} fontWeight="500" color={labelColor}>
                {label}
                {required && <RequiredAsterisk />}
            </Text>
            {children}
        </Flex>
    );
}
