import { Box, Text } from "@chakra-ui/react";

export default function S2SFooter() {
    return (
        <Box bg="transparent" px={{ base: "30px", md: "9%" }} py="20px">
            <Text textAlign="center" color="LightGrey" fontSize={{base: "12px",md: "14px"}} fontWeight="600">
                Copyright © 2026 Stray2stay. All rights reserved.
            </Text>
        </Box>
    )
}