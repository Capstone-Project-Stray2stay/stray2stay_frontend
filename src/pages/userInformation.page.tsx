import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Dialog, Flex, Portal, Text, VStack } from "@chakra-ui/react";

import { S2SPageTitle, S2SButton } from "../components/S2S.components";

import { useLogout, useNewUserStatus, useUpdateNewUserStatus } from "../hooks/query/auth.query";
import { useAppDispatch } from "../hooks/redux";
import { setAuth } from "../store/slices/authSlices";
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
    const { personalInfo, preferences, loading: userInfoLoading } = useUserInfo();
    const { userStatus, loading: statusLoading } = useNewUserStatus();

    if (userInfoLoading || statusLoading) return <Box />;

    return (
        <UserInformationForm
            initialPersonalInfo={personalInfo ?? EMPTY_PERSONAL_INFO}
            initialPreferences={preferences ?? []}
            requiresPdpaConsent={userStatus}
        />
    );
}

function UserInformationForm({
    initialPersonalInfo,
    initialPreferences,
    requiresPdpaConsent,
}: {
    initialPersonalInfo: PersonalInfoDraft;
    initialPreferences: PetPreferenceDraft[];
    requiresPdpaConsent: boolean;
}) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { mutateAsync: logout } = useLogout();

    const [personalInfo, setPersonalInfo] = useState<PersonalInfoDraft>(initialPersonalInfo);
    const [preferences, setPreferences] = useState<PetPreferenceDraft[]>(initialPreferences);
    const [showIncompleteWarning, setShowIncompleteWarning] = useState(false);
    const [showPdpaNotice, setShowPdpaNotice] = useState(requiresPdpaConsent);
    const [isDecliningConsent, setIsDecliningConsent] = useState(false);
    const [resolvingLocation, setResolvingLocation] = useState(false);
    const [saveError, setSaveError] = useState("");
    const pdpaContentRef = useRef<HTMLDivElement>(null);

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

            <Dialog.Root
                open={showPdpaNotice}
                onOpenChange={() => undefined}
                closeOnEscape={false}
                closeOnInteractOutside={false}
                placement="center"
                // Focus the card itself on open; otherwise the first button (Decline) gets a focus ring
                initialFocusEl={() => pdpaContentRef.current}
            >
                <Portal>
                    <Dialog.Backdrop bg="blackAlpha.500" />
                    <Dialog.Positioner px={4}>
                        {/* Figma PDPA notice: 750px card, 32px padding and 32px gaps, 24px radius.
                            Text boxes are Figma "auto" line height, hence lineHeight="normal". */}
                        <Dialog.Content
                            ref={pdpaContentRef}
                            outline="none"
                            maxW="750px"
                            maxH="90vh"
                            overflowY="auto"
                            borderRadius="24px"
                            p="0"
                        >
                            <VStack align="stretch" gap={{ base: "24px", md: "32px" }} p={{ base: "24px", md: "32px" }} lineHeight="normal">
                                <VStack align="stretch" gap="16px">
                                    <VStack align="stretch" gap="12px">
                                        <Dialog.Title fontSize="24" fontWeight="600" lineHeight="normal" color="Grey" textAlign="center">
                                            Personal Data Protection Notice
                                        </Dialog.Title>
                                        <Text fontSize="18" fontWeight="400" letterSpacing="0.54px" color="GreyText" textAlign="center">
                                            Please review how Stray2Stay uses your personal data before continuing.
                                        </Text>
                                    </VStack>
                                    <Box h="2px" bg="SkyBlue" />
                                </VStack>

                                {/* Figma separates the paragraphs with a blank line */}
                                <Text fontSize="18" fontWeight="400" letterSpacing="0.54px" color="GreyText">
                                    We collect the information you provide, such as your name, email address,
                                    phone number, home address, and pet preferences. We use it to create and
                                    manage your account, contact you, and provide Stray2Stay adoption and
                                    rehoming services.
                                    <br />
                                    <br />
                                    Information relevant to an adoption or rehoming interaction may be used to
                                    connect the people involved. We retain and protect personal data in line
                                    with our applicable privacy practices and legal obligations.
                                    <br />
                                    <br />
                                    You may request access to or correction of your personal data, or withdraw
                                    your consent, by contacting Stray2Stay support.
                                </Text>

                                <Text fontSize="18" fontWeight="500" color="Grey">
                                    You must accept this notice to continue setting up your account. If you
                                    decline, you will be signed out and will not be able to use the services.
                                </Text>

                                <Flex direction={{ base: "column-reverse", sm: "row" }} gap={{ base: "12px", sm: "24px" }} justify="flex-end">
                                    {/* Figma "LargeShort" buttons: 16/12 padding, 120px min, 20/600 text */}
                                    <S2SButton
                                        text="Decline and log out"
                                        variant="outline"
                                        bgColor="BlueText"
                                        size="lgShort"
                                        // Figma: 12 + 24 (20px text line) + 12
                                        height="48px"
                                        disabled={isDecliningConsent}
                                        loading={isDecliningConsent}
                                        onClick={handleDeclineConsent}
                                    />
                                    <S2SButton
                                        text="Accept and continue"
                                        bgColor="Blue"
                                        size="lgShort"
                                        height="48px"
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
                {/* Figma: 788px form (128px in from each side of the 1043px content) */}
                <VStack mt={{ base: "64px", md: 0 }} gap="80px" align="stretch" w="100%" maxW="788px">
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
