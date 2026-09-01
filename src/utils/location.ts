import { geocodeAddressAPI } from "../services/apis/address.api";
import type { RehomeLocation } from "../types/rehome.type";

export interface ResolvedLocation {
    address: string;
    lat: number;
    long: number;
}

const PLACEHOLDER: ResolvedLocation = {
    address: "Bangkok, Thailand",
    lat: 13.7563,
    long: 100.5018,
};

export function hasLocation(location: RehomeLocation): boolean {
    return location.state !== "" && location.lat !== null && location.long !== null;
}

export async function resolveLocation(location: RehomeLocation): Promise<ResolvedLocation> {
    if (location.state === "") return PLACEHOLDER;

    const address = [location.street, location.subDistrict, location.district, location.state]
        .filter(Boolean)
        .join(", ");

    if (location.lat !== null && location.long !== null) {
        return { address, lat: location.lat, long: location.long };
    }

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
