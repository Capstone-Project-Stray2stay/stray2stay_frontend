import { useMemo } from "react";
import { Flex } from "@chakra-ui/react";

import { S2SDropDown, S2SInput } from "../S2S.components";
import { useThaiAddressData } from "../../hooks/query/address.query";
import type { S2SDropDownOption } from "../../types/component.type";

import DetailField, { DetailSection } from "./detailField.component";
import { detailDropDownStyle, detailInputStyle } from "../../utils/detailField.style";
import type { RehomeLocation } from "../../types/rehome.type";

const toOptions = (values: { name_en: string }[]): S2SDropDownOption[] =>
    values.map((v) => ({ value: v.name_en, label: v.name_en }));

export default function PetLocationSection({
    value,
    onChange,
}: {
    value: RehomeLocation;
    onChange: (patch: Partial<RehomeLocation>) => void;
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
        <DetailSection title="Pet's Location">
            <Flex direction="column" align="stretch" gap={{ base: "18.38px", md: "14px" }}>
                <DetailField label="State">
                    <S2SDropDown
                        key={provinceItems.length === 0 ? "loading" : "loaded"}
                        placeholder=""
                        {...detailDropDownStyle}
                        data={provinceItems}
                        value={value.state}
                        onValueChange={(state) =>
                            onChange({
                                state,
                                district: "",
                                subDistrict: "",
                                lat: null,
                                long: null,
                            })
                        }
                    />
                </DetailField>

                <DetailField label="District">
                    <S2SDropDown
                        key={districtItems.length === 0 ? "loading" : "loaded"}
                        placeholder=""
                        {...detailDropDownStyle}
                        data={districtItems}
                        value={value.district}
                        disabled={value.state === ""}
                        onValueChange={(district) =>
                            onChange({ district, subDistrict: "", lat: null, long: null })
                        }
                    />
                </DetailField>

                <DetailField label="Sub District">
                    <S2SDropDown
                        key={subDistrictItems.length === 0 ? "loading" : "loaded"}
                        placeholder=""
                        {...detailDropDownStyle}
                        data={subDistrictItems}
                        value={value.subDistrict}
                        disabled={value.district === ""}
                        onValueChange={(subDistrict) => {
                            const picked = subDistrictOptions.find(
                                (sd) => sd.name_en === subDistrict,
                            );
                            onChange({
                                subDistrict,
                                lat: picked?.lat ?? null,
                                long: picked?.long ?? null,
                            });
                        }}
                    />
                </DetailField>

                <DetailField label="Street">
                    <S2SInput
                        {...detailInputStyle}
                        value={value.street}
                        onChange={(e) => onChange({ street: e.target.value })}
                    />
                </DetailField>
            </Flex>
        </DetailSection>
    );
}
