import { geocodeAddressAPI } from "../../services/apis/address.api";
import type { RehomeLocation } from "./rehome.type";

export interface ResolvedLocation {
    address: string;
    lat: number;
    long: number;
}

/**
 * Last-resort stand-in, Bangkok centroid. Only used when the Location section
 * was never filled in at all (state === "") — missingFields() is supposed to
 * refuse submission before that happens, so this should never be reached in
 * practice. It stays because the backend marks
 * petAddress/petAddressLat/petAddressLong as `required` and go-validator
 * rejects both "" and 0 — sending nothing fails the request outright.
 */
const PLACEHOLDER: ResolvedLocation = {
    address: "Bangkok, Thailand",
    lat: 13.7563,
    long: 100.5018,
};

/** True once the Location section has actually supplied usable values. */
export function hasLocation(location: RehomeLocation): boolean {
    return location.state !== "" && location.lat !== null && location.long !== null;
}

/**
 * The single place that knows a placeholder exists. Callers building the
 * register payload only ever see the resolved address/lat/long.
 *
 * ~4% of sub-districts (notably many in Bangkok) ship with no lat/long in the
 * dataset — picking one of those leaves location.lat/long null even though
 * state/district/subDistrict are genuinely filled in. That case geocodes the
 * real address instead of discarding it for the Bangkok placeholder (same
 * fallback userInformation.page.tsx's handleFinish uses).
 */
export async function resolveLocation(location: RehomeLocation): Promise<ResolvedLocation> {
    if (location.state === "") return PLACEHOLDER;

    const address = [location.street, location.subDistrict, location.district, location.state]
        .filter(Boolean)
        .join(", ");

    if (location.lat !== null && location.long !== null) {
        return { address, lat: location.lat, long: location.long };
    }

    // Geocoded on sub-district/district/state only — street is free text the
    // user typed and just makes Nominatim return no match.
    const geocodeQuery = [location.subDistrict, location.district, location.state]
        .filter(Boolean)
        .join(", ");
    const geocoded = await geocodeAddressAPI(geocodeQuery).catch(() => null);

    return {
        address,
        lat: geocoded?.lat ?? PLACEHOLDER.lat,
        long: geocoded?.long ?? PLACEHOLDER.long,
    };
}
