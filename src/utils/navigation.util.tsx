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
            px={{ base: 8, md: 5 }}
            py={3}
            gap={3}
            position="relative"
            bg={active ? "blue.50" : "transparent"}
            color={active ? "Blue" : "Grey"}
            _hover={{ bg: active ? "blue.50" : "gray.50" }}
            transition="all 0.15s ease"
        >
            <Icon as={icon} boxSize={5} />
            <Text fontSize="md" fontWeight="medium">
                {label}
            </Text>

            {active && (
                <Box
                    position="absolute"
                    right={0}
                    top="50%"
                    transform="translateY(-50%)"
                    w="4px"
                    h="100%"
                    bg="Blue"
                    borderRadius="full"
                />
            )}
        </HStack>
    )
}