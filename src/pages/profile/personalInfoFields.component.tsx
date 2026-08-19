import { Box, Flex, Input, Text, VStack } from "@chakra-ui/react";

import { S2SDropDown } from "../../components/S2S.components";
import { detailDropDownStyle, detailInputStyle } from "../rehome/detailField.style";

import ProfileField from "./profileField.component";
import { mockAddressOptions } from "./mockProfile";
import type { PersonalInfoDraft } from "./profile.type";

import type { S2SDropDownOption } from "../../types/component.type";

/** One of the four address selects: ~134px wide, but allowed to wrap. */
function AddressSelect({
    label,
    data,
    value,
    onValueChange,
}: {
    label: string;
    data: S2SDropDownOption[];
    value: string;
    onValueChange: (value: string) => void;
}) {
    return (
        <Box flex="1 1 134px" minW="120px" maxW="180px">
            <ProfileField label={label} labelColor="GreyMuted" labelSize="14px">
                <S2SDropDown
                    {...detailDropDownStyle}
                    placeholder=""
                    data={data}
                    value={value}
                    onValueChange={onValueChange}
                />
            </ProfileField>
        </Box>
    );
}

/**
 * The Personal Information heading and its fields, with no card around them.
 * Shared by the Profile page (wrapped in a railed card) and the new-user
 * User Information page (rendered bare in a centred column).
 */
export default function PersonalInfoFields({
    value,
    onChange,
}: {
    value: PersonalInfoDraft;
    onChange: (patch: Partial<PersonalInfoDraft>) => void;
}) {
    return (
        <VStack align="stretch" gap="16px" w="100%" minW={0}>
            <Text fontSize="24px" fontWeight="600" color="Grey">
                Personal Information
            </Text>

            <VStack align="stretch" gap="12px" w="100%">
                <ProfileField label="FirstName">
                    <Input
                        {...detailInputStyle}
                        value={value.firstName}
                        onChange={(e) => onChange({ firstName: e.target.value })}
                    />
                </ProfileField>

                <ProfileField label="LastName">
                    <Input
                        {...detailInputStyle}
                        value={value.lastName}
                        onChange={(e) => onChange({ lastName: e.target.value })}
                    />
                </ProfileField>

                <ProfileField label="Phone">
                    <Input
                        {...detailInputStyle}
                        type="tel"
                        value={value.phone}
                        onChange={(e) => onChange({ phone: e.target.value })}
                    />
                </ProfileField>

                <ProfileField label="Address">
                    <Flex gap="12px" wrap="wrap" mt="2px" w="100%">
                        <AddressSelect
                            label="State"
                            data={mockAddressOptions.state}
                            value={value.state}
                            onValueChange={(state) => onChange({ state })}
                        />
                        <AddressSelect
                            label="District"
                            data={mockAddressOptions.district}
                            value={value.district}
                            onValueChange={(district) => onChange({ district })}
                        />
                        <AddressSelect
                            label="Sub District"
                            data={mockAddressOptions.subDistrict}
                            value={value.subDistrict}
                            onValueChange={(subDistrict) => onChange({ subDistrict })}
                        />
                        <AddressSelect
                            label="Street"
                            data={mockAddressOptions.street}
                            value={value.street}
                            onValueChange={(street) => onChange({ street })}
                        />
                    </Flex>
                </ProfileField>
            </VStack>
        </VStack>
    );
}
