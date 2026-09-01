import { useState } from "react";
import { Box, Flex, VStack } from "@chakra-ui/react";

import { S2SPageTitle } from "../components/S2S.components";
import { useUpdateUser, useUpdateUserImage, useUserInfo } from "../hooks/query/user.query";
import { useMyAdoptionRequests, useMyPets } from "../hooks/query/pet.query";
import { geocodeAddressAPI } from "../services/apis/address.api";

import { joinAddress, joinAddressForGeocode } from "../utils/address.util";
import { EMPTY_PERSONAL_INFO, EMPTY_PET_PREFERENCE } from "../types/profile.type";
import type {
    AdoptedPet,
    AdoptionStatus,
    InfoTab,
    ListTab,
    PersonalInfoDraft,
    PetPreferenceDraft,
    RehomingPet,
} from "../types/profile.type";

import ProfileSummaryCard from "../components/profile/profileSummaryCard.component";
import PersonalInfoForm from "../components/profile/personalInfoForm.component";
import PetPreferencesForm from "../components/profile/petPreferencesForm.component";
import ListTabs from "../components/profile/listTabs.component";
import MyRehomingList from "../components/profile/myRehomingList.component";
import MyAdoptionsList from "../components/profile/myAdoptionsList.component";

/**
 * Waits on GET /user/info before mounting the page proper so its local draft
 * state can initialize straight from the real values, instead of syncing them
 * in after the fact via an effect.
 */
export default function Profile() {
    const { personalInfo, dogPreference, catPreference, imageURL, loading } = useUserInfo();

    if (loading) return <Box></Box>;

    return (
        <ProfileContent
            initialPersonalInfo={personalInfo ?? EMPTY_PERSONAL_INFO}
            initialDogPreference={dogPreference ?? EMPTY_PET_PREFERENCE}
            initialCatPreference={catPreference ?? EMPTY_PET_PREFERENCE}
            initialImageURL={imageURL ?? ""}
        />
    );
}

function ProfileContent({
    initialPersonalInfo,
    initialDogPreference,
    initialCatPreference,
    initialImageURL,
}: {
    initialPersonalInfo: PersonalInfoDraft;
    initialDogPreference: PetPreferenceDraft;
    initialCatPreference: PetPreferenceDraft;
    initialImageURL: string;
}) {
    // The two tab rows are independent: switching the list at the bottom must
    // not reset which form the left card is showing, or vice versa.
    const [infoTab, setInfoTab] = useState<InfoTab>("personal");
    const [listTab, setListTab] = useState<ListTab>("rehoming");

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
    const [dogPreference, setDogPreference] = useState<PetPreferenceDraft>(initialDogPreference);
    const [catPreference, setCatPreference] = useState<PetPreferenceDraft>(initialCatPreference);
    const [imageURL, setImageURL] = useState<string>(initialImageURL);

    const patchPersonal = (patch: Partial<PersonalInfoDraft>) =>
        setPersonalInfo((current) => ({ ...current, ...patch }));

    // Both tabs start read-only; each header's pencil button switches its own
    // tab into edit mode and turns into a checkmark. PUT /user/update always
    // takes the whole profile at once (not a partial patch), so both
    // checkmarks submit via the same helper — the current draft of
    // everything, personal info and both species' preferences together —
    // and only differ in which tab's edit state they drop back out of on
    // success.
    const [isEditingPersonal, setIsEditingPersonal] = useState(false);
    const [isEditingPreferences, setIsEditingPreferences] = useState(false);
    const [resolvingLocation, setResolvingLocation] = useState(false);
    const updateUserMutation = useUpdateUser();

    const handleSaveProfile = async (onSuccess: () => void) => {
        const address = joinAddress(personalInfo);

        // Same fallback as the User Information page's Finish: most picked
        // sub-districts already carry coordinates, only the rest need a
        // geocode call. Needed even when only Pet Preferences changed, since
        // the backend requires non-zero lat/long on every update.
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
            { onSuccess }
        );
    };

    const updateUserImage = useUpdateUserImage();
    const handleImageChange = async (file: File) => {
        // Optimistic preview while the upload is in flight; replaced by the
        // Cloudinary URL that GET /user/info returns once the mutation settles.
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
                <Flex gap="32px" width={"100%"} direction={{ base: "column", lg: "row" }}>
                    <ProfileSummaryCard
                        name={`${personalInfo.firstName} ${personalInfo.lastName}`.trim()}
                        imageURL={imageURL}
                        onImageChange={handleImageChange}
                        activeTab={infoTab}
                        onTabChange={setInfoTab}
                    />

                    {infoTab === "personal" ? (
                        <PersonalInfoForm
                            value={personalInfo}
                            onChange={patchPersonal}
                            isEditing={isEditingPersonal}
                            saving={resolvingLocation || updateUserMutation.isPending}
                            onToggleEdit={() => setIsEditingPersonal(true)}
                            onSave={() => handleSaveProfile(() => setIsEditingPersonal(false))}
                        />
                    ) : (
                        <PetPreferencesForm
                            dog={dogPreference}
                            cat={catPreference}
                            onDogChange={(patch) =>
                                setDogPreference((current) => ({ ...current, ...patch }))
                            }
                            onCatChange={(patch) =>
                                setCatPreference((current) => ({ ...current, ...patch }))
                            }
                            isEditing={isEditingPreferences}
                            saving={resolvingLocation || updateUserMutation.isPending}
                            onToggleEdit={() => setIsEditingPreferences(true)}
                            onSave={() => handleSaveProfile(() => setIsEditingPreferences(false))}
                        />
                    )}
                </Flex>

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
                        <MyRehomingList pets={rehomingPets} />
                    ) : (
                        <MyAdoptionsList pets={adoptedPets} />
                    )}
                </VStack>
            </VStack>
        </Box>
    );
}
