import { Box, Flex } from "@chakra-ui/react";
import type { ReactNode } from "react";

export default function S2SCardShell({
    railColor,
    children,
    ...rest
}: {
    railColor: string;
    children: ReactNode;
} & React.ComponentProps<typeof Flex>) {
    return (
        <Flex
            position="relative"
            bg="rgba(255,255,255,0.70)"
            borderRadius="8px 16px 16px 8px"
            boxShadow="0px 4px 20px rgba(201,220,225,0.20)"
            {...rest}
        >
            <Box
                position="absolute"
                left="0.2px"
                top="0"
                bottom="0"
                w={{base: "8px", md: "14px"}}
                bg={railColor}
                borderRadius="25px"
            />
            {children}
        </Flex>
    );
}
