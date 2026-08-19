import { S2SCardShell } from "../../components/S2S.components";

import PersonalInfoFields from "./personalInfoFields.component";
import type { PersonalInfoDraft } from "./profile.type";

/** The Profile page's railed card around the shared Personal Information fields. */
export default function PersonalInfoForm({
    value,
    onChange,
}: {
    value: PersonalInfoDraft;
    onChange: (patch: Partial<PersonalInfoDraft>) => void;
}) {
    return (
        <S2SCardShell
            railColor="SkyBlue"
            bg="white"
            flex={{ base: "none", lg: "2 1 0" }}
            minW={0}
            py="32px"
            px="48px"
            // +14px so the content clears the rail, matching the diary cards.
            pl="62px"
            align="flex-start"
        >
            <PersonalInfoFields value={value} onChange={onChange} />
        </S2SCardShell>
    );
}
