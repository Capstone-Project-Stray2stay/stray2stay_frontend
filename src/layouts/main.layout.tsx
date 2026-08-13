import { Outlet } from "react-router-dom";
import { Box, Flex } from "@chakra-ui/react";

import { S2SSidebar, S2SNavbar } from "../components/S2S.components";

export default function MainLayout() {
  return (
    <Box minH="100vh" width={"100%"}>
      <S2SNavbar />
      <Box bgGradient="BlueYellow" minH="100vh" >
        <S2SSidebar />
        <Flex ml={{base: "0", md: "12vw"}} px={{base: 8, md: 16}} pt={{base: 2, md: 8}} width={{base: "100vw", md: "88vw"}} justifyContent={"center"}>
          <Outlet />
        </Flex>
      </Box>
      {/* <Footer /> */}
    </Box>
  );
}