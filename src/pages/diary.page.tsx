import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text, VStack } from "@chakra-ui/react";

import { S2SPageTitle, S2SButton } from "../components/S2S.components";

import { addMonths, toDateKey } from "./diary/dateUtils";
import { mockAdoptedPets, mockEntries, mockFinder } from "./diary/mockDiary";
import type { DiaryEntry } from "./diary/diary.type";

import PetSummaryCard from "./diary/petSummaryCard.component";
import FinderCard from "./diary/finderCard.component";
import WeekStrip from "./diary/weekStrip.component";
import MonthCalendar from "./diary/monthCalendar.component";
import DayEntries from "./diary/dayEntries.component";
import MyAdoptionsModal from "./diary/myAdoptionsModal.component";

export default function Diary() {
    const navigate = useNavigate();

    const [selectedPetId, setSelectedPetId] = useState(mockAdoptedPets[0].id);
    const [selectedDate, setSelectedDate] = useState(() => new Date());
    // Paged independently of the selection, so browsing ahead a month doesn't
    // move which day the diary is showing.
    const [viewMonth, setViewMonth] = useState(() => new Date());
    const [entries, setEntries] = useState<DiaryEntry[]>(mockEntries);
    const [isPetModalOpen, setIsPetModalOpen] = useState(false);

    const selectedPet = mockAdoptedPets.find((pet) => pet.id === selectedPetId) ?? mockAdoptedPets[0];
    const selectedKey = toDateKey(selectedDate);

    const petEntries = useMemo(
        () => entries.filter((entry) => entry.petId === selectedPetId),
        [entries, selectedPetId],
    );

    const dayEntry = petEntries.find((entry) => entry.dateKey === selectedKey);
    const entryDateKeys = useMemo(
        () => new Set(petEntries.map((entry) => entry.dateKey)),
        [petEntries],
    );

    const handleSelectDate = (date: Date) => {
        setSelectedDate(date);
        setViewMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    };

    /**
     * A day holds one entry, so this upserts rather than appends. `photo` is
     * null when the editor was reopened and only the caption changed — the
     * existing image is kept in that case.
     */
    const handleSaveEntry = (photo: File | null, caption: string) => {
        setEntries((current) => {
            const existing = current.find(
                (entry) => entry.petId === selectedPetId && entry.dateKey === selectedKey,
            );

            if (existing) {
                // Release the old blob before dropping the reference to it,
                // but only when it was one we minted from a File.
                if (photo && existing.photo) URL.revokeObjectURL(existing.imageURL);

                return current.map((entry) =>
                    entry.id === existing.id
                        ? {
                              ...entry,
                              caption,
                              ...(photo ? { photo, imageURL: URL.createObjectURL(photo) } : {}),
                          }
                        : entry,
                );
            }

            if (!photo) return current;

            return [
                ...current,
                {
                    id: crypto.randomUUID(),
                    petId: selectedPetId,
                    dateKey: selectedKey,
                    photo,
                    imageURL: URL.createObjectURL(photo),
                    caption,
                },
            ];
        });
    };

    return (
        <Box width={{ base: "100%", md: "80vw" }}>
            <S2SPageTitle title="Pet Diary" />

            <Flex
                mt="64px"
                gap="40px"
                align="flex-start"
                direction={{ base: "column", lg: "row" }}
            >
                <VStack flex="1" minW="0" maxW={{ base: "100%", lg: "602px" }} align="stretch" gap="32px">
                    <PetSummaryCard pet={selectedPet} onChangeClick={() => setIsPetModalOpen(true)} />

                    <VStack align="stretch" gap="16px">
                        <WeekStrip
                            selectedDate={selectedDate}
                            entryDateKeys={entryDateKeys}
                            onSelect={handleSelectDate}
                        />
                        {/* Keyed so the editor's draft state is dropped when the
                            day or the pet changes, rather than carrying over. */}
                        <DayEntries
                            key={`${selectedPetId}-${selectedKey}`}
                            date={selectedDate}
                            entry={dayEntry}
                            onSaveEntry={handleSaveEntry}
                        />
                    </VStack>

                    <Flex justify="flex-end">
                        <S2SButton
                            text="Finish"
                            width="115px"
                            height="45px"
                            fontSize="20px"
                            onClick={() => navigate("/")}
                        />
                    </Flex>
                </VStack>

                <VStack flex="1" minW="0" align="center" gap="32px">
                    <FinderCard finder={mockFinder} />
                    <MonthCalendar
                        viewMonth={viewMonth}
                        selectedDate={selectedDate}
                        onMonthChange={(delta) => setViewMonth((month) => addMonths(month, delta))}
                        onSelect={setSelectedDate}
                    />
                    {/* TODO: swap for the exported Figma illustration (279x189). */}
                    <Flex
                        w="279px"
                        h="189px"
                        align="center"
                        justify="center"
                        bg="rgba(255,255,255,0.45)"
                        borderRadius="16px"
                    >
                        <Text fontSize="14px" fontWeight="500" color="GreyMuted">
                            Illustration
                        </Text>
                    </Flex>
                </VStack>
            </Flex>

            <MyAdoptionsModal
                isOpen={isPetModalOpen}
                pets={mockAdoptedPets}
                selectedPetId={selectedPetId}
                onClose={() => setIsPetModalOpen(false)}
                onSelect={setSelectedPetId}
            />
        </Box>
    );
}
