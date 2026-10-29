import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Dialog, Flex, Portal, Text, VStack } from "@chakra-ui/react";

import { S2SPageTitle, S2SButton } from "../components/S2S.components";

import { useUpdateNewUserStatus } from "../hooks/query/auth.query";
import { useUpdateUser, useUserInfo } from "../hooks/query/user.query";
import { geocodeAddressAPI } from "../services/apis/address.api";

import { joinAddress, joinAddressForGeocode } from "../utils/address.util";
import { serverMessage } from "../utils/error.util";
import { toPreferencePayload } from "../services/apis/user.api";
import { EMPTY_PERSONAL_INFO } from "../types/profile.type";
import type { PersonalInfoDraft, PetPreferenceDraft } from "../types/profile.type";

import PersonalInfoFields from "../components/profile/personalInfoFields.component";
import PetPreferencesFields from "../components/profile/petPreferencesFields.component";
import { personalInfoSchema } from "../validators/profile.validator";

export default function UserInformation() {
    const { personalInfo, preferences, loading } = useUserInfo();

    if (loading) return <Box></Box>;

    return (
        <UserInformationForm
            initialPersonalInfo={personalInfo ?? EMPTY_PERSONAL_INFO}
            initialPreferences={preferences ?? []}
        />
    );
}

function UserInformationForm({
    initialPersonalInfo,
    initialPreferences,
}: {
    initialPersonalInfo: PersonalInfoDraft;
    initialPreferences: PetPreferenceDraft[];
}) {
    const navigate = useNavigate();

    const [personalInfo, setPersonalInfo] = useState<PersonalInfoDraft>(initialPersonalInfo);
    const [preferences, setPreferences] = useState<PetPreferenceDraft[]>(initialPreferences);
    const [showIncompleteWarning, setShowIncompleteWarning] = useState(false);
    const [resolvingLocation, setResolvingLocation] = useState(false);
    const [saveError, setSaveError] = useState("");

    const updateUserMutation = useUpdateUser();
    const updateNewUserStatusMutation = useUpdateNewUserStatus();

    const handleFinish = async () => {
        if (!personalInfoSchema.safeParse(personalInfo).success) {
            setShowIncompleteWarning(true);
            return;
        }
        setSaveError("");
        const onError = (error: unknown) => setSaveError(`Couldn't save your information: ${serverMessage(error)}`);

        const address = joinAddress(personalInfo);

        let { lat, long } = personalInfo;
        if (lat === null || long === null) {
            setResolvingLocation(true);
            const geocoded = await geocodeAddressAPI(joinAddressForGeocode(personalInfo)).catch(() => null);
            setResolvingLocation(false);
            lat = geocoded?.lat ?? 0;
            long = geocoded?.long ?? 0;
        }
        updateUserMutation.mutate(
            {
                firstName: personalInfo.firstName,
                lastName: personalInfo.lastName,
                phoneNumber: personalInfo.phone,
                address,
                addressLat: lat,
                addressLong: long,
                preferences: toPreferencePayload(preferences),
            },
            {
                onSuccess: () => {
                    updateNewUserStatusMutation.mutate(undefined, {
                        onSuccess: () => navigate("/"),
                        onError,
                    });
                },
                onError,
            }
        );
    };

    return (
        <Box width="100%" pb="64px" px={{ base: "30px", md: "9%"}}>
            <S2SPageTitle title="User Information" />

            <Flex justify="center" w="100%">
                {/* Figma: 788px form (128px in from each side of the 1043px content) */}
                <VStack mt="64px" gap="80px" align="stretch" w="100%" maxW="788px">
                    <VStack gap="48px" align="stretch">
                        <PersonalInfoFields
                            value={personalInfo}
                            onChange={(patch) =>
                                setPersonalInfo((current) => ({ ...current, ...patch }))
                            }
                        />

                        <PetPreferencesFields preferences={preferences} onChange={setPreferences} />
                    </VStack>

                    <Flex justify="flex-end" align="center" gap="16px">
                        {saveError && (
                            <Text fontSize="14" color="red.500" textAlign="right">
                                {saveError}
                            </Text>
                        )}
                        <S2SButton
                            text="Finish"
                            width="140px"
                            height="44px"
                            fontSize="20"
                            loading={resolvingLocation || updateUserMutation.isPending || updateNewUserStatusMutation.isPending}
                            onClick={handleFinish}
                        />
                    </Flex>
                </VStack>
            </Flex>

            <Dialog.Root
                open={showIncompleteWarning}
                onOpenChange={(e) => setShowIncompleteWarning(e.open)}
                placement="center"
            >
                <Portal>
                    <Dialog.Backdrop bg="blackAlpha.400" />
                    <Dialog.Positioner>
                        <Dialog.Content maxW="380px" borderRadius="30px" p="0">
                            <VStack pt="40px" pb="32px" px="32px" gap="16px" align="center">
                                <Text fontSize="20" fontWeight="600" color="Grey" textAlign="center">
                                    Please fill in your information
                                </Text>
                                <Text fontSize="14" color="GreyText" textAlign="center">
                                    All personal details, including your address, are required before you can continue.
                                </Text>
                                <S2SButton
                                    text="Got it"
                                    bgColor="Blue"
                                    width="140px"
                                    onClick={() => setShowIncompleteWarning(false)}
                                />
                            </VStack>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
        </Box>
    );
}
