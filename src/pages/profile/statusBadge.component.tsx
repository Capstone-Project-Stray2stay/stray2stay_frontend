import { Flex, Text } from "@chakra-ui/react";

import type { AdoptionStatus } from "./profile.type";

const STYLES: Record<AdoptionStatus, { label: string; bg: string; color: string }> = {
    success: { label: "Success", bg: "LightGreen", color: "Green" },
    pending: { label: "Pending", bg: "LightYellow", color: "Yellow" },
};

export default function StatusBadge({ status }: { status: AdoptionStatus }) {
    const style = STYLES[status];

    return (
        <Flex
            w="115px"
            h="38px"
            align="center"
            justify="center"
            borderRadius="30.44px"
            bg={style.bg}
            flexShrink={0}
        >
            <Text fontSize="18px" fontWeight="500" color={style.color}>
                {style.label}
            </Text>
        </Flex>
    );
}
