import { Fragment } from "react";
import { Box, Circle, Flex, Text } from "@chakra-ui/react";

import type { S2SStepperType } from "../types/component.type";

const CIRCLE_SHADOW = "0px 3.1px 15.5px rgba(201, 220, 225, 0.20)";

export default function S2SStepper({ steps, current }: S2SStepperType) {
    return (
        <Flex align="flex-start" justify="center" wrap="nowrap">
            {steps.map((label, i) => {
                const step = i + 1;
                // Steps already passed stay filled alongside the current one;
                // only steps still ahead are white.
                const isDone = step <= current;
                const isCurrent = step === current;

                return (
                    <Fragment key={label}>
                        {i > 0 && (
                            // Sits on the circles' vertical centre (24px of 48px),
                            // not on the centre of this taller circle+label column.
                            <Box
                                w={{ base: "40px", md: "160px" }}
                                h="2px"
                                bg="Blue"
                                mt="23px"
                                flexShrink={1}
                            />
                        )}
                        <Flex
                            direction="column"
                            align="center"
                            justify="space-between"
                            h="86px"
                            flexShrink={0}
                        >
                            <Circle
                                // The current step is drawn slightly larger.
                                size={isCurrent ? "51.92px" : "48px"}
                                borderWidth="1.55px"
                                borderColor="YellowBorder"
                                bg={isDone ? "Cream" : "White"}
                                boxShadow={CIRCLE_SHADOW}
                                transition="all 0.15s ease"
                            >
                                <Text fontSize="20px" fontWeight="600" color="Grey">
                                    {step}
                                </Text>
                            </Circle>
                            <Text fontSize="18px" fontWeight="500" color="Grey" whiteSpace="nowrap">
                                {label}
                            </Text>
                        </Flex>
                    </Fragment>
                );
            })}
        </Flex>
    );
}
