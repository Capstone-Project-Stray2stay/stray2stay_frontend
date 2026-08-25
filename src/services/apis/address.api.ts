import axios from "axios";

/**
 * Thailand's provinces/districts/sub-districts, fetched live from a public
 * dataset rather than mirrored into our own DB — see kongvut/thai-province-data
 * on GitHub, which documents these exact URLs as its "API". Called through
 * plain axios (not axiosInstance): this is a third-party host, so no baseURL
 * and no cookies should go with the request.
 */
const THAI_ADDRESS_BASE =
    "https://raw.githubusercontent.com/kongvut/thai-province-data/refs/heads/master/api/latest";

export interface ThaiProvince {
    id: number;
    name_th: string;
    name_en: string;
}

export interface ThaiDistrict {
    id: number;
    name_th: string;
    name_en: string;
    province_id: number;
}

export interface ThaiSubDistrict {
    id: number;
    zip_code: number;
    name_th: string;
    name_en: string;
    district_id: number;
    lat: number | null;
    long: number | null;
}

export async function getThaiProvincesAPI() {
    const res = await axios.get<ThaiProvince[]>(`${THAI_ADDRESS_BASE}/province.json`);
    return res.data;
}

export async function getThaiDistrictsAPI() {
    const res = await axios.get<ThaiDistrict[]>(`${THAI_ADDRESS_BASE}/district.json`);
    return res.data;
}

export async function getThaiSubDistrictsAPI() {
    const res = await axios.get<ThaiSubDistrict[]>(`${THAI_ADDRESS_BASE}/sub_district.json`);
    return res.data;
}

/**
 * Fallback for the ~4% of sub-districts with no lat/long in the dataset above:
 * geocode the assembled address text with OpenStreetMap's Nominatim, a free,
 * keyless geocoding API. Only called on submit, and only when the picked
 * sub-district didn't already come with coordinates.
 */
export async function geocodeAddressAPI(address: string): Promise<{ lat: number; long: number } | null> {
    const res = await axios.get<{ lat: string; lon: string }[]>("https://nominatim.openstreetmap.org/search", {
        params: { format: "json", limit: 1, q: address, countrycodes: "th" },
    });

    const [match] = res.data;
    if (!match) return null;

    return { lat: parseFloat(match.lat), long: parseFloat(match.lon) };
}
