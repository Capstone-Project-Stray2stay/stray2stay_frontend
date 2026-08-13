import { Box } from "@chakra-ui/react";
import { useOutletContext } from "react-router-dom";
import { S2SPageTitle, S2SPetCard } from "../components/S2S.components";

export default function Home() {
  const { userStatus } = useOutletContext<{ userStatus: string }>();
  console.log(userStatus)
  return (
    <Box width={{ base: "100%", md: "80vw" }}>
      <S2SPageTitle title="Home" />
      <Box display="flex" flexWrap="wrap" gap={4} justifyContent="center">
        <S2SPetCard
          rank={1}
          width="300px"
          petName="Buddy"
          petImageURL="https://images.unsplash.com/photo-1601758123927-3c5b0f8e4f9d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
          petAge="2 years"
          petBreed="Golden Retriever"
          petGender="Male"
          petLocation="New York, NY"
          onClick={() => console.log("Clicked on Buddy")}
        />
        <S2SPetCard
          rank={2}
          width="300px"
          petName="Luna"
          petImageURL="https://images.unsplash.com/photo-1612197521680-1f3e5b8c6f9d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
          petAge="Mature"
          petBreed="Siamese Cat"
          petGender="Female"
          petLocation="Los Angeles, CA"
          onClick={() => console.log("Clicked on Luna")}
        />
        <S2SPetCard
          rank={3}
          width="220px"
          petName="Max"
          petImageURL="https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
          petAge="Mature"
          petBreed="Beagle"
          petGender="Male"
          petLocation="Chicago, IL"
          onClick={() => console.log("Clicked on Max")}
        />
        <S2SPetCard
          rank={4}
          width="220px"
          petName="Max"
          petImageURL="https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
          petAge="Mature"
          petBreed="Beagle"
          petGender="Male"
          petLocation="Chicago, IL"
          onClick={() => console.log("Clicked on Max")}
        />
      </Box>
    </Box>
  );
}