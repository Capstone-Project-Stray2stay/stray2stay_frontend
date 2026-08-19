import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, VStack } from "@chakra-ui/react";

import { S2SPageTitle, S2SButton } from "../components/S2S.components";

import {
    mockCatPreference,
    mockDogPreference,
    mockPersonalInfo,
} from "./profile/mockProfile";
import type { PersonalInfoDraft, PetPreferenceDraft } from "./profile/profile.type";

import PersonalInfoFields from "./profile/personalInfoFields.component";
import PetPreferencesFields from "./profile/petPreferencesFields.component";

/**
 * The one-time setup a new user walks through. Same two forms as the Profile
 * page, but bare in a centred column instead of inside railed cards, and
 * closed off with Finish rather than living under tabs.
 */
export default function UserInformation() {
    const navigate = useNavigate();

    const [personalInfo, setPersonalInfo] = useState<PersonalInfoDraft>({
        ...mockPersonalInfo,
        // A brand-new account has a name from registration but nothing else.
        phone: "",
    });
    const [dogPreference, setDogPreference] = useState<PetPreferenceDraft>(mockDogPreference);
    const [catPreference, setCatPreference] = useState<PetPreferenceDraft>(mockCatPreference);

    /**
     * TODO: submit before leaving — PUT /user/update with the form, then
     * PUT /user/status (updateNewUserStatusAPI) to clear the new-user flag so
     * this page stops being shown. Neither is wired up while this is a mock;
     * note also that /user/update currently drops pet preferences on the floor
     * (see mysql_user_adapter.go UpdateUserInfo).
     */
    const handleFinish = () => navigate("/");

    return (
        <Box width={{ base: "100%", md: "80vw" }} pb="64px">
            <S2SPageTitle title="User Information" />

            <Flex justify="center" w="100%">
                <VStack mt="64px" gap="80px" align="stretch" w="100%" maxW="596px">
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
                            onClick={handleFinish}
                        />
                    </Flex>
                </VStack>
            </Flex>
        </Box>
    );
}
