import { Fragment } from "react";
import { Box, Circle, Flex, Text } from "@chakra-ui/react";

import type { S2SStepperType } from "../types/component.type";

const CIRCLE_SHADOW = {
    base: "0px 2.02px 10.1px rgba(201, 220, 225, 0.20)",
    md: "0px 3.1px 15.5px rgba(201, 220, 225, 0.20)",
};

export default function S2SStepper({ steps, current }: S2SStepperType) {
    return (
        <Flex align="flex-start" justify="center" wrap="nowrap" w="100%">
            {steps.map((label, i) => {
                const step = i + 1;
                // Steps already passed stay filled alongside the current one;
                // only steps still ahead are white.
                const isDone = step <= current;
                const isCurrent = step === current;

                return (
                    <Fragment key={label}>
                        {i > 0 && (
                            // Sits on the circles' vertical centre, not on the
                            // centre of this taller circle+label column.
                            // Grows to fill whatever is left between the labels,
                            // so the row spreads across the width on a phone
                            // instead of bunching up in the middle. Capped on
                            // desktop at the width the design specifies.
                            <Box
                                flex="1"
                                minW={{ base: "12px", md: "0" }}
                                maxW={{ base: "none", md: "160px" }}
                                h="2px"
                                bg="Blue"
                                mt={{ base: "16px", md: "23px" }}
                            />
                        )}
                        <Flex
                            direction="column"
                            align="center"
                            justify="space-between"
                            h={{ base: "56px", md: "86px" }}
                            flexShrink={0}
                        >
                            <Circle
                                // Mobile keeps every circle the same size —
                                // there isn't room to enlarge the current one.
                                size={{ base: "33.85px", md: isCurrent ? "51.92px" : "48px" }}
                                borderWidth={{ base: "1.01px", md: "1.55px" }}
                                borderColor="YellowBorder"
                                bg={isDone ? "Cream" : "White"}
                                boxShadow={CIRCLE_SHADOW}
                                transition="all 0.15s ease"
                            >
                                <Text
                                    fontSize={{ base: "14px", md: "20px" }}
                                    fontWeight="600"
                                    color="Grey"
                                >
                                    {step}
                                </Text>
                            </Circle>
                            <Text
                                fontSize={{ base: "12px", md: "18px" }}
                                fontWeight="500"
                                color="Grey"
                                whiteSpace="nowrap"
                            >
                                {label}
                            </Text>
                        </Flex>
                    </Fragment>
                );
            })}
        </Flex>
    );
}
