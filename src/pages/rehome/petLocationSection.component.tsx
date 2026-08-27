import { useMemo } from "react";
import { Flex } from "@chakra-ui/react";

import { S2SDropDown, S2SInput } from "../../components/S2S.components";
import { useThaiAddressData } from "../../hooks/query/address.query";
import type { S2SDropDownOption } from "../../types/component.type";

import DetailField, { DetailSection } from "./detailField.component";
import { detailDropDownStyle, detailInputStyle } from "./detailField.style";
import type { RehomeLocation } from "./rehome.type";

const toOptions = (values: { name_en: string }[]): S2SDropDownOption[] =>
    values.map((v) => ({ value: v.name_en, label: v.name_en }));

/**
 * Where the pet is. The same cascade the Profile page's address block uses
 * (see profile/personalInfoFields.component.tsx) and off the same live dataset,
 * but stacked full-width to match this form's field layout.
 *
 * The sub-district is what actually matters downstream: it carries the
 * coordinates the Adopt page sorts by distance on. Before this section existed
 * every registered pet fell back to the Bangkok centroid in location.ts.
 */
export default function PetLocationSection({
    value,
    onChange,
}: {
    value: RehomeLocation;
    onChange: (patch: Partial<RehomeLocation>) => void;
}) {
    const { provinces, districts, subDistricts } = useThaiAddressData();

    // Cascading: each level's options are the previous level's children, so
    // picking a province clears whatever district/sub-district no longer
    // belongs to it (same idea as breed clearing color in step3Details).
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
                        // Remount once options finish loading: the underlying combobox
                        // doesn't resync its displayed text if `data` arrives async
                        // (from useThaiAddressData) after `value` is already set — it
                        // looks empty even though a value is selected.
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
                            // Comes with real coordinates for ~96% of sub-districts; the
                            // rest stay null and fall back to geocoding the address (see
                            // address.api.ts's geocodeAddressAPI).
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

                {/* The design draws a chevron here too, but there is no street-level
                    dataset behind the other three — free text, as on the Profile page. */}
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
