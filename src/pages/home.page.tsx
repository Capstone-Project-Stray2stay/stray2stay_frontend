import { Box } from "@chakra-ui/react";
import { useOutletContext } from "react-router-dom";
import { S2SPageTitle } from "../components/S2S.components";

export default function Home() {
  const { userStatus } = useOutletContext<{ userStatus: string }>();
  console.log(userStatus)
  return (
    <Box width={{ base: "100%", md: "80vw" }}>
      <S2SPageTitle title="Home" />
    </Box>
  );
}
