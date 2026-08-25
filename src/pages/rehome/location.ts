import type { RehomeLocation } from "./rehome.type";

export interface ResolvedLocation {
    address: string;
    lat: number;
    long: number;
}

/**
 * Last-resort stand-in, Bangkok centroid.
 *
 * The "Pet's Location" section now exists (petLocationSection.component.tsx)
 * and missingFields() refuses to submit without it, so this should never be
 * reached in practice. It stays because the backend marks
 * petAddress/petAddressLat/petAddressLong as `required` and go-validator
 * rejects both "" and 0 — sending nothing fails the request outright.
 *
 * If it ever does fire, the pet lands on Bangkok's coordinates and sorts wrong
 * on the Adopt page's distance ordering.
 *
 * TODO: drop this once the sub-districts with null coordinates (~4% of the
 * dataset) are covered by geocodeAddressAPI at submit time, the way
 * userInformation.page.tsx's handleFinish does it.
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
 */
export function resolveLocation(location: RehomeLocation): ResolvedLocation {
    if (!hasLocation(location)) return PLACEHOLDER;

    return {
        address: [location.street, location.subDistrict, location.district, location.state]
            .filter(Boolean)
            .join(", "),
        lat: location.lat as number,
        long: location.long as number,
    };
}
