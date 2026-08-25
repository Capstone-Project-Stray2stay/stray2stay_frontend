import { Box, Flex, Icon, Text, VStack } from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

import { MONTHS_LONG, WEEKDAYS, buildMonthGrid, isSameDay, toDateKey } from "./dateUtils";

export default function MonthCalendar({
    viewMonth,
    selectedDate,
    onMonthChange,
    onSelect,
}: {
    viewMonth: Date;
    selectedDate: Date;
    onMonthChange: (delta: number) => void;
    onSelect: (date: Date) => void;
}) {
    const rows = buildMonthGrid(viewMonth.getFullYear(), viewMonth.getMonth());

    return (
        <VStack
            w="100%"
            maxW="398.99px"
            p="32px"
            gap="24px"
            align="stretch"
            bg="rgba(255,255,255,0.70)"
            borderRadius="16px"
        >
            <Flex justify="space-between" align="center">
                <Text fontSize="20px" fontWeight="600" color="Grey">
                    {MONTHS_LONG[viewMonth.getMonth()]} {viewMonth.getFullYear()}
                </Text>
                <Flex gap="16px">
                    <Icon
                        as={LuChevronLeft}
                        aria-label="Previous month"
                        boxSize="16.28px"
                        color="GreyText"
                        cursor="pointer"
                        onClick={() => onMonthChange(-1)}
                    />
                    <Icon
                        as={LuChevronRight}
                        aria-label="Next month"
                        boxSize="16.28px"
                        color="GreyText"
                        cursor="pointer"
                        onClick={() => onMonthChange(1)}
                    />
                </Flex>
            </Flex>

            <Flex justify="space-between">
                {WEEKDAYS.map((label) => (
                    <Text
                        key={label}
                        w="34px"
                        textAlign="center"
                        fontSize="14px"
                        fontWeight="500"
                        color="GreyText"
                    >
                        {label}
                    </Text>
                ))}
            </Flex>

            {rows.map((row, rowIndex) => {
                const holdsSelection = row.some((day) => day && isSameDay(day, selectedDate));

                return (
                    // The highlight band spans the whole week rather than the one
                    // selected cell, so it is drawn as the row's own background.
                    <Flex
                        key={rowIndex}
                        justify="space-between"
                        align="center"
                        py="5px"
                        borderRadius="42px"
                        bg={holdsSelection ? "rgba(198,231,247,0.30)" : "transparent"}
                    >
                        {row.map((day, cellIndex) => {
                            if (!day) return <Box key={cellIndex} w="34px" h="17px" />;

                            const selected = isSameDay(day, selectedDate);
                            return (
                                <Text
                                    key={toDateKey(day)}
                                    as="button"
                                    w="34px"
                                    textAlign="center"
                                    fontSize="14px"
                                    fontWeight={selected ? "600" : "500"}
                                    color={selected ? "BlueText" : "Grey"}
                                    cursor="pointer"
                                    onClick={() => onSelect(day)}
                                >
                                    {day.getDate()}
                                </Text>
                            );
                        })}
                    </Flex>
                );
            })}
        </VStack>
    );
}
