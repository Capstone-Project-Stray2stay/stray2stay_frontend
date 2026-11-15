import { Box, Flex, IconButton, Text, VStack } from "@chakra-ui/react";
import type { ReactNode } from "react";

import CalendarIcon from "../icons/calendarIcon.component";
import { MONTHS_LONG, MONTHS_SHORT, WEEKDAYS, isSameDay, toDateKey, weekOf } from "../../utils/dateUtils";

export default function WeekStrip({
    selectedDate,
    entryDateKeys,
    onSelect,
    calendarOpen = false,
    onCalendarToggle,
    calendar,
}: {
    selectedDate: Date;
    entryDateKeys: Set<string>;
    onSelect: (date: Date) => void;
    /** Phone only: the month calendar folds away behind the header's calendar button (Figma mobile) */
    calendarOpen?: boolean;
    onCalendarToggle?: () => void;
    /** Rendered between the phone header and the days while calendarOpen */
    calendar?: ReactNode;
}) {
    const days = weekOf(selectedDate);

    return (
        <Flex
            direction={{ base: "column", md: "row" }}
            align={{ base: "stretch", md: "flex-start" }}
            gap={{ base: "14px", md: "24px" }}
            w="100%"
        >
            {/* Figma mobile: month name left, 24px calendar button (--button) right */}
            <Flex display={{ base: "flex", md: "none" }} justify="space-between" align="center">
                <Text fontSize="16" fontWeight="600" color="Grey">
                    {MONTHS_LONG[selectedDate.getMonth()]}
                </Text>
                {onCalendarToggle && (
                    <IconButton
                        aria-label={calendarOpen ? "Hide month calendar" : "Show month calendar"}
                        aria-expanded={calendarOpen}
                        variant="plain"
                        minW="unset"
                        boxSize="24px"
                        p="0"
                        // Same --button blue as the desktop pencil
                        color="Blue"
                        css={{ "& svg": { width: "24px", height: "24px" } }}
                        onClick={onCalendarToggle}
                    >
                        <CalendarIcon />
                    </IconButton>
                )}
            </Flex>
            {calendarOpen && calendar && <Box display={{ base: "block", md: "none" }}>{calendar}</Box>}
            <Text
                display={{ base: "none", md: "block" }}
                fontSize="24"
                fontWeight="600"
                color="Grey"
                pt="4px"
            >
                {MONTHS_SHORT[selectedDate.getMonth()]}
            </Text>

            <Flex flex="1" minW="0" justify="space-between" align="center">
                {days.map((day) => {
                    const selected = isSameDay(day, selectedDate);
                    const hasEntries = entryDateKeys.has(toDateKey(day));

                    return (
                        <VStack
                            key={toDateKey(day)}
                            as="button"
                            gap={{ base: "6.88px", md: "6.86px" }}
                            cursor="pointer"
                            onClick={() => onSelect(day)}
                        >
                            <Text
                                fontSize={{ base: "14", md: "17" }}
                                fontWeight="500"
                                color="BlueText"
                            >
                                {WEEKDAYS[day.getDay()]}
                            </Text>
                            <Flex
                                boxSize={{ base: "33.69px", md: "41.99px" }}
                                align="center"
                                justify="center"
                                borderRadius="full"
                                borderWidth="0.61px"
                                borderColor="BabyGray"
                                bg={selected ? "Cream" : "white"}
                                transition="background 0.15s ease"
                            >
                                <Text
                                    fontSize={{ base: "14", md: "17" }}
                                    fontWeight="500"
                                    color="GreyText"
                                >
                                    {day.getDate()}
                                </Text>
                            </Flex>
                            <Box
                                boxSize="6px"
                                borderRadius="full"
                                bg={hasEntries ? "Blue" : "transparent"}
                            />
                        </VStack>
                    );
                })}
            </Flex>
        </Flex>
    );
}
