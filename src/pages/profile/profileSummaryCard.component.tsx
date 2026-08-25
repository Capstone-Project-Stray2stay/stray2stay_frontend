import { useRef } from "react";
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
            <Text fontSize={{base: "16px", md: "18px"}} fontWeight="600" whiteSpace="nowrap">
                {label}
            </Text>
        </Flex>
    );
}

export default function ProfileSummaryCard({
    name,
    imageURL,
    onImageChange,
    activeTab,
    onTabChange,
}: {
    name: string;
    imageURL: string;
    onImageChange: (file: File) => void;
    activeTab: InfoTab;
    onTabChange: (tab: InfoTab) => void;
}) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) onImageChange(file);
        // Reset so picking the same file again still fires onChange.
        e.target.value = "";
    };

    return (
        <VStack
            bg="white"
            borderRadius="16px"
            gap={{base: "20px", md:"24px"}}
            justify={{base: "start", md: "center"}}
            flex={{ base: "none", lg: "3 1 0" }}
            p={{ base: "15px", md: "20px" }}
            minW={{ base: "auto", lg: "300px" }}
            flexDirection={{ base: "row", md: "column" }}
        >
            <Flex position="relative">
                <Avatar.Root boxSize={{base: "80px", md: "162px"}}>
                    <Avatar.Fallback name={name} fontSize={"36px"} />
                    <Avatar.Image src={imageURL} />
                </Avatar.Root>
                <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    onChange={handleFileSelected}
                />
                <Circle
                    as="button"
                    onClick={() => fileInputRef.current?.click()}
                    position="absolute"
                    right={{base: "-6px", md: "6px"}}
                    bottom={{base: "-6px", md: "6px"}}
                    size="32px"
                    bg="Blue"
                    color="white"
                    borderWidth="2px"
                    borderColor="white"
                    cursor="pointer"
                >
                    <Icon as={LuPencil} boxSize="14px" />
                </Circle>
            </Flex>
            <Box>
                <Text fontSize={{base: "18px", md: "24px"}} fontWeight="600" color="Grey" textAlign={{base: "left", md: "center"}}>
                    {name}
                </Text>

                <VStack align="flex-start" gap="10px" w="100%" pt="20px">
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
            </Box>
        </VStack>
    );
}
