import { S2SCardShell } from "../../components/S2S.components";

import PetPreferencesFields from "./petPreferencesFields.component";
import type { PetPreferenceDraft } from "./profile.type";

/** The Profile page's railed card around the shared Pet Preferences fields. */
export default function PetPreferencesForm({
    dog,
    cat,
    onDogChange,
    onCatChange,
}: {
    dog: PetPreferenceDraft;
    cat: PetPreferenceDraft;
    onDogChange: (patch: Partial<PetPreferenceDraft>) => void;
    onCatChange: (patch: Partial<PetPreferenceDraft>) => void;
}) {
    return (
        <S2SCardShell
            railColor="Cream"
            bg="white"
            flex={{ base: "none", lg: "7 1 0" }}
            minW={0}
            py="32px"
            px={{ base: "36px", md: "48px" }}
            align="flex-start"
        >
            <PetPreferencesFields
                dog={dog}
                cat={cat}
                onDogChange={onDogChange}
                onCatChange={onCatChange}
            />
        </S2SCardShell>
    );
}
