import type { PersonalInfoDraft } from "../types/profile.type";

type AddressParts = Pick<PersonalInfoDraft, "street" | "subDistrict" | "district" | "state">;

export function joinAddress(parts: AddressParts): string {
    return [parts.street, parts.subDistrict, parts.district, parts.state]
        .filter(Boolean)
        .join(", ");
}

export function joinAddressForGeocode(parts: Omit<AddressParts, "street">): string {
    return [parts.subDistrict, parts.district, parts.state].filter(Boolean).join(", ");
}

export function splitAddress(address: string): AddressParts {
    const [street = "", subDistrict = "", district = "", state = ""] = address
        .split(",")
        .map((part) => part.trim());
    return { street, subDistrict, district, state };
}

export function districtState(address: string): string {
    const { district, state } = splitAddress(address);
    return [district, state].filter(Boolean).join(", ");
}
