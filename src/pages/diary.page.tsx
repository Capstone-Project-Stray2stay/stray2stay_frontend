import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Image, Spinner, Text, VStack, useBreakpointValue } from "@chakra-ui/react";
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
    //
    // Three layouts: phone (< md) follows the Figma mobile frames; md–xl is one centred
    // 602px column with the desktop card styles; xl+ is the two-column Figma desktop
    // (below 1280px, with the 12vw sidebar, the two columns squeeze the calendar too far).
    const isDesktop = useBreakpointValue({ base: false, xl: true }) ?? false;
    const isPhone = useBreakpointValue({ base: true, md: false }) ?? true;
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

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
            <Box width="100%" px={{ base: "24px", md: "9%" }}>
                <S2SPageTitle title="Pet Diary" />
                <Flex justify="center" py="120px">
                    <Spinner color="Blue" size="lg" />
                </Flex>
            </Box>
        );
    }

    if (petsError || !selectedPet) {
        return (
            <Box width="100%" px={{ base: "24px", md: "9%" }}>
                <S2SPageTitle title="Pet Diary" />
                <VStack gap="16px" py="120px">
                    <Text fontSize="18" fontWeight="600" color="Grey" textAlign="center">
                        {petsError
                            ? "Couldn't load your diaries."
                            : "You don't have a pet diary yet."}
                    </Text>
                    <Text fontSize="16" fontWeight="500" color="GreyMuted" textAlign="center">
                        {petsError
                            ? "Please try again in a moment."
                            : "A diary opens once an adoption is accepted."}
                    </Text>
                    <S2SButton text="Find a pet" width="160px" height="45px" fontSize={{ base: "18", md: "20" }} onClick={() => navigate("/adopt")} />
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
            onSelect={(date) => {
                setSelectedDate(date);
                // On a phone the calendar is a fold-out: picking a day closes it again
                setIsCalendarOpen(false);
            }}
        />
    );

    const weekStrip = (
        <WeekStrip
            selectedDate={selectedDate}
            entryDateKeys={entryDateKeys}
            onSelect={handleSelectDate}
            {...(isPhone && {
                calendarOpen: isCalendarOpen,
                onCalendarToggle: () => setIsCalendarOpen((open) => !open),
                calendar: monthCalendar,
            })}
        />
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
            {/* Figma "Large Short": 120px min width, 48px tall */}
            <S2SButton
                text="Finish"
                width={{ base: "133px", md: "120px" }}
                height={{ base: "40px", md: "48px" }}
                fontSize={{ base: "16", md: "20" }}
                onClick={() => navigate("/")}
            />
        </Flex>
    );

    // Figma: the cat and dog drawing, 305px wide, centred in a 346×260 frame under the calendar;
    // 269×202 at the bottom of the mobile frame
    const illustration = (
        <Flex
            alignSelf="center"
            w={isPhone ? "269px" : "346px"}
            h={isPhone ? "202px" : "260px"}
            align="center"
            justify="center"
            pointerEvents="none"
            aria-hidden="true"
        >
            <Image src="/assets/images/diary_cat_dog.png" alt="" w={isPhone ? "100%" : "305px"} maxH="100%" objectFit="contain" />
        </Flex>
    );

    return (
        <Box width="100%" px={{ base: "24px", md: "9%" }}>
            <S2SPageTitle title="Pet Diary" />

            {isDesktop ? (
                <Flex gap="40px" align="flex-start" justify="center">
                    {/* Figma: 602px diary column and 399px finder/calendar column. Between 1280px and the
                        1440px design width the calendar column gives way first, so the pet card keeps
                        room for its details beside the avatar */}
                    <VStack flex="1 0 560px" maxW="602px" minW="0" align="stretch" gap="32px">
                        {petCard}
                        <VStack align="stretch" gap="16px">
                            {weekStrip}
                            {dayEntries}
                        </VStack>
                        {finishButton}
                    </VStack>

                    <VStack flex="0 1 399px" minW="0" align="center" gap="32px">
                        {finderCard}
                        <VStack w="100%" align="center" gap="8px">
                            {monthCalendar}
                            {illustration}
                        </VStack>
                    </VStack>
                </Flex>
            ) : (
                // Single column, following the Figma mobile order: pet card, finder card, then the
                // week (with the month calendar folded behind its button on a phone), the day's
                // entry and Finish. Phone gaps from Figma: 40 under the title (the title's own 15px
                // margin + 25), 24 between cards, 14 inside the week block, 20 above Finish.
                <VStack
                    mt={{ base: "25px", md: "0" }}
                    gap="24px"
                    align="stretch"
                    w="100%"
                    maxW={{ md: "602px" }}
                    mx="auto"
                >
                    {petCard}
                    {finderCard}
                    <VStack align="stretch" gap="20px">
                        <VStack align="stretch" gap={{ base: "14px", md: "24px" }}>
                            {!isPhone && monthCalendar}
                            {weekStrip}
                            {dayEntries}
                        </VStack>
                        {finishButton}
                    </VStack>
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
