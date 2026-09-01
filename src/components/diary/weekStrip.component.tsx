import { Box, Flex, Text, VStack } from "@chakra-ui/react";

import { MONTHS_LONG, MONTHS_SHORT, WEEKDAYS, isSameDay, toDateKey, weekOf } from "../../utils/dateUtils";

export default function WeekStrip({
    selectedDate,
    entryDateKeys,
    onSelect,
}: {
    selectedDate: Date;
    entryDateKeys: Set<string>;
    onSelect: (date: Date) => void;
}) {
    const days = weekOf(selectedDate);

    return (
        <Flex
            direction={{ base: "column", md: "row" }}
            align={{ base: "stretch", md: "flex-start" }}
            gap={{ base: "14px", md: "24px" }}
            w="100%"
        >
            <Text
                display={{ base: "block", md: "none" }}
                fontSize="16px"
                fontWeight="600"
                color="Grey"
            >
                {MONTHS_LONG[selectedDate.getMonth()]}
            </Text>
            <Text
                display={{ base: "none", md: "block" }}
                fontSize="24px"
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
                                fontSize={{ base: "13.75px", md: "17.14px" }}
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
                                    fontSize={{ base: "13.75px", md: "17.14px" }}
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
