import { useNavigate } from "react-router-dom";
import { Box, Flex, Heading, Text, VStack } from "@chakra-ui/react";

import { S2SButton } from "../components/S2S.components";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Box w="100%" h="100vh" bgGradient="BlueYellow">
      <Flex w="100%" h="100%" align="center" justify="center" px="25px">
        <VStack gap={4} textAlign="center">
          <Heading size="6xl" color="Blue">
            404
          </Heading>
          <Heading size="lg" color="Grey">
            Page Not Found
          </Heading>
          <Text color="LightGrey" mb={2}>
            The page you're looking for doesn't exist or has been moved.
          </Text>
          <S2SButton text="Go back home" bgColor="Blue" onClick={() => navigate("/")} />
        </VStack>
      </Flex>
    </Box>
  );
}
