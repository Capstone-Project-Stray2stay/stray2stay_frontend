import { useMemo } from "react";
import { Box, Flex, Text, VStack } from "@chakra-ui/react";

import { S2SDropDown, S2SInput } from "../S2S.components";
import { detailDropDownStyle, detailInputStyle } from "../../utils/detailField.style";
import { useThaiAddressData } from "../../hooks/query/address.query";

import ProfileField from "./profileField.component";
import type { PersonalInfoDraft } from "../../types/profile.type";

import type { S2SDropDownOption } from "../../types/component.type";

const toOptions = (values: { name_en: string }[]): S2SDropDownOption[] =>
    values.map((v) => ({ value: v.name_en, label: v.name_en }));

function AddressSelect({
    label,
    data,
    value,
    onValueChange,
    disabled,
}: {
    label: string;
    data: S2SDropDownOption[];
    value: string;
    onValueChange: (value: string) => void;
    disabled?: boolean;
}) {
    return (
        <Box flex="1 1 134px" minW="120px" maxW={{md: "180px"}}>
            <ProfileField label={label} labelColor="GreyMuted" labelSize="14px">
                <S2SDropDown
                    key={data.length === 0 ? "loading" : "loaded"}
                    {...detailDropDownStyle}
                    placeholder=""
                    data={data}
                    value={value}
                    onValueChange={onValueChange}
                    disabled={disabled}
                />
            </ProfileField>
        </Box>
    );
}

export default function PersonalInfoFields({
    value,
    onChange,
    disabled = false,
    headerAction,
}: {
    value: PersonalInfoDraft;
    onChange: (patch: Partial<PersonalInfoDraft>) => void;
    disabled?: boolean;
    headerAction?: React.ReactNode;
}) {
    const { provinces, districts, subDistricts } = useThaiAddressData();

    const selectedProvince = useMemo(
        () => provinces.find((p) => p.name_en === value.state),
        [provinces, value.state],
    );
    const districtOptions = useMemo(
        () => districts.filter((d) => d.province_id === selectedProvince?.id),
        [districts, selectedProvince],
    );
    const selectedDistrict = useMemo(
        () => districtOptions.find((d) => d.name_en === value.district),
        [districtOptions, value.district],
    );
    const subDistrictOptions = useMemo(
        () => subDistricts.filter((sd) => sd.district_id === selectedDistrict?.id),
        [subDistricts, selectedDistrict],
    );

    const provinceItems = useMemo(() => toOptions(provinces), [provinces]);
    const districtItems = useMemo(() => toOptions(districtOptions), [districtOptions]);
    const subDistrictItems = useMemo(() => toOptions(subDistrictOptions), [subDistrictOptions]);

    return (
        <VStack align="stretch" gap="16px" w="100%" minW={0}>
            <Flex align="center" justify="space-between">
                <Text fontSize={{base: "18px", md: "24px"}} fontWeight="600" color="Grey">
                    Personal Information
                </Text>
                {headerAction}
            </Flex>

            <VStack align="stretch" gap="12px" w="100%">
                <ProfileField label="FirstName">
                    <S2SInput
                        {...detailInputStyle}
                        value={value.firstName}
                        onChange={(e) => onChange({ firstName: e.target.value })}
                        disabled={disabled}
                    />
                </ProfileField>

                <ProfileField label="LastName">
                    <S2SInput
                        {...detailInputStyle}
                        value={value.lastName}
                        onChange={(e) => onChange({ lastName: e.target.value })}
                        disabled={disabled}
                    />
                </ProfileField>

                <ProfileField label="Phone">
                    <S2SInput
                        {...detailInputStyle}
                        type="tel"
                        value={value.phone}
                        onChange={(e) => onChange({ phone: e.target.value })}
                        disabled={disabled}
                    />
                </ProfileField>

                <ProfileField label="Address">
                    <Flex gap="12px" wrap="wrap" mt="6px" w="100%">
                        <AddressSelect
                            label="State"
                            data={provinceItems}
                            value={value.state}
                            disabled={disabled}
                            onValueChange={(state) =>
                                onChange({ state, district: "", subDistrict: "", lat: null, long: null })
                            }
                        />
                        <AddressSelect
                            label="District"
                            data={districtItems}
                            value={value.district}
                            disabled={disabled || value.state === ""}
                            onValueChange={(district) =>
                                onChange({ district, subDistrict: "", lat: null, long: null })
                            }
                        />
                        <AddressSelect
                            label="Sub District"
                            data={subDistrictItems}
                            value={value.subDistrict}
                            disabled={disabled || value.district === ""}
                            onValueChange={(subDistrict) => {
                                const picked = subDistrictOptions.find((sd) => sd.name_en === subDistrict);
                                onChange({
                                    subDistrict,
                                    lat: picked?.lat ?? null,
                                    long: picked?.long ?? null,
                                });
                            }}
                        />
                        <Box flex="1 1 134px" minW="120px" maxW={{md: "180px"}}>
                            <ProfileField label="Street" labelColor="GreyMuted" labelSize="14px">
                                <S2SInput
                                    {...detailInputStyle}
                                    value={value.street}
                                    onChange={(e) => onChange({ street: e.target.value })}
                                    disabled={disabled}
                                />
                            </ProfileField>
                        </Box>
                    </Flex>
                </ProfileField>
            </VStack>
        </VStack>
    );
}
