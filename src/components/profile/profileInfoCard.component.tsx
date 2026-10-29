import { useRef } from "react";
import { Avatar, Box, Flex, Icon, IconButton, Text, VStack } from "@chakra-ui/react";
import { LuPencil } from "react-icons/lu";
import { MdPets } from "react-icons/md";

import { S2SButton, S2SCardShell } from "../S2S.components";

import EditSaveButton from "./editSaveButton.component";
import PersonalInfoFields from "./personalInfoFields.component";
import type { PersonalInfoDraft } from "../../types/profile.type";

/**
 * Figma profile card: photo, name and "Edit Pet Preferences" on the left,
 * the Personal Information form (with its pencil / check button) on the right.
 */
export default function ProfileInfoCard({
    name,
    imageURL,
    onImageChange,
    personalInfo,
    onPersonalInfoChange,
    isEditing,
    saving,
    onEdit,
    onSave,
    onEditPreferences,
}: {
    name: string;
    imageURL: string;
    onImageChange: (file: File) => void;
    personalInfo: PersonalInfoDraft;
    onPersonalInfoChange: (patch: Partial<PersonalInfoDraft>) => void;
    isEditing: boolean;
    saving: boolean;
    onEdit: () => void;
    onSave: () => void;
    onEditPreferences: () => void;
}) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) onImageChange(file);
        e.target.value = "";
    };

    return (
        <S2SCardShell
            railColor="SkyBlue"
            bg="white"
            direction={{ base: "column", md: "row" }}
            align={{ base: "stretch", md: "flex-start" }}
            gap={{ base: "32px", md: "64px" }}
            pl={{ base: "32px", md: "48px" }}
            pr={{ base: "24px", md: "48px" }}
            py={{ base: "32px", md: "40px" }}
        >
            <VStack gap="24px" align="center" flexShrink={0}>
                <VStack gap="12px" px="32px">
                    <Box position="relative" boxSize={{ base: "120px", md: "162px" }}>
                        <Avatar.Root boxSize="100%">
                            <Avatar.Fallback name={name} fontSize="36" />
                            <Avatar.Image src={imageURL} />
                        </Avatar.Root>
                        <input
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            ref={fileInputRef}
                            onChange={handleFileSelected}
                        />
                        <IconButton
                            aria-label="Change profile photo"
                            onClick={() => fileInputRef.current?.click()}
                            position="absolute"
                            right="0"
                            bottom="0"
                            boxSize="38px"
                            minW="unset"
                            p="0"
                            rounded="full"
                            bg="white"
                            borderWidth="1.36px"
                            borderColor="Blue"
                            color="Blue"
                            _hover={{ bg: "White_hover" }}
                        >
                            <Icon as={LuPencil} boxSize="20px" />
                        </IconButton>
                    </Box>
                    <Text fontSize={{ base: "20", md: "24" }} fontWeight="600" color="Grey" textAlign="center">
                        {name}
                    </Text>
                </VStack>

                <S2SButton
                    text="Edit Pet Preferences"
                    variant="outline"
                    bgColor="BlueText"
                    size="sm"
                    icon={<MdPets />}
                    onClick={onEditPreferences}
                />
            </VStack>

            <Flex flex="1" minW={0}>
                <PersonalInfoFields
                    value={personalInfo}
                    onChange={onPersonalInfoChange}
                    disabled={!isEditing}
                    headerAction={
                        <EditSaveButton
                            label="personal information"
                            isEditing={isEditing}
                            saving={saving}
                            onToggleEdit={onEdit}
                            onSave={onSave}
                        />
                    }
                />
            </Flex>
        </S2SCardShell>
    );
}
