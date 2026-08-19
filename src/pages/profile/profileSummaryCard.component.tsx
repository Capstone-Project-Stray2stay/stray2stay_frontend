import { Avatar, Box, Circle, Flex, Icon, Text, VStack } from "@chakra-ui/react";
import { LuPencil, LuUser } from "react-icons/lu";
import { MdPets } from "react-icons/md";
import type { IconType } from "react-icons";

import type { InfoTab } from "./profile.type";

function MenuItem({
    icon,
    label,
    active,
    onClick,
}: {
    icon: IconType;
    label: string;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <Flex
            as="button"
            align="center"
            gap="7px"
            cursor="pointer"
            userSelect="none"
            onClick={onClick}
            color={active ? "BlueText" : "GreyText"}
            transition="color 0.15s ease"
            _hover={{ color: "BlueText" }}
        >
            <Icon as={icon} boxSize="24px" />
            <Text fontSize="18px" fontWeight="600" whiteSpace="nowrap">
                {label}
            </Text>
        </Flex>
    );
}

export default function ProfileSummaryCard({
    name,
    imageURL,
    activeTab,
    onTabChange,
}: {
    name: string;
    imageURL: string;
    activeTab: InfoTab;
    onTabChange: (tab: InfoTab) => void;
}) {
    return (
        <VStack
            bg="white"
            borderRadius="16px"
            px="32px"
            py="32px"
            gap="24px"
            justify="center"
            flex={{ base: "none", lg: "1 1 0" }}
            minW={{ base: "auto", lg: "300px" }}
        >
            <Box position="relative">
                <Avatar.Root boxSize="162px">
                    <Avatar.Fallback name={name} />
                    <Avatar.Image src={imageURL} />
                </Avatar.Root>
                {/* TODO: open a file picker and upload once an avatar endpoint
                    exists — the backend only reads user_imageAddress today. */}
                <Circle
                    position="absolute"
                    right="6px"
                    bottom="6px"
                    size="32px"
                    bg="Blue"
                    color="white"
                    borderWidth="2px"
                    borderColor="white"
                >
                    <Icon as={LuPencil} boxSize="14px" />
                </Circle>
            </Box>

            <Text fontSize="24px" fontWeight="600" color="Grey" textAlign="center">
                {name}
            </Text>

            <VStack align="flex-start" gap="20px" w="100%">
                <MenuItem
                    icon={LuUser}
                    label="Personal Information"
                    active={activeTab === "personal"}
                    onClick={() => onTabChange("personal")}
                />
                <MenuItem
                    icon={MdPets}
                    label="Pet Preferences"
                    active={activeTab === "preferences"}
                    onClick={() => onTabChange("preferences")}
                />
            </VStack>
        </VStack>
    );
}
