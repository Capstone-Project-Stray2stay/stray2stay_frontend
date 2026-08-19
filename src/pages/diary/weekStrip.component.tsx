import { Box, Flex, Text, VStack } from "@chakra-ui/react";

import { MONTHS_SHORT, WEEKDAYS, isSameDay, toDateKey, weekOf } from "./dateUtils";

export default function WeekStrip({
    selectedDate,
    entryDateKeys,
    onSelect,
}: {
    selectedDate: Date;
    /** Days that already hold at least one entry — marked with a dot. */
    entryDateKeys: Set<string>;
    onSelect: (date: Date) => void;
}) {
    const days = weekOf(selectedDate);

    return (
        <Flex align="flex-start" gap="24px" w="100%">
            <Text fontSize="24px" fontWeight="600" color="Grey" pt="4px">
                {MONTHS_SHORT[selectedDate.getMonth()]}
            </Text>

            <Flex flex="1" justify="space-between" align="center">
                {days.map((day) => {
                    const selected = isSameDay(day, selectedDate);
                    const hasEntries = entryDateKeys.has(toDateKey(day));

                    return (
                        <VStack
                            key={toDateKey(day)}
                            as="button"
                            gap="6.86px"
                            cursor="pointer"
                            onClick={() => onSelect(day)}
                        >
                            <Text fontSize="17.14px" fontWeight="500" color="BlueText">
                                {WEEKDAYS[day.getDay()]}
                            </Text>
                            {/* Figma exports the circle and the number as separate
                                absolutely-positioned nodes; they overlap in the
                                design, so the number belongs inside the circle. */}
                            <Flex
                                boxSize="41.99px"
                                align="center"
                                justify="center"
                                borderRadius="full"
                                borderWidth="0.61px"
                                borderColor="BabyGray"
                                bg={selected ? "Cream" : "white"}
                                transition="background 0.15s ease"
                            >
                                <Text fontSize="17.14px" fontWeight="500" color="GreyText">
                                    {day.getDate()}
                                </Text>
                            </Flex>
                            {/* Sits under the circle rather than inside it, where
                                it would collide with the date. */}
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
