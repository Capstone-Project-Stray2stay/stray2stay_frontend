import { useMemo, useState } from "react";
import { Box, Flex, Image, SimpleGrid } from "@chakra-ui/react";
import { IoSearchOutline, IoCameraOutline } from "react-icons/io5";

import {
    S2SPageTitle,
    S2SPetIconButton,
    S2SInput,
    S2SIconButton,
    S2SDropDown,
    S2SButton,
    S2SPetCard,
    S2SPagination,
} from "../components/S2S.components";

import { mockPets } from "./adopt/mockPets";
import {
    breedOptions,
    colorOptions,
    genderOptions,
    ageGroupOptions,
    locationOptions,
} from "./adopt/filterOptions";

const PAGE_SIZE = 16;

export default function Adopt() {
    const [category, setCategory] = useState<"dog" | "cat" | "all">("all");
    const [keyword, setKeyword] = useState("");
    const [page, setPage] = useState(1);

    const resetFilters = () => {
        setCategory("all");
        setKeyword("");
        setPage(1);
    };

    // TODO: replace with a real pets API call once one exists — this is throwaway
    // client-side filtering just to make the mock UI testable end-to-end. The 5
    // dropdown filters below are display-only for now (S2SDropDown has no
    // controlled value/onChange yet), so they don't affect this filter.
    const filteredPets = useMemo(() => {
        const kw = keyword.trim().toLowerCase();
        return mockPets.filter((p) => {
            if (category !== "all" && p.category !== category) return false;
            if (kw && !`${p.name} ${p.breed} ${p.location}`.toLowerCase().includes(kw)) return false;
            return true;
        });
    }, [category, keyword]);

    const totalPages = Math.max(1, Math.ceil(filteredPets.length / PAGE_SIZE));
    const pagedPets = filteredPets.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <Box width={{ base: "100%", md: "80vw" }}>
            <S2SPageTitle title="Adopt a Pet" />

            <Flex justify="center" gap="48px" mt="64px">
                <S2SPetIconButton icon={<Image src="/assets/icons/dog.png" alt="Dog" boxSize="36px" />} label="Dog" selected={category === "dog"} onClick={() => { setCategory("dog"); setPage(1); }} />
                <S2SPetIconButton icon={<Image src="/assets/icons/cat.png" alt="Cat" boxSize="36px" />} label="Cat" selected={category === "cat"} onClick={() => { setCategory("cat"); setPage(1); }} />
                <S2SPetIconButton icon={<Image src="/assets/icons/paw.png" alt="All" boxSize="36px" />} label="All" selected={category === "all"} onClick={() => { setCategory("all"); setPage(1); }} />
            </Flex>

            <Flex gap="18px" mt="32px" align="center">
                <Box flex={1}>
                    <S2SInput
                        placeholder="Search by keyword ( e.g. black, orange )"
                        endIcon={<IoSearchOutline />}
                        value={keyword}
                        onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
                    />
                </Box>
                <S2SIconButton icon={<IoCameraOutline />} ariaLabel="Search by photo" bgColor="Grey" onClick={() => console.log("search by photo - not implemented yet")} />
            </Flex>

            <Flex justify="space-between" mt="32px" wrap="wrap" gap={4}>
                <S2SDropDown placeholder="Breed" width="190px" data={breedOptions} />
                <S2SDropDown placeholder="Color" width="190px" data={colorOptions} />
                <S2SDropDown placeholder="Gender" width="190px" data={genderOptions} />
                <S2SDropDown placeholder="Age Group" width="190px" data={ageGroupOptions} />
                <S2SDropDown placeholder="Location" width="190px" data={locationOptions} />
            </Flex>
            <Flex justify="flex-end" mt="32px">
                <S2SButton text="Clear" bgColor="Blue" onClick={resetFilters} />
            </Flex>

            <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} gap={6} mt="64px">
                {pagedPets.map((p, i) => (
                    <S2SPetCard
                        key={p.id}
                        rank={page === 1 ? i + 1 : undefined}
                        width="100%"
                        petName={p.name}
                        petImageURL={p.imageURL}
                        petAge={p.age}
                        petBreed={p.breed}
                        petGender={p.gender}
                        petLocation={p.location}
                    />
                ))}
            </SimpleGrid>

            <Flex justify="center" mt="32px">
                <S2SPagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </Flex>
        </Box>
    );
}
