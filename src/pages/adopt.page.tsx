import { useMemo, useState } from "react";
import { Box, Drawer, Flex, Grid, Image, Portal, Text, VStack } from "@chakra-ui/react";
import { IoSearchOutline, IoCameraOutline } from "react-icons/io5";
import { LuFilter } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

import {
    S2SPageTitle,
    S2SPetIconButton,
    S2SInput,
    S2SIconButton,
    S2SDropDown,
    S2SButton,
    S2SPetCard,
    S2SPetCardSkeleton,
    S2SPagination,
} from "../components/S2S.components";

import { useAdoptBreeds, usePetColors, useSearchPets } from "../hooks/query/pet.query";
import { useThaiProvinces } from "../hooks/query/address.query";
import { formatGender, genderOptions, ageGroupOptions } from "../utils/petOptions.util";
import { districtState } from "./profile/address.util";

const PAGE_SIZE = 16;

export default function Adopt() {
    const navigate = useNavigate();
    const [category, setCategory] = useState<"dog" | "cat" | "all">("all");
    const [keyword, setKeyword] = useState("");
    const [breed, setBreed] = useState("");
    const [color, setColor] = useState("");
    const [gender, setGender] = useState("");
    const [ageGroup, setAgeGroup] = useState("");
    const [location, setLocation] = useState("");
    const [page, setPage] = useState(1);
    const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

    const changeCategory = (next: "dog" | "cat" | "all") => {
        setCategory(next);
        // All the structured filters are species-specific (breed/color
        // cascade from species, and gender/ageGroup/location filter results
        // that a new species selection invalidates), so a species change
        // clears them rather than leaving stale filters applied.
        setBreed("");
        setColor("");
        setGender("");
        setAgeGroup("");
        setLocation("");
        setPage(1);
    };

    const resetFilters = () => {
        setCategory("all");
        setKeyword("");
        setBreed("");
        setColor("");
        setGender("");
        setAgeGroup("");
        setLocation("");
        setPage(1);
    };

    const { breedItems, loading: breedsLoading } = useAdoptBreeds(category);
    const breedOptions = useMemo(
        () => breedItems.map(({ value, label }) => ({ value, label })),
        [breedItems]
    );

    // Colors are looked up per (species, breed) in Mongo. When category is
    // "All", the flat breed list above still tags each entry with the species
    // it came from — recover that here so the color lookup has a species.
    const colorSpecies =
        category !== "all" ? category : breedItems.find((b) => b.value === breed)?.species ?? null;
    const { colors: colorOptions, loading: colorsLoading } = usePetColors(colorSpecies, breed);

    const { provinces, loading: provincesLoading } = useThaiProvinces();
    const locationOptions = useMemo(
        () => provinces.map((p) => ({ value: p.name_en, label: p.name_en })),
        [provinces]
    );

    // Blank filters aren't necessarily "unfiltered": GET /pets runs behind
    // the same session cookie as everything else, and the backend (see
    // PetServiceImpl.applyUserDefaults) fills any blank breed/color/gender/
    // ageGroup/location in from the logged-in caller's saved preferences and
    // profile address. Sending the raw picked values (not resolving that
    // fallback here too) keeps that logic in one place.
    const { pets, totalPages, isLoading, isError } = useSearchPets({
        page,
        pageSize: PAGE_SIZE,
        petType: category === "all" ? undefined : category,
        petBreed: breed || undefined,
        petColor: color || undefined,
        petGender: gender || undefined,
        petAgeGroup: ageGroup || undefined,
        petLocation: location || undefined,
    });

    const handleBreedChange = (value: string) => {
        setBreed(value);
        setColor("");
        setPage(1);
    };
    const handleColorChange = (value: string) => {
        setColor(value);
        setPage(1);
    };
    const handleGenderChange = (value: string) => {
        setGender(value);
        setPage(1);
    };
    const handleAgeGroupChange = (value: string) => {
        setAgeGroup(value);
        setPage(1);
    };
    const handleLocationChange = (value: string) => {
        setLocation(value);
        setPage(1);
    };

    return (
        <Box width="100%" pb="64px" px={{ base: "30px", md: "9%" }}>
            <S2SPageTitle title="Adopt a Pet" />

            <Flex justify="center" gap={{ base: "28px", md: "48px" }} mt={{ base: "24px", md: "64px" }}>
                <S2SPetIconButton icon={<Image src="/assets/icons/dog.png" alt="Dog" boxSize={{base: "28px", md: "36px"}} />} label="Dog" selected={category === "dog"} onClick={() => changeCategory("dog")} />
                <S2SPetIconButton icon={<Image src="/assets/icons/cat.png" alt="Cat" boxSize={{base: "28px", md: "36px"}} />} label="Cat" selected={category === "cat"} onClick={() => changeCategory("cat")} />
                <S2SPetIconButton icon={<Image src="/assets/icons/paw.png" alt="All" boxSize={{base: "28px", md: "36px"}} />} label="All" selected={category === "all"} onClick={() => changeCategory("all")} />
            </Flex>

            {/* Mobile: search icon leads the pill, camera icon sits inside its
                end, and a filter button sits outside — matches the mobile mock. */}
            <Flex display={{ base: "flex", md: "none" }} gap="10px" mt="24px" align="center" justify="center" wrap="wrap">
                <Box flex={1} maxW="100%" display="flex" gap="8px">
                    {/* TODO: GetPetsInfo has no free-text search param — wire this
                        up once the backend supports filtering by keyword. */}
                    <S2SInput
                        placeholder="Search by keyword ( e.g. black, orange )"
                        startIcon={<IoSearchOutline color="gray" size={20}/>}
                        endIcon={<IoCameraOutline color="gray" size={20}/>}
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </Box>
                <S2SIconButton icon={<LuFilter color="gray" />} ariaLabel="Filters" bgColor="White" onClick={() => setFilterDrawerOpen(true)} />
            </Flex>

            {/* Desktop: original layout — search icon inside the pill's end,
                camera as its own separate button, no filter button. */}
            <Flex display={{ base: "none", md: "flex" }} gap="18px" mt="32px" align="center" justify="center" wrap="wrap">
                <Box flex={1} maxW="700px" display="flex" gap="8px">
                    <S2SInput
                        placeholder="Search by keyword ( e.g. black, orange )"
                        endIcon={<IoSearchOutline size={20}/>}
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </Box>
                <S2SIconButton icon={<IoCameraOutline color="Grey" />} ariaLabel="Search by photo" bgColor="White" onClick={() => console.log("search by photo - not implemented yet")} />
            </Flex>
            {/* Desktop: filters stay inline. On mobile these live in the filter
                drawer instead (triggered by the funnel button above). */}
            <Flex display={{ base: "none", md: "flex" }} justify="center">
                <Flex justify="space-around" mt="32px" wrap="wrap" gap={4}>
                    <S2SDropDown
                        key={`breed-${category}-${breedsLoading ? "loading" : "loaded"}`}
                        placeholder="Breed"
                        width="190px"
                        data={breedOptions}
                        value={breed}
                        onValueChange={handleBreedChange}
                    />
                    <S2SDropDown
                        key={`color-${breed}-${colorsLoading ? "loading" : "loaded"}`}
                        placeholder="Color"
                        width="190px"
                        data={colorOptions}
                        value={color}
                        onValueChange={handleColorChange}
                        disabled={breed === ""}
                    />
                    <S2SDropDown
                        placeholder="Gender"
                        width="190px"
                        data={genderOptions}
                        value={gender}
                        onValueChange={handleGenderChange}
                    />
                    <S2SDropDown
                        placeholder="Age Group"
                        width="190px"
                        data={ageGroupOptions}
                        value={ageGroup}
                        onValueChange={handleAgeGroupChange}
                    />
                    <S2SDropDown
                        key={`location-${provincesLoading ? "loading" : "loaded"}`}
                        placeholder="Location"
                        width="190px"
                        data={locationOptions}
                        value={location}
                        onValueChange={handleLocationChange}
                    />
                </Flex>
            </Flex>
            <Flex display={{ base: "none", md: "flex" }} justify="flex-end" mt="32px">
                <S2SButton text="Clear" bgColor="Blue" onClick={resetFilters} />
            </Flex>

            <Drawer.Root placement="bottom" open={filterDrawerOpen} onOpenChange={(e) => setFilterDrawerOpen(e.open)}>
                <Portal>
                    <Drawer.Backdrop />
                    <Drawer.Positioner>
                        <Drawer.Content maxH="85vh" borderTopLeftRadius="24px" borderTopRightRadius="24px" overflow="hidden" p="10px">
                            <Flex width="100%" justify="space-between" align="center" pt={6} px={6}>
                                <Text fontSize="20px" fontWeight="600" color="Grey">Filters</Text>
                                <Drawer.CloseTrigger/>
                            </Flex>
                            <Drawer.Body overflowY="auto">
                                <VStack align="stretch" gap="24px" pt={2}>
                                    <S2SDropDown
                                        key={`breed-drawer-${category}-${breedsLoading ? "loading" : "loaded"}`}
                                        placeholder="Breed"
                                        width="100%"
                                        data={breedOptions}
                                        value={breed}
                                        onValueChange={handleBreedChange}
                                    />
                                    <S2SDropDown
                                        key={`color-drawer-${breed}-${colorsLoading ? "loading" : "loaded"}`}
                                        placeholder="Color"
                                        width="100%"
                                        data={colorOptions}
                                        value={color}
                                        onValueChange={handleColorChange}
                                        disabled={breed === ""}
                                    />
                                    <S2SDropDown
                                        placeholder="Gender"
                                        width="100%"
                                        data={genderOptions}
                                        value={gender}
                                        onValueChange={handleGenderChange}
                                    />
                                    <S2SDropDown
                                        placeholder="Age Group"
                                        width="100%"
                                        data={ageGroupOptions}
                                        value={ageGroup}
                                        onValueChange={handleAgeGroupChange}
                                    />
                                    <S2SDropDown
                                        key={`location-drawer-${provincesLoading ? "loading" : "loaded"}`}
                                        placeholder="Location"
                                        width="100%"
                                        data={locationOptions}
                                        value={location}
                                        onValueChange={handleLocationChange}
                                    />
                                </VStack>
                            </Drawer.Body>
                            <Drawer.Footer>
                                <Box flex={1}>
                                    <S2SButton text="Clear" variant="outline" bgColor="Blue" width="100%" onClick={resetFilters} />
                                </Box>
                                <Box flex={1}>
                                    <S2SButton text="Apply" bgColor="Blue" width="100%" onClick={() => setFilterDrawerOpen(false)} />
                                </Box>
                            </Drawer.Footer>
                        </Drawer.Content>
                    </Drawer.Positioner>
                </Portal>
            </Drawer.Root>
            <Box maxW="100%" px={{ base: "30px", md: "9%" }}>
                {isError ? (
                    <Flex minH="300px" align="center" justify="center">
                        <Text color="Grey" fontSize="md">Unable to load pets right now.</Text>
                    </Flex>
                ) : isLoading ? (
                    <Grid
                        templateColumns={{ base: "repeat(1, 240px)", sm: "repeat(2, 240px)", md: "repeat(4, 240px)" }}
                        justifyContent="center"
                        columnGap="20px"
                        rowGap={6}
                        mt="64px"
                    >
                        {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                            <S2SPetCardSkeleton key={i} width="240px" height="300px" />
                        ))}
                    </Grid>
                ) : pets.length === 0 ? (
                    <Flex minH="300px" align="center" justify="center">
                        <Text color="Grey" fontSize="md">No pets match these filters.</Text>
                    </Flex>
                ) : (
                    <Grid
                        templateColumns={{ base: "repeat(1, 240px)", sm: "repeat(2, 240px)", md: "repeat(4, 240px)" }}
                        justifyContent="center"
                        columnGap="20px"
                        rowGap={6}
                        mt="64px"
                    >
                        {pets.map((p, i) => (
                            <S2SPetCard
                                key={p.pid}
                                rank={page === 1 ? i + 1 : undefined}
                                width="240px"
                                height="300px"
                                petName={p.petName}
                                petImageURL={p.petImageAddress?.[0] ?? "/assets/images/house.png"}
                                petAge={p.petAgeGroup || "Unknown age"}
                                petBreed={p.petBreed || "Mixed breed"}
                                petGender={formatGender(p.petGender)}
                                petLocation={districtState(p.petAddress) || p.petAddress || "Location unavailable"}
                                onClick={() => navigate(`/pet-profile/${p.pid}`)}
                            />
                        ))}
                    </Grid>
                )}
            </Box>

            <Flex justify="center" mt="32px">
                <S2SPagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </Flex>
        </Box>
    );
}
