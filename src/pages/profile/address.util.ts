import type { PersonalInfoDraft } from "./profile.type";

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

/** Inverse of joinAddress. Best-effort: a free-text address has no guaranteed structure. */
export function splitAddress(address: string): AddressParts {
    const [street = "", subDistrict = "", district = "", state = ""] = address
        .split(",")
        .map((part) => part.trim());
    return { street, subDistrict, district, state };
}
