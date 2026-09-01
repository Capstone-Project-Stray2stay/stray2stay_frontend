import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Dialog, Flex, Portal, Text, VStack } from "@chakra-ui/react";

import { S2SPageTitle, S2SButton } from "../components/S2S.components";

import { useUpdateNewUserStatus } from "../hooks/query/auth.query";
import { useUpdateUser, useUserInfo } from "../hooks/query/user.query";
import { geocodeAddressAPI } from "../services/apis/address.api";

import { joinAddress, joinAddressForGeocode } from "../utils/address.util";
import { EMPTY_PERSONAL_INFO, EMPTY_PET_PREFERENCE } from "../types/profile.type";
import type { PersonalInfoDraft, PetPreferenceDraft } from "../types/profile.type";

import PersonalInfoFields from "../components/profile/personalInfoFields.component";
import PetPreferencesFields from "../components/profile/petPreferencesFields.component";

const isPersonalInfoComplete = (info: PersonalInfoDraft) =>
    info.firstName.trim() !== "" &&
    info.lastName.trim() !== "" &&
    info.phone.trim() !== "" &&
    info.state.trim() !== "" &&
    info.district.trim() !== "" &&
    info.subDistrict.trim() !== "" &&
    info.street.trim() !== "";

export default function UserInformation() {
    const { personalInfo, loading } = useUserInfo();

    if (loading) return <Box></Box>;

    return <UserInformationForm initialPersonalInfo={personalInfo ?? EMPTY_PERSONAL_INFO} />;
}

function UserInformationForm({ initialPersonalInfo }: { initialPersonalInfo: PersonalInfoDraft }) {
    const navigate = useNavigate();

    const [personalInfo, setPersonalInfo] = useState<PersonalInfoDraft>(initialPersonalInfo);
    const [dogPreference, setDogPreference] = useState<PetPreferenceDraft>(EMPTY_PET_PREFERENCE);
    const [catPreference, setCatPreference] = useState<PetPreferenceDraft>(EMPTY_PET_PREFERENCE);
    const [showIncompleteWarning, setShowIncompleteWarning] = useState(false);
    const [resolvingLocation, setResolvingLocation] = useState(false);

    const updateUserMutation = useUpdateUser();
    const updateNewUserStatusMutation = useUpdateNewUserStatus();

    const handleFinish = async () => {
        if (!isPersonalInfoComplete(personalInfo)) {
            setShowIncompleteWarning(true);
            return;
        }

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
                dogBreed: dogPreference.breed,
                dogColor: dogPreference.color,
                dogAgeGroup: dogPreference.ageGroup,
                dogGender: dogPreference.gender,
                catBreed: catPreference.breed,
                catColor: catPreference.color,
                catAgeGroup: catPreference.ageGroup,
                catGender: catPreference.gender,
            },
            {
                onSuccess: () => {
                    updateNewUserStatusMutation.mutate(undefined, {
                        onSuccess: () => navigate("/"),
                    });
                },
            }
        );
    };

    return (
        <Box width="100%" pb="64px" px={{ base: "30px", md: "9%"}}>
            <S2SPageTitle title="User Information" />

            <Flex justify="center" w="100%">
                <VStack mt="64px" gap="80px" align="stretch" w="100%" maxW="628px">
                    <VStack gap="48px" align="stretch">
                        <PersonalInfoFields
                            value={personalInfo}
                            onChange={(patch) =>
                                setPersonalInfo((current) => ({ ...current, ...patch }))
                            }
                        />

                        <PetPreferencesFields
                            dog={dogPreference}
                            cat={catPreference}
                            onDogChange={(patch) =>
                                setDogPreference((current) => ({ ...current, ...patch }))
                            }
                            onCatChange={(patch) =>
                                setCatPreference((current) => ({ ...current, ...patch }))
                            }
                        />
                    </VStack>

                    <Flex justify="flex-end">
                        <S2SButton
                            text="Finish"
                            width="134px"
                            height="45px"
                            fontSize="20px"
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
                                <Text fontSize="20px" fontWeight="600" color="Grey" textAlign="center">
                                    Please fill in your information
                                </Text>
                                <Text fontSize="14px" color="GreyText" textAlign="center">
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
