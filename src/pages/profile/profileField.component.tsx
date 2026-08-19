import type { ReactNode } from "react";
import { Flex, Text } from "@chakra-ui/react";

/**
 * A labelled control. Rehome's DetailField pins its label to 16px/GreyText,
 * but this page needs two variants — BlueText/16px above the personal fields
 * and GreyText/13.05px above the preference selects — so the colour and size
 * are props here.
 */
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
