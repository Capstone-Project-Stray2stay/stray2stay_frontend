import { useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { Box, Text, VStack } from "@chakra-ui/react";

import { S2SPageTitle } from "../components/S2S.components";
import { useUpdateUser, useUpdateUserImage, useUserInfo } from "../hooks/query/user.query";
import { useMyAdoptionRequests, useMyPets } from "../hooks/query/pet.query";
import { geocodeAddressAPI } from "../services/apis/address.api";

import { joinAddress, joinAddressForGeocode } from "../utils/address.util";
import { serverMessage } from "../utils/error.util";
import { toPreferencePayload } from "../services/apis/user.api";
import { EMPTY_PERSONAL_INFO } from "../types/profile.type";
import type {
    AdoptedPet,
    AdoptionStatus,
    ListTab,
    PersonalInfoDraft,
    PetPreferenceDraft,
    RehomingPet,
} from "../types/profile.type";

import ProfileInfoCard from "../components/profile/profileInfoCard.component";
import PetPreferencesDialog from "../components/profile/petPreferencesDialog.component";
import ListTabs from "../components/profile/listTabs.component";
import MyRehomingList from "../components/profile/myRehomingList.component";
import MyAdoptionsList from "../components/profile/myAdoptionsList.component";
import { personalInfoSchema } from "../validators/profile.validator";

export default function Profile() {
    const { personalInfo, preferences, imageURL, loading } = useUserInfo();

    if (loading) return <Box></Box>;

    return (
        <ProfileContent
            initialPersonalInfo={personalInfo ?? EMPTY_PERSONAL_INFO}
            initialPreferences={preferences ?? []}
            initialImageURL={imageURL ?? ""}
        />
    );
}

function ProfileContent({
    initialPersonalInfo,
    initialPreferences,
    initialImageURL,
}: {
    initialPersonalInfo: PersonalInfoDraft;
    initialPreferences: PetPreferenceDraft[];
    initialImageURL: string;
}) {
    // The list tab and the pet to open live in the URL, so a notification can link
    // straight to them (/profile?tab=rehoming&pet=12) even while already on this page
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    const listTab: ListTab = searchParams.get("tab") === "adoptions" ? "adoptions" : "rehoming";
    const setListTab = (tab: ListTab) => setSearchParams({ tab }, { replace: true });
    // location.key changes on every navigation, so clicking the same notification
    // twice re-opens the row even though the URL stays the same
    const focusPet = searchParams.get("pet")
        ? { id: searchParams.get("pet") as string, token: location.key }
        : null;

    const { myPets } = useMyPets();
    const rehomingPets: RehomingPet[] = myPets.map((pet) => ({
        id: String(pet.pid),
        name: pet.petName || "Unnamed",
        imageURL: pet.petImageAddress?.[0] ?? "",
    }));

    const REHOME_STATUS_MAP: Record<string, AdoptionStatus> = {
        PENDING: "pending",
        ACCEPT: "success",
        DENIED: "denied",
    };
    const { adoptionRequests } = useMyAdoptionRequests();
    const adoptedPets: AdoptedPet[] = adoptionRequests.map((request) => ({
        id: String(request.pid),
        rid: request.rid,
        name: request.petName || "Unnamed",
        phone: request.ownerPhone,
        imageURL: request.petImageAddress?.[0] ?? "",
        status: REHOME_STATUS_MAP[request.rehomeStatus] ?? "pending",
    }));

    const [personalInfo, setPersonalInfo] = useState<PersonalInfoDraft>(initialPersonalInfo);
    const [preferences, setPreferences] = useState<PetPreferenceDraft[]>(initialPreferences);
    const [imageURL, setImageURL] = useState<string>(initialImageURL);

    const patchPersonal = (patch: Partial<PersonalInfoDraft>) =>
        setPersonalInfo((current) => ({ ...current, ...patch }));

    const [isEditingPersonal, setIsEditingPersonal] = useState(false);
    const [showPreferences, setShowPreferences] = useState(false);
    const [resolvingLocation, setResolvingLocation] = useState(false);
    const [personalInfoError, setPersonalInfoError] = useState("");
    const [preferencesError, setPreferencesError] = useState("");
    const updateUserMutation = useUpdateUser();
    const saving = resolvingLocation || updateUserMutation.isPending;

    // The update endpoint takes the whole profile, so both the personal info card
    // and the preferences popup save through here
    const saveProfile = async ({
        nextPreferences,
        onSuccess,
        onError,
    }: {
        nextPreferences: PetPreferenceDraft[];
        onSuccess: () => void;
        onError: (message: string) => void;
    }) => {
        const parsed = personalInfoSchema.safeParse(personalInfo);
        if (!parsed.success) {
            onError(parsed.error.issues[0]?.message ?? "Please check your information");
            return;
        }
        onError("");

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
                preferences: toPreferencePayload(nextPreferences),
            },
            {
                onSuccess,
                onError: (error) => onError(`Couldn't save your profile: ${serverMessage(error)}`),
            }
        );
    };

    const updateUserImage = useUpdateUserImage();
    const handleImageChange = async (file: File) => {
        const previewURL = URL.createObjectURL(file);
        setImageURL(previewURL);

        try {
            const res = await updateUserImage.mutateAsync(file);
            setImageURL(res.data.imageAddress);
        } finally {
            URL.revokeObjectURL(previewURL);
        }
    };

    return (
        <Box width="100%" px={{ base: "30px", md: "9%"}}>
            <S2SPageTitle title="Profile" />
            <VStack gap="64px" align="stretch">
                <VStack gap="12px" align="stretch">
                    <ProfileInfoCard
                        name={`${personalInfo.firstName} ${personalInfo.lastName}`.trim()}
                        imageURL={imageURL}
                        onImageChange={handleImageChange}
                        personalInfo={personalInfo}
                        onPersonalInfoChange={patchPersonal}
                        isEditing={isEditingPersonal}
                        saving={saving && !showPreferences}
                        onEdit={() => setIsEditingPersonal(true)}
                        onSave={() =>
                            saveProfile({
                                nextPreferences: preferences,
                                onSuccess: () => setIsEditingPersonal(false),
                                onError: setPersonalInfoError,
                            })
                        }
                        onEditPreferences={() => {
                            setPreferencesError("");
                            setShowPreferences(true);
                        }}
                    />

                    {personalInfoError && (
                        <Text fontSize="14" color="red.500">
                            {personalInfoError}
                        </Text>
                    )}
                </VStack>

                <VStack
                    bg="white"
                    borderRadius="16px"
                    px={{ base: "24px", md: "48px" }}
                    py="32px"
                    gap="32px"
                    align="stretch"
                >
                    <ListTabs value={listTab} onChange={setListTab} />

                    {listTab === "rehoming" ? (
                        <MyRehomingList pets={rehomingPets} focusPet={focusPet} />
                    ) : (
                        <MyAdoptionsList pets={adoptedPets} />
                    )}
                </VStack>
            </VStack>

            {showPreferences && (
                <PetPreferencesDialog
                    initialPreferences={preferences}
                    saving={saving}
                    error={preferencesError}
                    onCancel={() => setShowPreferences(false)}
                    onFinish={(nextPreferences) =>
                        saveProfile({
                            nextPreferences,
                            onSuccess: () => {
                                setPreferences(nextPreferences);
                                setShowPreferences(false);
                            },
                            onError: setPreferencesError,
                        })
                    }
                />
            )}
        </Box>
    );
}
