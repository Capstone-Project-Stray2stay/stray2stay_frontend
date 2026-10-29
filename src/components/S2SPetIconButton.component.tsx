import { VStack, Circle, Text } from "@chakra-ui/react";

import type { S2SPetIconButtonType } from "../types/component.type";

export default function S2SPetIconButton({ icon, label, selected = false, onClick }: S2SPetIconButtonType) {
    return (
        <VStack gap={2} cursor="pointer" onClick={onClick} userSelect="none" role="group">
            {/* Figma: hover / pressed take the yellow button's fill (--orange) */}
            <Circle
                size={{ base: "51px", md: "72px" }}
                bg={selected ? "Orange" : "Cream"}
                boxShadow="0px 4px 4px rgba(0, 0, 0, 0.05)"
                transition="background 0.15s ease"
                _groupHover={{ bg: "Orange" }}
                _groupActive={{ bg: "Orange" }}
            >
                {icon}
            </Circle>
            <Text fontSize={{ base: "14", md: "20" }} fontWeight="600" color="Grey">{label}</Text>
        </VStack>
    );
}
