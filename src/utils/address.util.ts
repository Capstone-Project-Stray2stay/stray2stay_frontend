import type { PersonalInfoDraft } from "../types/profile.type";

type AddressParts = Pick<PersonalInfoDraft, "street" | "subDistrict" | "district" | "state">;

/**
 * The backend stores a single free-text `user_address` string, but the design
 * splits it into four selects (profile.type.ts). This is the one place that
 * decides the order they're joined in — keep joinAddress/splitAddress here
 * together so they can't drift apart.
 */
export function joinAddress(parts: AddressParts): string {
    return [parts.street, parts.subDistrict, parts.district, parts.state]
        .filter(Boolean)
        .join(", ");
}

/**
 * Same fields, minus the street, for geocoding queries. The street is
 * free text the user typed (often not a real, geocodable name), so
 * including it just makes Nominatim return no match — the sub-district is
 * the finest-grained piece guaranteed to actually resolve.
 */
export function joinAddressForGeocode(parts: Omit<AddressParts, "street">): string {
    return [parts.subDistrict, parts.district, parts.state].filter(Boolean).join(", ");
}

/** Inverse of joinAddress. Best-effort: a free-text address has no guaranteed structure. */
export function splitAddress(address: string): AddressParts {
    const [street = "", subDistrict = "", district = "", state = ""] = address
        .split(",")
        .map((part) => part.trim());
    return { street, subDistrict, district, state };
}

/** District + state only — the compact form shown on pet cards. */
export function districtState(address: string): string {
    const { district, state } = splitAddress(address);
    return [district, state].filter(Boolean).join(", ");
}
