import { useQuery } from "@tanstack/react-query"

import {
    getThaiDistrictsAPI,
    getThaiProvincesAPI,
    getThaiSubDistrictsAPI,
} from "../../services/apis/address.api"

// Thailand's administrative divisions essentially never change, so there's no
// need to refetch this on every mount — but it's still a live fetch against
// the external dataset each session, never something we copy into our own DB.
const REFERENCE_DATA_STALE_TIME = 24 * 60 * 60 * 1000;

/** Just the province list — for callers (like the Adopt filter) that don't need districts/sub-districts too. */
export function useThaiProvinces() {
    const { data, isLoading } = useQuery({
        queryKey: ["thaiProvinces"],
        queryFn: getThaiProvincesAPI,
        staleTime: REFERENCE_DATA_STALE_TIME,
        retry: false,
    })

    return { provinces: data ?? [], loading: isLoading }
}

export function useThaiAddressData() {
    const provinces = useQuery({
        queryKey: ["thaiProvinces"],
        queryFn: getThaiProvincesAPI,
        staleTime: REFERENCE_DATA_STALE_TIME,
        retry: false,
    })
    const districts = useQuery({
        queryKey: ["thaiDistricts"],
        queryFn: getThaiDistrictsAPI,
        staleTime: REFERENCE_DATA_STALE_TIME,
        retry: false,
    })
    const subDistricts = useQuery({
        queryKey: ["thaiSubDistricts"],
        queryFn: getThaiSubDistrictsAPI,
        staleTime: REFERENCE_DATA_STALE_TIME,
        retry: false,
    })

    return {
        provinces: provinces.data ?? [],
        districts: districts.data ?? [],
        subDistricts: subDistricts.data ?? [],
        loading: provinces.isLoading || districts.isLoading || subDistricts.isLoading,
    }
}
