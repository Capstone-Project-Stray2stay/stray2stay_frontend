import { useState } from "react";
import { Box, Flex, Grid, GridItem, Image, SimpleGrid, Text } from "@chakra-ui/react";
import { FaCamera, FaHouse, FaPaw } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { S2SButton, S2SPetCard, S2SPetCardSkeleton } from "../components/S2S.components";
import { useRandomPets } from "../hooks/query/pet.query";
import { formatGender } from "../utils/petOptions.util";
import { districtState } from "../utils/address.util";
import PhotoSearchModal from "./home/photoSearchModal.component";

export default function Home() {
  const navigate = useNavigate();
  const { recommendedPets, isLoading, isError } = useRandomPets();
  const displayPets = recommendedPets.slice(0, 4);
  const [isPhotoSearchOpen, setIsPhotoSearchOpen] = useState(false);

  return (
    <Box width="100%">
      <Grid
        overflow="hidden"
        bgGradient="BlueYellow"
        pb={{ base: "90px", md: "150px" }}
        px={{ base: "30px", md: "9%"}}
        templateAreas={{
          base: `"title image" "Description Description" "buttons buttons"`,
          lg: `"title image" "Description image" "buttons image"`,
        }}
        templateColumns={{ base: "1fr auto", md: "1fr 200px", lg: "1fr 400px" }}
        columnGap={{ base: 4, lg: 10 }}
        rowGap={{ base: 6, lg: 3 }}
        alignItems="center"
      >
        <GridItem area="title">
          <Text
            fontSize={{ base: "32px", md: "56px", lg: "64px" }}
            color="Grey"
            fontWeight={500}
            lineHeight={{ base: "1.2", md: "1.1" }}
          >
            Take me
          </Text>
          <Text
            fontSize={{ base: "32px", md: "56px", lg: "64px" }}
            color="BlueText"
            fontWeight={500}
            lineHeight={{ base: "1.2", md: "1.1" }}
          >
            Home.
          </Text>
        </GridItem>
        <GridItem area="image" justifySelf={{ base: "end", lg: "center" }}>
          <Box position="relative" width={{ base: "140px", md: "250px", lg: "400px" }} maxW="100%">
            <Image
              src="/assets/images/cloud.png"
              alt=""
              position="absolute"
              left={{ base: "90px", md: "175px", lg: "370px" }}
              width={{ base: "80px", md: "150px", lg: "150px" }}
              zIndex={0}
              pointerEvents="none"
            />
            <Image
              src="/assets/images/house.png"
              alt="House illustration"
              width="100%"
              position="relative"
              zIndex={1}
            />
          </Box>
        </GridItem>
        <GridItem area="Description">
          <Text
            color="LightGrey"
            fontSize={{ base: "14px", lg: "lg" }}
            maxW={{ lg: "420px" }}
          >
            Every pet deserves a place to call home. Search, connect, and adopt all in one place.
          </Text>
        </GridItem>
        <GridItem area="buttons">
          <Flex direction="row" wrap="wrap" gap={{ base: 2, sm: 3 }} align="center">
            <S2SButton
              text="Adopt a Pet"
              bgColor="Yellow"
              icon={<FaPaw />}
              width={{ base: "48%", lg: "180px" }}
              onClick={() => navigate("/adopt")}
            />
            <S2SButton
              text="Rehome a Pet"
              bgColor="Blue"
              icon={<FaHouse />}
              width={{ base: "48%", lg: "180px" }}
              onClick={() => navigate("/rehome")}
            />
          </Flex>
        </GridItem>
        <Image
          src="/assets/images/cloud.png"
          alt=""
          position="absolute"
          top={{ base: "290px", md: "310px", lg: "250px" }}
          left={{ base: "0px", md: "0px", lg: "12%" }}
          width={{ base: "80px", md: "150px", lg: "150px" }}
          zIndex={0}
          pointerEvents="none"
          transform="scaleX(-1)"
        />
      </Grid>

      <Box
        mt={{ base: "-35px", md: "-85px" }}
        bg="LightBlue"
        px={{ base: "30px", md: "9%", xl: "18%" }}
        pb={{ base: "60px", md: "100px" }}
        borderTopLeftRadius={{ base: "40% 40px", md: "50% 70px", lg: "65% 120px" }}
        borderTopRightRadius={{ base: "40% 40px", md: "50% 70px", lg: "65% 120px" }}
        borderBottomLeftRadius="0px"
        borderBottomRightRadius="0px"
      >
        <Flex
          maxW="1300px"
          direction="row"
          align="center"
          justify="space-around"
          gap={{ base: 4, md: 10 }}
          zIndex={1}
          pt={"50px"}
        >
          <Image
            src="/assets/images/people_with_dog.png"
            alt="Person walking dog"
            width={{ base: "140px", md: "300px", lg: "350px" }}
            maxW="100%"
            flexShrink={0}
          />
          <Box flex="1" minW={0}>
            <Text
              fontSize={{ base: "20px", md: "32px", lg: "48px" }}
              color="Grey"
            >
              Find your match
            </Text>
            <Text
              fontSize={{ base: "20px", md: "32px", lg: "48px" }}
              color="Grey"
            >
              By Photo !
            </Text>
            <Text mt={4} color="LightGrey" fontSize={{ base: "14px", md: "xl" }}>
              Share a photo of the pet you're looking for.
              <Box as="br" />
              We'll find them for you!
            </Text>
            <Box mt={6}>
              <S2SButton
                text="Upload Photo"
                bgColor="Blue"
                icon={<FaCamera />}
                width="full"
                onClick={() => setIsPhotoSearchOpen(true)}
              />
            </Box>
          </Box>
        </Flex>
      </Box>
      <Box
        mt={{ base: "-20px", md: "-40px", lg: "-50px" }}
        bgGradient="YellowBlue"
        borderTopLeftRadius={{ base: "32px", md: "52px" }}
        borderTopRightRadius={{ base: "32px", md: "52px" }}
        borderBottomLeftRadius="0"
        borderBottomRightRadius="0"
        px={{ base: "24px", md: "9%" }}
        pb={{ base: "30px", md: "56px" }}
      >
        <Text color="Grey" fontSize={{ base: "22px", md: "32px" }} fontWeight="600" pb={6} pt={12}>
          Recommended
        </Text>
        {isLoading ? (
          <SimpleGrid columns={{ base: 2, lg: 4 }} gap={{ base: 3, md: 5 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <S2SPetCardSkeleton key={i} width="100%" height="300px" />
            ))}
          </SimpleGrid>
        ) : isError ? (
          <Flex minH="240px" align="center" justify="center">
            <Text color="Grey" fontSize="md">
              Unable to load recommended pets right now.
            </Text>
          </Flex>
        ) : displayPets.length === 0 ? (
          <Flex minH="400px" align="center" justify="center">
            <Text color="Grey" fontSize="md">
              No recommended pets available right now.
            </Text>
          </Flex>
        ) : (
          <SimpleGrid columns={{ base: 2, lg: 4 }} gap={{ base: 3, md: 5 }}>
            {displayPets.map((pet) => (
              <S2SPetCard
                key={pet.pid}
                width={{base: "169px", md: "240px"}}
                height={{base: "231px", md: "309px" }}
                petName={pet.petName}
                petImageURL={pet.petImageAddress?.[0] ?? "/assets/images/house.png"}
                petAge={pet.petAgeGroup || "Unknown age"}
                petBreed={pet.petBreed || "Mixed breed"}
                petGender={formatGender(pet.petGender)}
                petLocation={districtState(pet.petAddress) || pet.petAddress || "Location unavailable"}
                onClick={() => navigate(`/pet-profile/${pet.pid}`)}
              />
            ))}
          </SimpleGrid>
        )}
      </Box>
      <Box bg="LightBlue" px={{ base: "24px", md: "9%" }} py={{ base: "30px", md: "56px" }}>
        <Text color="Grey" fontSize={{ base: "22px", md: "36px" }} fontWeight="600">
          What We Do ?
        </Text>
        <Flex direction={{ base: "column", lg: "row" }} align="center" gap={{ base: 6, md: 12 }} pt={10}>
          <Box
            bg="rgba(135, 207, 240, 0.7)"
            borderRadius="50%"
            w={{ base: "200px", md: "300px", lg: "350px" }}
            h={{ base: "200px", md: "300px", lg: "350px" }}
            display="flex"
            alignItems="center"
            justifyContent="center"
            overflow="hidden"
            flexShrink={0}
          >
            <Image
              src="/assets/images/people_with_dog.png"
              alt="Pet section illustration"
              w="85%"
              h="85%"
              objectFit="contain"
            />
          </Box>
          <Text color="LightGrey" fontSize={{ base: "14px", md: "lg" }} lineHeight="1.35" fontWeight="500">
            We are a centralized pet adoption platform designed to make finding and adopting pets in Thailand easier, faster, and more reliable.
            <Box as="br" />
            <Box as="br" />
            Our platform helps solve common problems in pet adoption, including scattered information across social media, difficulty finding suitable pets, and lack of organized pet data. By bringing everything into one place, users can search, post, and connect with confidence.
            <Box as="br" />
            <Box as="br" />
            We also integrate AI-powered pet breed classification to help users identify pet breeds from uploaded images, improving pet discovery and supporting more accurate pet information.
          </Text>
        </Flex>

        <Text mt={{ base: 10, md: 12 }} color="Grey" fontSize={{ base: "22px", md: "36px" }} fontWeight="600">
          Our Goals
        </Text>
        <Text mt={5} color="LightGrey" fontSize={{ base: "14px", md: "lg" }} whiteSpace="pre-line" lineHeight="1.35" fontWeight="500">
          Our goal is to improve pet adoption accessibility in Thailand by creating a centralized platform that helps adopters find suitable pets more easily and efficiently. We aim to reduce the difficulty of searching for pets across scattered social media posts and unorganized sources while helping more pets find safe, caring, and suitable homes. Through technology, centralized data management, and AI-powered pet breed classification, we strive to make the adoption process more convenient, reliable, and accessible for both pet owners and adopters.
        </Text>
      </Box>

      <PhotoSearchModal
        isOpen={isPhotoSearchOpen}
        onClose={() => setIsPhotoSearchOpen(false)}
      />
    </Box>
  );
}