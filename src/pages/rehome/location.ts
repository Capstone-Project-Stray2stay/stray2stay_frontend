import type { RehomeLocation } from "./rehome.type";

export interface ResolvedLocation {
    address: string;
    lat: number;
    long: number;
}

/**
 * TODO: delete this and the `!hasLocation` branch below once the "Pet's
 * Location" section is built.
 *
 * The backend marks petAddress/petAddressLat/petAddressLong as `required` and
 * go-validator rejects both "" and 0, so a submit cannot succeed without a
 * stand-in. Bangkok centroid.
 *
 * While this is in use every registered pet gets the same coordinates, which
 * feeds the Adopt page's distance sorting — fine for testing, wrong for real
 * data.
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
