import { VStack, Circle, Text } from "@chakra-ui/react";

import type { S2SPetIconButtonType } from "../types/component.type";

export default function S2SPetIconButton({ icon, label, selected = false, onClick }: S2SPetIconButtonType) {
    return (
        <VStack gap={2} cursor="pointer" onClick={onClick} userSelect="none">
            <Circle
                size="73px"
                // Selecting fills the whole circle rather than just ringing it.
                bg={selected ? "Yellow" : "Cream"}
                transition="background 0.15s ease"
            >
                {icon}
            </Circle>
            <Text fontSize="20px" fontWeight="600" color="Grey">{label}</Text>
        </VStack>
    );
}
