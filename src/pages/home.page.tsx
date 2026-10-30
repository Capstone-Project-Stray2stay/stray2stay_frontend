import { useState } from "react";
import { Box, Flex, Grid, GridItem, Image, Text, useBreakpointValue } from "@chakra-ui/react";
import { FaCamera, FaHouse, FaPaw } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { S2SButton, S2SPetCard, S2SPetCardSkeleton } from "../components/S2S.components";
import { useRandomPets } from "../hooks/query/pet.query";
import { formatGender } from "../utils/petOptions.util";
import { districtState } from "../utils/address.util";
import PhotoSearchModal from "../components/home/photoSearchModal.component";

// Figma: fixed 240px cards pushed to both edges, 32px between rows. Capped at the design's
// 1043px content width so wide screens don't spread the cards; left-aligned under the heading
const CARD_GRID = {
  maxW: "1043px",
  templateColumns: { base: "repeat(2, auto)", lg: "repeat(4, 240px)" },
  justifyContent: "space-between",
  columnGap: { base: 3, md: 5 },
  rowGap: { base: 3, md: "32px" },
};
 
export default function Home() {
  const navigate = useNavigate();
  const { recommendedPets, isLoading, isError } = useRandomPets();
  // Figma: 2 rows of 4 on desktop, 3 rows of 2 on mobile
  const petCount = useBreakpointValue({ base: 6, lg: 8 }) ?? 6;
  const displayPets = recommendedPets.slice(0, petCount);
  const [isPhotoSearchOpen, setIsPhotoSearchOpen] = useState(false);

  return (
    <Box width="100%">
      <Grid
        position="relative"
        overflow="hidden"
        bgGradient="HomeHero"
        pb={{ base: "90px", md: "150px" }}
        px={{ base: "30px", md: "9%"}}
        templateAreas={{
          base: `"title image" "Description Description" "buttons buttons"`,
          lg: `"title image" "Description image" "buttons image"`,
        }}
        templateColumns={{ base: "1fr auto", md: "1fr 200px", lg: "1fr 438px" }}
        columnGap={{ base: 4, lg: 10 }}
        rowGap={{ base: 6, lg: "17px" }}
        alignItems="center"
      >
        <GridItem area="title" position="relative" zIndex={1}>
          <Text
            fontSize={{ base: "32", md: "56", lg: "60" }}
            color="Grey"
            fontWeight={500}
            lineHeight={{ base: "1.2", md: "1.1" }}
          >
            Take me
          </Text>
          <Text
            fontSize={{ base: "32", md: "56", lg: "60" }}
            color="TitleBlue"
            fontWeight={500}
            lineHeight={{ base: "1.2", md: "1.1" }}
          >
            Home.
          </Text>
        </GridItem>
        <GridItem area="image" justifySelf={{ base: "end", lg: "center" }} position="relative" zIndex={1}>
          <Box position="relative" width={{ base: "140px", md: "250px", lg: "438px" }} maxW="100%">
            <Image
              src="/assets/images/house.png"
              alt="House illustration"
              width="100%"
              position="relative"
              zIndex={1}
            />
          </Box>
        </GridItem>
        <GridItem area="Description" position="relative" zIndex={1}>
          <Text
            color="GreyText"
            fontSize={{ base: "14", lg: "20" }}
            fontWeight={500}
            maxW={{ lg: "533px" }}
          >
            Every pet deserves a place to call home. Search, connect, and adopt all in one place.
          </Text>
        </GridItem>
        <GridItem area="buttons" pt={{ lg: "13px" }} position="relative" zIndex={1}>
          <Flex direction="row" wrap="wrap" gap={{ base: 2, sm: 3, lg: 5 }} align="center">
            <S2SButton
              text="Adopt a Pet"
              bgColor="Orange"
              icon={<FaPaw />}
              width={{ base: "48%", lg: "200px" }}
              height={{ lg: "48px" }}
              fontSize={{ lg: "20" }}
              onClick={() => navigate("/adopt")}
            />
            <S2SButton
              text="Rehome a Pet"
              bgColor="Blue"
              icon={<FaHouse />}
              width={{ base: "48%", lg: "220px" }}
              height={{ lg: "48px" }}
              fontSize={{ lg: "20" }}
              onClick={() => navigate("/rehome")}
            />
          </Flex>
        </GridItem>
        <Image
          src="/assets/images/cloud.png"
          alt=""
          position="absolute"
          top="0px"
          right="0px"
          width={{ base: "80px", md: "120px", lg: "135px" }}
          zIndex={0}
          pointerEvents="none"
        />
        <Image
          src="/assets/images/cloud.png"
          alt=""
          position="absolute"
          top={{ base: "230px", md: "240px", lg: "260px" }}
          left={{ base: "16px", md: "0px", lg: "0px" }}
          width={{ base: "60px", md: "100px", lg: "120px" }}
          zIndex={0}
          pointerEvents="none"
          transform="scaleX(-1)"
        />
      </Grid>

      <Box
        position="relative"
        zIndex={1}
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
          justify="center"
          gap={{ base: 4, md: 10 }}
          zIndex={1}
          pt={"50px"}
        >
          <Box position="relative" flexShrink={0} width={{ base: "140px", md: "300px", lg: "424px" }} maxW="100%">
            {/* yellow sun glow behind the illustration */}
            <Box
              position="absolute"
              top="12%"
              left="28%"
              w="73%"
              aspectRatio={1}
              bg="GlowYellow"
              borderRadius="full"
              filter="blur(44.59px)"
              pointerEvents="none"
            />
            <Image
              src="/assets/images/people_with_dog.png"
              alt="Person walking dog"
              width="100%"
              position="relative"
            />
          </Box>
          <Box flex="1" minW={0} maxW={{ lg: "440px" }}>
            <Text
              fontSize={{ base: "20", md: "32", lg: "40" }}
              color="Grey"
              fontWeight={500}
            >
              Find your match
              <Box as="br" />
              By Photo !
            </Text>
            <Text mt={{ base: 4, lg: "21px" }} color="GreyText" fontSize={{ base: "14", md: "20" }} fontWeight={500}>
              Share a photo of the pet you're looking for.
              We'll find them for you!
            </Text>
            <Box mt={{ base: 6, lg: "32px" }}>
              <S2SButton
                text="Upload Photo"
                bgColor="Blue"
                icon={<FaCamera />}
                width="full"
                height={{ lg: "48px" }}
                fontSize={{ lg: "20" }}
                onClick={() => setIsPhotoSearchOpen(true)}
              />
            </Box>
          </Box>
        </Flex>
      </Box>

      {/* Recommended + What We Do share one continuous gradient in Figma */}
      <Box position="relative" zIndex={2}
        mt={{ base: "-20px", md: "-40px", lg: "-50px" }}
        bgGradient="HomeContent"
        borderTopLeftRadius={{ base: "32px", md: "52px", lg: "80px" }}
        borderTopRightRadius={{ base: "32px", md: "52px", lg: "80px" }}
        borderBottomLeftRadius="0"
        borderBottomRightRadius="0"
        px={{ base: "24px", md: "9%" }}
        pt={{ base: 12, lg: "80px" }}
        pb={{ base: "30px", md: "56px" }}
      >
        <Text color="Grey" fontSize={{ base: "22", md: "32" }} fontWeight="600" pb={{ base: 6, lg: "32px" }}>
          Recommended
        </Text>
        {isLoading ? (
          <Grid {...CARD_GRID}>
            {Array.from({ length: petCount }).map((_, i) => (
              <S2SPetCardSkeleton key={i} width={{base: "169px", md: "240px"}} height={{base: "231px", md: "309px" }} />
            ))}
          </Grid>
        ) : isError ? (
          <Flex minH="240px" align="center" justify="center">
            <Text color="Grey" fontSize="16">
              Unable to load recommended pets right now.
            </Text>
          </Flex>
        ) : displayPets.length === 0 ? (
          <Flex minH="400px" align="center" justify="center">
            <Text color="Grey" fontSize="16">
              No recommended pets available right now.
            </Text>
          </Flex>
        ) : (
          <Grid {...CARD_GRID}>
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
          </Grid>
        )}

          <Box as="section" aria-labelledby="what-we-do-title" mt={{ base: 12, lg: "112px" }} maxW="1180px" mx="auto">
            <Text
              id="what-we-do-title"
              as="h2"
              color="Grey"
              fontSize={{ base: "28px", md: "30px", lg: "30px" }}
              fontWeight="600"
              lineHeight="1.2"
            >
              What We Do ?
            </Text>

            <Grid
              templateColumns={{ base: "1fr", lg: "minmax(0, 1fr) minmax(0, 1fr)" }}
              gap={{ base: 5, md: 7, lg: 10 }}
              mt={{ base: 5, md: 6 }}
              alignItems="center"
            >
              <Flex minH={{ base: "210px", md: "280px", lg: "330px" }} align="center" justify="center">
                <Image
                  src="/assets/images/dog_high_five.png"
                  alt="Dog giving a high five"
                  w="100%"
                  maxW={{ base: "350px", lg: "470px" }}
                  objectFit="contain"
                />
              </Flex>

              <Box maxW="440px">
                <Text color="GreyText" fontSize={{ base: "15px", md: "17px" }} lineHeight="1.3">
                  We are a centralized pet adoption platform designed to make finding and adopting pets in Thailand easier, faster, and more reliable.
                </Text>
                <Text mt={{ base: 4, md: 5 }} color="GreyText" fontSize={{ base: "15px", md: "17px" }} lineHeight="1.3">
                  Our platform helps solve common problems in pet adoption, including scattered information across social media, difficulty finding suitable pets, and lack of organized pet data. By bringing everything into one place, users can search, post, and connect with confidence.
                </Text>
                <Text mt={{ base: 4, md: 5 }} color="GreyText" fontSize={{ base: "15px", md: "17px" }} lineHeight="1.3">
                  We also integrate AI-powered pet breed classification to help users identify pet breeds from uploaded images, improving pet discovery and supporting more accurate pet information.
                </Text>
              </Box>
            </Grid>

            <Box mt={{ base: 8, lg: 5 }} ml={{ base: 0, lg: "100px" }} maxW={{ lg: "860px" }}>
              <Text as="h3" color="Grey" fontSize={{ base: "27px", md: "30px" }} fontWeight="600" lineHeight="1.2">
                Our Goals
              </Text>
              <Text mt={{ base: 4, md: 5 }} color="GreyText" fontSize={{ base: "15px", md: "17px" }} lineHeight="1.3">
                Our goal is to improve pet adoption accessibility in Thailand by creating a centralized platform that helps adopters find suitable pets more easily and efficiently. We aim to reduce the difficulty of searching for pets across scattered social media posts and unorganized sources while helping more pets find safe, caring, and suitable homes. Through technology, centralized data management, and AI-powered pet breed classification, we strive to make the adoption process more convenient, reliable, and accessible for both pet owners and adopters.
              </Text>
            </Box>
          </Box>
        </Box>

      <PhotoSearchModal
        isOpen={isPhotoSearchOpen}
        onClose={() => setIsPhotoSearchOpen(false)}
      />
    </Box>
  );
}
