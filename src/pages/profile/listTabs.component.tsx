import { Box, Flex, Text, VStack } from "@chakra-ui/react";

import type { ListTab } from "./profile.type";

const TABS: { id: ListTab; label: string }[] = [
    { id: "rehoming", label: "My Rehoming" },
    { id: "adoptions", label: "My Adoptions" },
];

export default function ListTabs({
    value,
    onChange,
}: {
    value: ListTab;
    onChange: (tab: ListTab) => void;
}) {
    return (
        <VStack align="stretch" gap="0" w="100%">
            <Flex justify="center" gap={{ base: "32px", md: "64px" }} wrap="wrap">
                {TABS.map((tab) => {
                    const active = tab.id === value;
                    return (
                        <VStack
                            key={tab.id}
                            as="button"
                            gap="8px"
                            cursor="pointer"
                            onClick={() => onChange(tab.id)}
                        >
                            <Text
                                px="12px"
                                fontSize="24px"
                                fontWeight="600"
                                color={active ? "BlueText" : "Grey"}
                                whiteSpace="nowrap"
                                transition="color 0.15s ease"
                            >
                                {tab.label}
                            </Text>
                            {/* Always rendered so switching tabs doesn't shift
                                the row's height by 6px. */}
                            <Box
                                w="100%"
                                h="6px"
                                borderRadius="61px"
                                bg={active ? "SkyBlue" : "transparent"}
                            />
                        </VStack>
                    );
                })}
            </Flex>
            <Box h="2px" bg="SkyBlue" w="100%" />
        </VStack>
    );
}
