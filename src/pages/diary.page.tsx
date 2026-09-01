import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text, VStack, useBreakpointValue } from "@chakra-ui/react";

import { S2SPageTitle, S2SButton } from "../components/S2S.components";

import { addMonths, toDateKey } from "../utils/dateUtils";
import { mockAdoptedPets, mockEntries, mockFinder } from "../utils/mockDiary";
import type { DiaryEntry } from "../types/diary.type";

import PetSummaryCard from "../components/diary/petSummaryCard.component";
import FinderCard from "../components/diary/finderCard.component";
import WeekStrip from "../components/diary/weekStrip.component";
import MonthCalendar from "../components/diary/monthCalendar.component";
import DayEntries from "../components/diary/dayEntries.component";
import MyAdoptionsModal from "../components/diary/myAdoptionsModal.component";

export default function Diary() {
    const navigate = useNavigate();

    // The desktop layout is two independently-flowing columns, and the
    // finder card moves from the right column into the middle of the mobile
    // flow — a reorder plain CSS direction:column can't express. So the
    // arrangement is picked once here, in JS, rather than mounting the page
    // twice behind display:none (which would double up DayEntries' internal
    // edit-mode state for nothing).
    const isDesktop = useBreakpointValue({ base: false, lg: true }) ?? false;

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

    // Each piece is built exactly once and just gets slotted into whichever
    // grouping matches the breakpoint below.
    const petCard = <PetSummaryCard pet={selectedPet} onChangeClick={() => setIsPetModalOpen(true)} />;

    const finderCard = <FinderCard finder={mockFinder} />;

    const monthCalendar = (
        <MonthCalendar
            viewMonth={viewMonth}
            selectedDate={selectedDate}
            onMonthChange={(delta) => setViewMonth((month) => addMonths(month, delta))}
            onSelect={setSelectedDate}
        />
    );

    const weekStrip = (
        <WeekStrip selectedDate={selectedDate} entryDateKeys={entryDateKeys} onSelect={handleSelectDate} />
    );

    const dayEntries = (
        <DayEntries
            key={`${selectedPetId}-${selectedKey}`}
            date={selectedDate}
            entry={dayEntry}
            onSaveEntry={handleSaveEntry}
        />
    );

    const finishButton = (
        <Flex justify="flex-end" w={isDesktop ? "auto" : "100%"}>
            <S2SButton
                text="Finish"
                width={{ base: "133px", md: "115px" }}
                height={{ base: "42px", md: "45px" }}
                fontSize={{ base: "16px", md: "20px" }}
                onClick={() => navigate("/")}
            />
        </Flex>
    );

    // TODO: swap for the exported Figma illustration.
    const illustration = (
        <Flex
            alignSelf={isDesktop ? "auto" : "center"}
            w={isDesktop ? "279px" : "219px"}
            h={isDesktop ? "189px" : "148px"}
            align="center"
            justify="center"
            bg="rgba(255,255,255,0.45)"
            borderRadius="16px"
        >
            <Text fontSize="14px" fontWeight="500" color="GreyMuted">
                Illustration
            </Text>
        </Flex>
    );

    return (
        <Box width="100%" px={{ base: "24px", md: "9%" }}>
            <S2SPageTitle title="Pet Diary" />

            {isDesktop ? (
                <Flex mt="64px" gap="40px" align="flex-start">
                    <VStack flex="1" minW="0" maxW="602px" align="stretch" gap="32px">
                        {petCard}
                        <VStack align="stretch" gap="16px">
                            {weekStrip}
                            {dayEntries}
                        </VStack>
                        {finishButton}
                    </VStack>

                    <VStack flex="1" minW="0" align="center" gap="32px">
                        {finderCard}
                        {monthCalendar}
                        {illustration}
                    </VStack>
                </Flex>
            ) : (
                // Mobile flow, following the Figma order: pet card, finder
                // card, month calendar, week strip, then the day's entry.
                <VStack mt="32px" gap="24px" align="stretch" w="100%">
                    {petCard}
                    {finderCard}
                    {monthCalendar}
                    {weekStrip}
                    {dayEntries}
                    {finishButton}
                    {illustration}
                </VStack>
            )}

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
