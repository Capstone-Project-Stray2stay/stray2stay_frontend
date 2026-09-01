import { Box, Tabs, Text } from "@chakra-ui/react";

import type { ListTab } from "../../types/profile.type";

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
        <Tabs.Root
            value={value}
            onValueChange={(e) => onChange(e.value as ListTab)}
            // "plain" — the default "line" variant draws its own selected-tab
            // underline (in the gray colorPalette, since none is set), which
            // would show as a second, unwanted black line under the custom
            // SkyBlue bar rendered below.
            variant="plain"
            display="flex"
            flexDirection="column"
            gap="0"
            width="100%"
        >
            <Tabs.List display="flex" justifyContent="center" alignItems="flex-end" gap={{ base: "16px", md: "64px" }} flexWrap="wrap" border="none" minH="unset">
                {TABS.map((tab) => {
                    const active = tab.id === value;
                    return (
                        <Tabs.Trigger
                            key={tab.id}
                            value={tab.id}
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            gap="14px"
                            // The recipe forces a fixed height/min-width (the
                            // --tabs-height token) regardless of variant, which
                            // left empty space below our bar before the
                            // full-width divider — clearing both lets the bar
                            // sit flush against it instead of floating above.
                            height="auto"
                            minW="unset"
                            p="0"
                            bg="transparent"
                            border="none"
                            cursor="pointer"
                        >
                            <Text
                                px={{ base: "8px", md: "12px" }}
                                fontSize={{ base: "16px", md: "24px" }}
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
                                h={{ base: "2px", md: "4px" }}
                                borderTopRadius="61px"
                                bg={active ? "SkyBlue" : "transparent"}
                            />
                        </Tabs.Trigger>
                    );
                })}
            </Tabs.List>
            <Box h="2px" bg="SkyBlue" w="100%" />
        </Tabs.Root>
    );
}
