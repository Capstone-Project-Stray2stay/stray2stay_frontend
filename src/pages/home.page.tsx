import { Box, Flex } from "@chakra-ui/react";

import { S2SPageTitle } from "../components/S2S.components";

export default function Home() {
  return (
    <Box width={{ base: "100%", md: "88vw" }}>
      <S2SPageTitle title="Home" />
    </Box>
  );
}
