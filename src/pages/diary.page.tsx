import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Spinner, Text, VStack, useBreakpointValue } from "@chakra-ui/react";
import { isAxiosError } from "axios";

import { S2SPageTitle, S2SButton } from "../components/S2S.components";

import { addMonths, fromDateKey, toDateKey, today, visibleRange } from "../utils/dateUtils";
import { useDiaryEntries, useMyDiaryPets, useSaveDiaryEntry } from "../hooks/query/diary.query";

import PetSummaryCard from "../components/diary/petSummaryCard.component";
import FinderCard from "../components/diary/finderCard.component";
import WeekStrip from "../components/diary/weekStrip.component";
import MonthCalendar from "../components/diary/monthCalendar.component";
import DayEntries from "../components/diary/dayEntries.component";
import MyAdoptionsModal from "../components/diary/myAdoptionsModal.component";

/** Surfaces the server's own message; the diary handlers answer with { error }. */
function serverMessage(error: unknown): string {
    if (isAxiosError(error)) {
        const data = error.response?.data as { error?: string; message?: string } | undefined;
        return data?.error ?? data?.message ?? error.message;
    }
    return error instanceof Error ? error.message : "Unknown error";
}

export default function Diary() {
    const navigate = useNavigate();

    // The desktop layout is two independently-flowing columns, and the finder
    // card moves from the right column into the middle of the mobile flow — a
    // reorder plain CSS direction:column can't express. So the arrangement is
    // picked once here, in JS, rather than mounting the page twice behind
    // display:none (which would double up DayEntries' internal edit state).
    const isDesktop = useBreakpointValue({ base: false, lg: true }) ?? false;

    const [selectedPid, setSelectedPid] = useState<number | null>(null);
    const [selectedDate, setSelectedDate] = useState(() => today());
    // Paged independently of the selection, so browsing ahead a month doesn't
    // move which day the diary is showing.
    const [viewMonth, setViewMonth] = useState(() => today());
    const [isPetModalOpen, setIsPetModalOpen] = useState(false);
    const [saveError, setSaveError] = useState("");

    const { diaryPets, loading: petsLoading, error: petsError } = useMyDiaryPets();

    // Falling back to the first pet keeps the page usable before the user has
    // picked one, and after the selected pet disappears from the list.
    const selectedPet =
        diaryPets.find((pet) => pet.pid === selectedPid) ?? diaryPets[0] ?? null;

    const [from, to] = useMemo(
        () => visibleRange(viewMonth, selectedDate),
        [viewMonth, selectedDate],
    );

    const { entries, loading: entriesLoading } = useDiaryEntries(
        selectedPet?.pid ?? null,
        from,
        to,
    );
    const saveEntry = useSaveDiaryEntry();

    const selectedKey = toDateKey(selectedDate);
    const dayEntry = entries.find((entry) => entry.date === selectedKey);
    const entryDateKeys = useMemo(
        () => new Set(entries.map((entry) => entry.date)),
        [entries],
    );

    // The same window the server enforces: from the adoption up to today. The
    // UI applies it so days that would be rejected are visibly inert instead.
    const writableDay = useMemo(() => {
        if (!selectedPet?.canWrite) return false;

        const day = fromDateKey(selectedKey);
        const since = fromDateKey(selectedPet.since);
        if (!day) return false;
        if (day > today()) return false;
        return !since || day >= since;
    }, [selectedPet, selectedKey]);

    const handleSelectDate = (date: Date) => {
        setSaveError("");
        setSelectedDate(date);
        setViewMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    };

    const handleSaveEntry = async (photo: File | null, caption: string) => {
        if (!selectedPet) return false;

        setSaveError("");
        try {
            await saveEntry.mutateAsync({
                pid: selectedPet.pid,
                date: selectedKey,
                photo,
                caption,
            });
            return true;
        } catch (error) {
            setSaveError(serverMessage(error));
            return false;
        }
    };

    if (petsLoading) {
        return (
            <Box width="100%" px={{ base: "30px", md: "9%" }}>
                <S2SPageTitle title="Pet Diary" />
                <Flex justify="center" py="120px">
                    <Spinner color="Blue" size="lg" />
                </Flex>
            </Box>
        );
    }

    if (petsError || !selectedPet) {
        return (
            <Box width="100%" px={{ base: "30px", md: "9%" }}>
                <S2SPageTitle title="Pet Diary" />
                <VStack gap="16px" py="120px">
                    <Text fontSize="18px" fontWeight="600" color="Grey" textAlign="center">
                        {petsError
                            ? "Couldn't load your diaries."
                            : "You don't have a pet diary yet."}
                    </Text>
                    <Text fontSize="16px" fontWeight="500" color="GreyMuted" textAlign="center">
                        {petsError
                            ? "Please try again in a moment."
                            : "A diary opens once an adoption is accepted."}
                    </Text>
                    <S2SButton text="Find a pet" width="160px" height="45px" onClick={() => navigate("/adopt")} />
                </VStack>
            </Box>
        );
    }

    // Each piece is built exactly once and just gets slotted into whichever
    // grouping matches the breakpoint below.
    const petCard = <PetSummaryCard pet={selectedPet} onChangeClick={() => setIsPetModalOpen(true)} />;

    const finderCard = <FinderCard pet={selectedPet} />;

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

    const dayEntries = entriesLoading ? (
        <Flex justify="center" py="80px">
            <Spinner color="Blue" />
        </Flex>
    ) : (
        <DayEntries
            // Remounting on pet or day drops any half-written draft rather than
            // carrying it across to a different entry.
            key={`${selectedPet.pid}-${selectedKey}`}
            date={selectedDate}
            entry={dayEntry}
            canWrite={selectedPet.canWrite}
            isWritableDay={writableDay}
            isSaving={saveEntry.isPending}
            saveError={saveError}
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
        <Box width="100%" px={{ base: "30px", md: "9%" }}>
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
                pets={diaryPets}
                selectedPid={selectedPet.pid}
                onClose={() => setIsPetModalOpen(false)}
                onSelect={(pid) => {
                    setSaveError("");
                    setSelectedPid(pid);
                }}
            />
        </Box>
    );
}
