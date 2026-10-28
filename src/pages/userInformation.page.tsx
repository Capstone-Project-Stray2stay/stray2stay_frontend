import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Dialog, Flex, Portal, Text, VStack } from "@chakra-ui/react";

import { S2SPageTitle, S2SButton } from "../components/S2S.components";

import { useLogout, useNewUserStatus, useUpdateNewUserStatus } from "../hooks/query/auth.query";
import { useAppDispatch } from "../hooks/redux";
import { setAuth } from "../store/slices/authSlices";
import { useUpdateUser, useUserInfo } from "../hooks/query/user.query";
import { geocodeAddressAPI } from "../services/apis/address.api";

import { joinAddress, joinAddressForGeocode } from "../utils/address.util";
import { EMPTY_PERSONAL_INFO, EMPTY_PET_PREFERENCE } from "../types/profile.type";
import type { PersonalInfoDraft, PetPreferenceDraft } from "../types/profile.type";

import PersonalInfoFields from "../components/profile/personalInfoFields.component";
import PetPreferencesFields from "../components/profile/petPreferencesFields.component";
import { personalInfoSchema } from "../validators/profile.validator";

export default function UserInformation() {
    const { personalInfo, loading: userInfoLoading } = useUserInfo();
    const { userStatus, loading: statusLoading } = useNewUserStatus();

    if (userInfoLoading || statusLoading) return <Box />;

    return (
        <UserInformationForm
            initialPersonalInfo={personalInfo ?? EMPTY_PERSONAL_INFO}
            requiresPdpaConsent={userStatus}
        />
    );
}

function UserInformationForm({
    initialPersonalInfo,
    requiresPdpaConsent,
}: {
    initialPersonalInfo: PersonalInfoDraft;
    requiresPdpaConsent: boolean;
}) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { mutateAsync: logout } = useLogout();

    const [personalInfo, setPersonalInfo] = useState<PersonalInfoDraft>(initialPersonalInfo);
    const [dogPreference, setDogPreference] = useState<PetPreferenceDraft>(EMPTY_PET_PREFERENCE);
    const [catPreference, setCatPreference] = useState<PetPreferenceDraft>(EMPTY_PET_PREFERENCE);
    const [showIncompleteWarning, setShowIncompleteWarning] = useState(false);
    const [showPdpaNotice, setShowPdpaNotice] = useState(requiresPdpaConsent);
    const [isDecliningConsent, setIsDecliningConsent] = useState(false);
    const [resolvingLocation, setResolvingLocation] = useState(false);

    const updateUserMutation = useUpdateUser();
    const updateNewUserStatusMutation = useUpdateNewUserStatus();

    const handleDeclineConsent = async () => {
        setIsDecliningConsent(true);
        try {
            await logout();
        } catch {
            // Keep the user on the signed-out path even if the logout request fails.
        } finally {
            dispatch(setAuth({ authorized: false, firstname: "", coverImage: null }));
            navigate("/login", { replace: true });
        }
    };

    const handleFinish = async () => {
        if (!personalInfoSchema.safeParse(personalInfo).success) {
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

            <Dialog.Root
                open={showPdpaNotice}
                onOpenChange={() => undefined}
                closeOnEscape={false}
                closeOnInteractOutside={false}
                placement="center"
            >
                <Portal>
                    <Dialog.Backdrop bg="blackAlpha.500" />
                    <Dialog.Positioner px={4}>
                        <Dialog.Content
                            maxW="560px"
                            maxH="90vh"
                            overflowY="auto"
                            borderRadius={{ base: "24px", md: "32px" }}
                            p="0"
                        >
                            <VStack align="stretch" gap={5} p={{ base: 6, md: 9 }}>
                                <VStack align="stretch" gap={2}>
                                    <Dialog.Title fontSize={{ base: "22px", md: "26px" }} color="Grey">
                                        Personal Data Protection Notice
                                    </Dialog.Title>
                                    <Text fontSize="sm" color="GreyText">
                                        Please review how Stray2Stay uses your personal data before continuing.
                                    </Text>
                                </VStack>

                                <Box h="2px" bg="SkyBlue" borderRadius="full" />

                                <VStack align="stretch" gap={4} color="GreyText" fontSize="sm" lineHeight="1.7">
                                    <Text>
                                        We collect the information you provide, such as your name, email address,
                                        phone number, home address, and pet preferences. We use it to create and
                                        manage your account, contact you, and provide Stray2Stay adoption and
                                        rehoming services.
                                    </Text>
                                    <Text>
                                        Information relevant to an adoption or rehoming interaction may be used to
                                        connect the people involved. We retain and protect personal data in line
                                        with our applicable privacy practices and legal obligations.
                                    </Text>
                                    <Text>
                                        You may request access to or correction of your personal data, or withdraw
                                        your consent, by contacting Stray2Stay support.
                                    </Text>
                                    <Text fontWeight="medium" color="Grey">
                                        You must accept this notice to continue setting up your account. If you
                                        decline, you will be signed out and will not be able to use the services.
                                    </Text>
                                </VStack>

                                <Flex direction={{ base: "column-reverse", sm: "row" }} gap={3} justify="flex-end">
                                    <S2SButton
                                        text="Decline and log out"
                                        variant="outline"
                                        width={{ base: "full", sm: "170px" }}
                                        height="44px"
                                        disabled={isDecliningConsent}
                                        loading={isDecliningConsent}
                                        onClick={handleDeclineConsent}
                                    />
                                    <S2SButton
                                        text="Accept and continue"
                                        width={{ base: "full", sm: "190px" }}
                                        height="44px"
                                        disabled={isDecliningConsent}
                                        onClick={() => setShowPdpaNotice(false)}
                                    />
                                </Flex>
                            </VStack>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>

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
