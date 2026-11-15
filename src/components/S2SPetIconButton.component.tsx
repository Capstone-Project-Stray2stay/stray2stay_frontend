import { VStack, Circle, Text } from "@chakra-ui/react";

import type { S2SPetIconButtonType } from "../types/component.type";

export default function S2SPetIconButton({ icon, label, selected = false, onClick, pt = "0px" }: S2SPetIconButtonType) {
    return (
        <VStack gap={2} cursor="pointer" onClick={onClick} userSelect="none" role="group" className="group">
            <Circle
                size={{ base: "51px", md: "72px" }}
                bg={selected ? "Cream_active" : "Cream"}
                boxShadow="0px 4px 4px rgba(0, 0, 0, 0.05)"
                transition="background 0.15s ease"
                pt={pt}
                // Hover only tints unpicked circles, so a picked one turns orange straight away instead of after the mouse leaves
                _groupHover={selected ? undefined : { bg: "Cream_hover" }}
                _groupActive={{ bg: "Cream_active" }}
            >
                {icon}
            </Circle>
            <Text fontSize={{ base: "14", md: "20" }} fontWeight="600" color="Grey">{label}</Text>
        </VStack>
    );
}
