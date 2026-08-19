import { useState } from "react";
import { Box, Flex, VStack } from "@chakra-ui/react";

import { S2SPageTitle } from "../components/S2S.components";

import {
    mockAdoptedPets,
    mockCatPreference,
    mockDogPreference,
    mockPersonalInfo,
    mockRehomingPets,
} from "./profile/mockProfile";
import type {
    InfoTab,
    ListTab,
    PersonalInfoDraft,
    PetPreferenceDraft,
} from "./profile/profile.type";

import ProfileSummaryCard from "./profile/profileSummaryCard.component";
import PersonalInfoForm from "./profile/personalInfoForm.component";
import PetPreferencesForm from "./profile/petPreferencesForm.component";
import ListTabs from "./profile/listTabs.component";
import MyRehomingList from "./profile/myRehomingList.component";
import MyAdoptionsList from "./profile/myAdoptionsList.component";

export default function Profile() {
    // The two tab rows are independent: switching the list at the bottom must
    // not reset which form the left card is showing, or vice versa.
    const [infoTab, setInfoTab] = useState<InfoTab>("personal");
    const [listTab, setListTab] = useState<ListTab>("rehoming");

    const [personalInfo, setPersonalInfo] = useState<PersonalInfoDraft>(mockPersonalInfo);
    const [dogPreference, setDogPreference] = useState<PetPreferenceDraft>(mockDogPreference);
    const [catPreference, setCatPreference] = useState<PetPreferenceDraft>(mockCatPreference);

    // Both forms are kept mounted-by-value rather than saved: the mockups have
    // no Save control, so edits live in this state until PUT /user/update is
    // wired up.
    const patchPersonal = (patch: Partial<PersonalInfoDraft>) =>
        setPersonalInfo((current) => ({ ...current, ...patch }));

    return (
        <Box width={{ base: "100%", md: "80vw" }} pb="64px">
            <S2SPageTitle title="Profile" />

            <VStack mt="64px" gap="64px" align="stretch">
                <Flex gap="32px" align="stretch" direction={{ base: "column", lg: "row" }}>
                    <ProfileSummaryCard
                        name={`${personalInfo.firstName} ${personalInfo.lastName}`.trim()}
                        imageURL=""
                        activeTab={infoTab}
                        onTabChange={setInfoTab}
                    />

                    {infoTab === "personal" ? (
                        <PersonalInfoForm value={personalInfo} onChange={patchPersonal} />
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
                        <MyRehomingList pets={mockRehomingPets} />
                    ) : (
                        <MyAdoptionsList pets={mockAdoptedPets} />
                    )}
                </VStack>
            </VStack>
        </Box>
    );
}
