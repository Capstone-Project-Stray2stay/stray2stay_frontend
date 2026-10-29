import { HStack, Icon, Text, Box } from "@chakra-ui/react";

import { IoPerson } from "react-icons/io5"
import { FaRepeat, FaDog, FaBook } from "react-icons/fa6";
import { GoHomeFill } from "react-icons/go";

export const BASE_NAV_ITEMS = [
    { key: "home", label: "Home", icon: GoHomeFill, nav: "/" },
    { key: "adopt", label: "Adopt", icon: FaDog, nav: "/adopt" },
    { key: "rehome", label: "Rehome", icon: FaRepeat, nav: "/rehome" },
    { key: "diary", label: "Diary", icon: FaBook, nav: "/diary" },
    { key: "profile", label: "Profile", icon: IoPerson, nav: "/profile" },
]

export const AUTH_ONLY_KEYS = ["profile", "diary", "rehome"]

export function getActiveNavKey(
    pathname: string,
    items: Array<{ key: string; nav: string }>
): string {
    const exactMatch = items.find((item) => item.nav === pathname)
    if (exactMatch) return exactMatch.key

    const nestedMatch = items.find(
        (item) => item.nav !== "/" && pathname.startsWith(`${item.nav}/`)
    )
    if (nestedMatch) return nestedMatch.key

    return "home"
}

export function NavItem({ icon, label, active = false, onClick }: {
    icon: React.ElementType
    label: string
    active?: boolean
    onClick?: () => void
}) {
    return (
        <HStack
            onClick={onClick}
            cursor="pointer"
            w="full"
            h="52px"
            px={{ base: 8, md: 10, lg: "22%" }}
            gap="11px"
            position="relative"
            borderRightRadius="5px"
            bg={active ? "rgba(198, 231, 247, 0.25)" : "transparent"}
            color={active ? "BlueText" : "Grey"}
            _hover={{ bg: active ? "rgba(198, 231, 247, 0.25)" : "gray.50" }}
            transition="all 0.15s ease"
        >
            <Icon as={icon} boxSize="18px" flexShrink={0} />
            <Text fontSize="18" fontWeight="medium" whiteSpace="nowrap">
                {label}
            </Text>

            {active && (
                <Box
                    position="absolute"
                    right={0}
                    top={0}
                    w="5.37px"
                    h="100%"
                    bg="SkyBlue"
                    borderRadius="25px"
                />
            )}
        </HStack>
    )
}