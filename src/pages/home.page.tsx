import { useState } from "react";
import { Box, Flex, Grid, GridItem, Image, Text, useBreakpointValue } from "@chakra-ui/react";
import { FaHouse } from "react-icons/fa6";
import PawIcon from "../components/icons/pawIcon.component";
import { useNavigate } from "react-router-dom";
import { S2SButton, S2SPetCard, S2SPetCardSkeleton } from "../components/S2S.components";
import { useRandomPets } from "../hooks/query/pet.query";
import { formatGender } from "../utils/petOptions.util";
import { districtState } from "../utils/address.util";
import PhotoSearchModal from "../components/home/photoSearchModal.component";
import AICameraIcon from "../components/icons/aiCameraIcon.component";

// Figma: fixed 240px cards pushed to both edges, 32px between rows. Capped at the design's
// 1043px content width so wide screens don't spread the cards; left-aligned under the heading
const CARD_GRID = {
  maxW: "1043px",
  templateColumns: { base: "repeat(2, auto)", lg: "repeat(4, 240px)" },
  justifyContent: "space-between",
  columnGap: { base: 3, md: 5 },
  rowGap: { base: 3, md: "32px" },
};

// Height of the layout's S2SFooter (20px padding top/bottom + one line of 12px/14px text)
const FOOTER_OVERLAP = { base: "-57px", md: "-60px" };

const GOALS = [
  {
    title: "Easier to find",
    description: "Improve pet adoption accessibility in Thailand with one platform and centralized data, so adopters find suitable pets more easily.",
    bg: "PaleYellow",
  },
  {
    title: "Safe, caring homes",
    description: "Help more pets find suitable homes while reducing the effort of searching across social media posts.",
    bg: "White",
    icon: { src: "/assets/icons/goal_caring_home.png", size: "120px" },
  },
  {
    title: "Smarter with AI",
    description: "Use AI breed classification from uploaded images to improve discovery and pet information.",
    bg: "PaleYellow",
    icon: { src: "/assets/icons/goal_ai.png", size: "110px" },
  },
];

// Figma: the "Easier to find" icon is a magnifier with a paw sitting inside the lens
function SearchPawIcon() {
  return (
    <Box position="relative" w="112px" h="112px">
      <Image src="/assets/icons/goal_search.png" alt="" w="110px" h="110px" />
      <Image src="/assets/icons/paw_blue.svg" alt="" position="absolute" left="19px" top="19px" w="48px" h="48px" />
    </Box>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { recommendedPets, isLoading, isError } = useRandomPets();
  // Figma: 2 rows of 4 on desktop, 3 rows of 2 on mobile
  const petCount = useBreakpointValue({ base: 6, lg: 8 }) ?? 6;
  const displayPets = recommendedPets.slice(0, petCount);
  const [isPhotoSearchOpen, setIsPhotoSearchOpen] = useState(false);

  return (
    <Box width="100%">
      {/* hero + photo search share one box so the clouds can straddle the arc between them */}
      <Box position="relative" overflow="hidden">
      <Grid
        position="relative"
        overflow="hidden"
        bgGradient="HomeHero"
        pt={{ lg: "48px" }}
        pb={{ base: "90px", md: "150px", lg: "175px" }}
        px={{ base: "30px", md: "9%"}}
        templateAreas={{
          base: `"title image" "Description Description" "buttons buttons"`,
          lg: `"title image" "Description image" "buttons image"`,
        }}
        templateColumns={{ base: "1fr auto", md: "1fr 250px", lg: "1fr 380px", xl: "1fr 510px" }}
        columnGap={{ base: 4, lg: 10, xl: 0 }}
        rowGap={{ base: 6, lg: "17px" }}
        alignItems={{ base: "center", lg: "end" }}
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
        <GridItem area="image" justifySelf="end" position="relative" zIndex={1}>
          {/* Figma frame is 510x302; offsets are % of it so the drawing scales with the frame */}
          <Box position="relative" width={{ base: "140px", md: "250px", lg: "380px", xl: "510px" }} maxW="100%" aspectRatio="510 / 302">
            <Image
              src="/assets/images/home_house_cat_dog.png"
              alt="Dog house with a cat and a dog"
              position="absolute"
              left="3.3%"
              top="6.3%"
              width="89%"
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
              // 1.2em keeps the paw art the same width the old full-bleed FaPaw had (art is 40/48 of the frame)
              icon={<PawIcon size="1.2em" />}
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
      </Grid>

      <Image
        src="/assets/images/cloud.png"
        alt=""
        position="absolute"
        top={{ base: "0px", md: "40px", lg: "80px" }}
        right={{ base: "-10px", lg: "-35px" }}
        width={{ base: "80px", md: "140px", lg: "210px" }}
        zIndex={0}
        pointerEvents="none"
      />
      {/* sits in front of the arc; translucent so it picks up the blue below the arc as in Figma */}
      <Image
        src="/assets/images/cloud.png"
        alt=""
        position="absolute"
        top={{ base: "230px", md: "240px", lg: "406px" }}
        left={{ base: "0px", lg: "-12px" }}
        width={{ base: "60px", md: "120px", lg: "180px" }}
        opacity={0.7}
        zIndex={2}
        pointerEvents="none"
        transform="scaleX(-1)"
      />

      <Box
        position="relative"
        zIndex={1}
        mt={{ base: "-35px", md: "-85px", lg: "-100px" }}
        bgGradient="HomeWave"
        px={{ base: "30px", md: "9%" }}
        pb={{ base: "60px", md: "100px", lg: "149px" }}
        // Figma's arc is a slice of a much wider ellipse: flat near the middle, ~80px drop at the edges
        clipPath={{
          base: "ellipse(600px 400px at 50% 400px)",
          md: "ellipse(1000px 600px at 50% 600px)",
          lg: "ellipse(1500px 865px at 50% 865px)",
        }}
      >
        <Flex
          maxW="1300px"
          direction="row"
          align="center"
          justify="center"
          gap={{ base: 4, md: 10, xl: "112px" }}
          zIndex={1}
          pt={{ base: "50px", lg: "77px" }}
        >
          <Flex
            flexShrink={0}
            width={{ base: "140px", md: "260px", xl: "308px" }}
            maxW="100%"
            aspectRatio="308 / 320"
            align="center"
            justify="center"
          >
            <Image
              src="/assets/images/home_girl_with_pets.png"
              alt="Girl hugging a cat and a dog"
              width="94.5%"
            />
          </Flex>
          <Box flex="1" minW={0} maxW={{ lg: "440px" }} pt={{ xl: "24px" }}>
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
                icon={<AICameraIcon />}
                // Figma "Large" button: 24/12 padding, 8 gap, 24px icon, 20/600 text
                size="lg"
                width="full"
                onClick={() => setIsPhotoSearchOpen(true)}
              />
            </Box>
          </Box>
        </Flex>
      </Box>
      </Box>

      {/* Recommended + What We Do share one continuous gradient in Figma. It runs on under
          the layout footer (negative mb = footer height) so the copyright sits on it too */}
      <Box position="relative" zIndex={2}
        mt={{ base: "-20px", md: "-40px", lg: "-80px" }}
        mb={FOOTER_OVERLAP}
        bgGradient="HomeContent"
        borderTopLeftRadius={{ base: "32px", md: "52px", lg: "80px" }}
        borderTopRightRadius={{ base: "32px", md: "52px", lg: "80px" }}
        borderBottomLeftRadius="0"
        borderBottomRightRadius="0"
        px={{ base: "24px", md: "9%" }}
        pt={{ base: 12, lg: "59px" }}
        pb={{ base: "87px", md: "136px", lg: "168px" }}
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

          <Box as="section" aria-labelledby="what-we-do-title" mt={{ base: 12, lg: "128px" }}>
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
            <Text mt={{ base: 4, md: "24px" }} color="GreyText" fontSize={{ base: "15px", md: "17px" }} lineHeight="1.3">
              We are a centralized pet adoption platform in Thailand. Our mission is to make finding and adopting pets easier, faster, and more reliable, by bringing scattered posts and pet data into one place, with AI breed classification to help identify pets from photos.
            </Text>
            <Flex mt={{ base: 6, md: "32px" }} justify="center" gap={{ base: 10, md: "144px" }}>
              {[
                { value: "45", label: "Dog breeds classified" },
                { value: "19", label: "Cat breeds classified" },
              ].map((stat) => (
                <Flex key={stat.label} direction="column" align="center" gap="4px" lineHeight="normal">
                  {/* Figma "auto" line height (Chakra's 1.5 would pad the 4px gap by ~10px).
                      Number: Figma 27 minus the team's 1px; no "27" theme token, so set directly. */}
                  <Text color="Grey" fontSize="26px" fontWeight="600">
                    {stat.value}
                  </Text>
                  <Text color="GreyText" fontSize={{ base: "15px", md: "20px" }} fontWeight="500" textAlign="center">
                    {stat.label}
                  </Text>
                </Flex>
              ))}
            </Flex>

            <Box mt={{ base: 12, lg: "80px" }}>
              <Text as="h3" color="Grey" fontSize={{ base: "27px", md: "30px" }} fontWeight="600" lineHeight="1.2">
                Our Goals
              </Text>
              <Text mt={{ base: 4, md: "24px" }} color="GreyText" fontSize={{ base: "15px", md: "17px" }} lineHeight="1.3">
                We want more pets to find safe, caring, and suitable homes. By combining technology with centralized data, we make it easier for adopters to find the right pet and for pet owners to reach people who are ready to adopt.
              </Text>
              <Grid mt={{ base: 6, md: "32px" }} templateColumns={{ base: "1fr", lg: "repeat(3, minmax(0, 1fr))" }} gap={{ base: 5, md: "32px" }}>
                {GOALS.map((goal) => (
                  <Flex
                    key={goal.title}
                    direction="column"
                    align="center"
                    gap="12px"
                    p="24px"
                    bg={goal.bg}
                    borderRadius="16px"
                    boxShadow="0px 4px 4px rgba(0, 0, 0, 0.05)"
                  >
                    <Flex h="150px" align="center">
                      {goal.icon ? (
                        <Image src={goal.icon.src} alt="" w={goal.icon.size} h={goal.icon.size} />
                      ) : (
                        <SearchPawIcon />
                      )}
                    </Flex>
                    <Text color="Grey" fontSize={{ base: "20px", md: "24px" }} fontWeight="600" textAlign="center">
                      {goal.title}
                    </Text>
                    <Text color="GreyText" fontSize={{ base: "15px", md: "18px" }} letterSpacing="0.54px" textAlign="center">
                      {goal.description}
                    </Text>
                  </Flex>
                ))}
              </Grid>
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
