import { Outlet, ScrollRestoration } from "react-router-dom";
import { Box, Flex } from "@chakra-ui/react";

import { S2SSidebar, S2SNavbar, S2SFooter } from "../components/S2S.components";
import { useNewUserStatus } from "../hooks/query/auth.query";

export default function MainLayout() {
  const { userStatus } = useNewUserStatus();
  return (
    <Box minH={{ base: "100vh", md: "111.111vh" }} width="100%" maxW={{ base: "100vw", md: "111.111vw" }} overflowX="hidden" bgGradient="PageBackground">
      <ScrollRestoration />
      <S2SNavbar />
      <Box minH="100vh" >
        <S2SSidebar />
        <Flex ml={{ base: "0", lg: "12vw" }} pt={{ base: 2, lg: "64px" }} width={{ base: "100%", lg: "calc(100% - 12vw)" }} minW={0} justifyContent={"center"} alignItems={"center"} flexDirection={"column"}>
          <Outlet context={{ userStatus }} />
          <S2SFooter />
        </Flex>
      </Box>
    </Box>
  );
}