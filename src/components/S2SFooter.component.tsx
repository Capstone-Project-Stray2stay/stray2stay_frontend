import { Box, Text } from "@chakra-ui/react";

export default function S2SFooter() {
    return (
        // positioned above page content so the home page can extend its background underneath
        <Box bg="transparent" px={{ base: "24px", md: "9%" }} py="20px" position="relative" zIndex={2}>
            <Text textAlign="center" color="GreyInfo" fontSize={{base: "12",md: "14"}} fontWeight="600">
                Copyright © 2026 Stray2stay. All rights reserved.
            </Text>
        </Box>
    )
}