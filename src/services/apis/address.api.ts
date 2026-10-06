import axios from "axios";

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

interface ThaiName {
    th: string;
    en: string;
}

interface ThaiProvinceResponse {
    id: number;
    name: ThaiName;
}

interface ThaiDistrictResponse {
    id: number;
    name: ThaiName;
    province_id: number;
}

interface ThaiSubDistrictResponse {
    id: number;
    zip_code: number;
    name: ThaiName;
    district_id: number;
    lat: number | null;
    long: number | null;
}

export async function getThaiProvincesAPI() {
    const res = await axios.get<ThaiProvinceResponse[]>(`${THAI_ADDRESS_BASE}/province.json`);
    return res.data.map((province): ThaiProvince => ({
        id: province.id,
        name_th: province.name.th,
        name_en: province.name.en,
    }));
}

export async function getThaiDistrictsAPI() {
    const res = await axios.get<ThaiDistrictResponse[]>(`${THAI_ADDRESS_BASE}/district.json`);
    return res.data.map((district): ThaiDistrict => ({
        id: district.id,
        name_th: district.name.th,
        name_en: district.name.en,
        province_id: district.province_id,
    }));
}

export async function getThaiSubDistrictsAPI() {
    const res = await axios.get<ThaiSubDistrictResponse[]>(`${THAI_ADDRESS_BASE}/sub_district.json`);
    return res.data.map((subDistrict): ThaiSubDistrict => ({
        id: subDistrict.id,
        zip_code: subDistrict.zip_code,
        name_th: subDistrict.name.th,
        name_en: subDistrict.name.en,
        district_id: subDistrict.district_id,
        lat: subDistrict.lat,
        long: subDistrict.long,
    }));
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
        timeout: 5000,
    });

    const [match] = res.data;
    if (!match) return null;

    return { lat: parseFloat(match.lat), long: parseFloat(match.lon) };
}
