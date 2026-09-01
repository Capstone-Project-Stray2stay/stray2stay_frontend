import { Box, Flex, Icon, IconButton, Text, VStack } from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

import { MONTHS_LONG, WEEKDAYS, buildMonthGrid, isSameDay, toDateKey } from "../../utils/dateUtils";

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
            maxW={{ base: "100%", md: "398.99px" }}
            p={{ base: "24px", md: "32px" }}
            gap={{ base: "15.40px", md: "24px" }}
            align="stretch"
            bg="rgba(255,255,255,0.70)"
            borderRadius="16px"
        >
            <Flex justify="space-between" align="center">
                <Text fontSize={{ base: "16px", md: "20px" }} fontWeight="600" color="Grey">
                    {MONTHS_LONG[viewMonth.getMonth()]} {viewMonth.getFullYear()}
                </Text>
                <Flex gap="16px">
                    <IconButton
                        aria-label="Previous month"
                        variant="plain"
                        minW="unset"
                        boxSize={{ base: "13.20px", md: "16.28px" }}
                        p="0"
                        color="GreyText"
                        onClick={() => onMonthChange(-1)}
                    >
                        <Icon as={LuChevronLeft} boxSize="100%" />
                    </IconButton>
                    <IconButton
                        aria-label="Next month"
                        variant="plain"
                        minW="unset"
                        boxSize={{ base: "13.20px", md: "16.28px" }}
                        p="0"
                        color="GreyText"
                        onClick={() => onMonthChange(1)}
                    >
                        <Icon as={LuChevronRight} boxSize="100%" />
                    </IconButton>
                </Flex>
            </Flex>

            <Flex justify="space-between">
                {WEEKDAYS.map((label) => (
                    <Text
                        key={label}
                        w={{ base: "27.56px", md: "34px" }}
                        textAlign="center"
                        fontSize={{ base: "12px", md: "14px" }}
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
                    <Flex
                        key={rowIndex}
                        justify="space-between"
                        align="center"
                        py="5px"
                        borderRadius="42px"
                        bg={holdsSelection ? "rgba(198,231,247,0.30)" : "transparent"}
                    >
                        {row.map((day, cellIndex) => {
                            if (!day)
                                return (
                                    <Box
                                        key={cellIndex}
                                        w={{ base: "27.56px", md: "34px" }}
                                        h={{ base: "13.78px", md: "17px" }}
                                    />
                                );

                            const selected = isSameDay(day, selectedDate);
                            return (
                                <Text
                                    key={toDateKey(day)}
                                    as="button"
                                    w={{ base: "27.56px", md: "34px" }}
                                    textAlign="center"
                                    fontSize={{ base: "12px", md: "14px" }}
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
