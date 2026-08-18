import { Box, Flex, Image, SimpleGrid, Text } from "@chakra-ui/react";
import { FaCamera, FaHouse, FaPaw } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { S2SButton, S2SPetCard } from "../components/S2S.components";

const RECOMMENDED_PETS = Array.from({ length: 8 }, (_, index) => ({
  id: index + 1,
  name: "Pet Name",
  location: "Location",
  breed: "Breed",
  age: "Age",
  gender: index % 2 === 0 ? "Male" : "Female",
  image: "/assets/images/house.png",
}));

const WHAT_WE_DO_TEXT = `We are a centralized pet adoption platform designed to make finding and adopting pets in Thailand easier, faster, and more reliable.

Our platform helps solve common problems in pet adoption, including scattered information across social media, difficulty finding suitable pets, and lack of organized pet data. By bringing everything into one place, users can search, post, and connect with confidence.

We also integrate AI-powered pet breed classification to help users identify pet breeds from uploaded images, improving pet discovery and supporting more accurate pet information.`;

const OUR_GOALS_TEXT = `Our goal is to improve pet adoption accessibility in Thailand by creating a centralized platform that helps adopters find suitable pets more easily and efficiently. We aim to reduce the difficulty of searching for pets across scattered social media posts and unorganized sources while helping more pets find safe, caring, and suitable homes. Through technology, centralized data management, and AI-powered pet breed classification, we strive to make the adoption process more convenient, reliable, and accessible for both pet owners and adopters.`;

export default function Home() {
  const navigate = useNavigate();
  return (
    <Box width="100%">
      <Flex
        direction={{ base: "column", lg: "row" }}
        justify="space-around"
        align="center"
        bgGradient="BlueYellow"
        pb={{ base: 10, md: 40 }}
      >
        <Box>
          <Text
            fontSize={{ base: "48px", md: "64px" }}
            color="Grey"
            fontWeight={500}
          >
            Take me
          </Text>
          <Text
            fontSize={{ base: "48px", md: "64px" }}
            color="BlueText"
            fontWeight={500}
          >
            Home.
          </Text>
          <Text
            mt={4}
            color="LightGrey"
            fontSize={{ base: "md", md: "lg" }}
            maxW="420px"
          >
            Lorem ipsum dolor sit amet consectetur. Lobortis vitae lectus eget
            magna facilisis.
          </Text>
          <Flex
            mt={6}
            direction={{ base: "column", sm: "row" }}
            gap={3}
            align={{ base: "stretch", sm: "center" }}
          >
            <S2SButton
              text="Adopt a Pet"
              bgColor="Yellow"
              icon={<FaPaw />}
              width="180px"
              onClick={() => navigate("/adopt")}
            />
            <S2SButton
              text="Rehome a Pet"
              bgColor="Blue"
              icon={<FaHouse />}
              width="180px"
              onClick={() => navigate("/rehome")}
            />
          </Flex>
        </Box>
        <Image
          src="/assets/images/house.png"
          alt="House illustration"
          width={{ base: "280px", md: "400px" }}
          maxW="100%"
        />
      </Flex>

      <Box
        mt={{ base: 10, md: "-110px" }}
        bg="LightBlue"
        px={{ base: 4, md: "112px" }}
        py={{ base: 8, md: "56px" }}
        style={{
          borderTopLeftRadius: "55% 120px",
          borderTopRightRadius: "55% 120px",
          borderBottomLeftRadius: "0px",
          borderBottomRightRadius: "0px",
        }}
      >
        <Flex
          direction={{ base: "column", lg: "row" }}
          align="center"
          justify="space-around"
          gap={{ base: 8, md: 10 }}
          position="relative"
          zIndex={1}
        >
          <Image
            src="/assets/images/people_with_dog.png"
            alt="Person walking dog"
            width={{ base: "230px", md: "400px" }}
            maxW="100%"
          />
          <Box>
            <Text
              fontSize={{ base: "36px", md: "48px" }}
              color="Grey"
            >
              Find your match
            </Text>
            <Text
              fontSize={{ base: "36px", md: "48px" }}
              color="Grey"
            >
              By Photo !
            </Text>
            <Text mt={4} color="LightGrey" fontSize={{ base: "md", md: "xl" }}>
              Share a photo of the pet you're looking for.
              <br />
              We'll find them for you!
            </Text>
            <Box mt={6}>
              <S2SButton
                text="Upload Photo"
                bgColor="Blue"
                icon={<FaCamera />}
                width="420px"
              />
            </Box>
          </Box>
        </Flex>
      </Box>
      <Box
        mt={{ base: 8, md: -10 }}
        bgGradient="YellowBlue"
        borderTopLeftRadius={{ base: "32px", md: "52px" }}
        borderTopRightRadius={{ base: "32px", md: "52px" }}
        borderBottomLeftRadius="0"
        borderBottomRightRadius="0"
        px={{ base: 4, md: "112px" }}
        py={{ base: 6, md: "56px" }}
      >
        <Text color="Grey" fontSize={{ base: "24px", md: "32px" }} fontWeight="600" pb={6}>
          Recommended
        </Text>
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={5}>
          {RECOMMENDED_PETS.map((pet) => (
            <S2SPetCard
              key={pet.id}
              width="100%"
              petName={pet.name}
              petImageURL={pet.image}
              petAge={pet.age}
              petBreed={pet.breed}
              petGender={pet.gender}
              petLocation={pet.location}
            />
          ))}
        </SimpleGrid>
      </Box>
      <Box bg="LightBlue" px={{ base: 5, md: "112px" }} py={{ base: 6, md: 8 }}>
          <Text color="Grey" fontSize={{ base: "36px", md: "36px" }} fontWeight="600">
            What We Do ?
          </Text>
          <Flex direction={{ base: "column", lg: "row" }} align="center" gap={{ base: 8, md: 12 }} mt={6}>
            <Box
              bg="rgba(135, 207, 240, 0.7)"
              borderRadius="50%"
              w={{ base: "280px", md: "430px" }}
              h={{ base: "230px", md: "320px" }}
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
            <Text color="LightGrey" fontSize={{ base: "md", md: "lg" }} whiteSpace="pre-line" lineHeight="1.35" fontWeight="500">
              {WHAT_WE_DO_TEXT}
            </Text>
          </Flex>

          <Text mt={{ base: 10, md: 12 }} color="Grey" fontSize={{ base: "36px", md: "36px" }} fontWeight="600">
            Our Goals
          </Text>
          <Text mt={5} color="LightGrey" fontSize={{ base: "md", md: "lg" }} whiteSpace="pre-line" lineHeight="1.35" fontWeight="500">
            {OUR_GOALS_TEXT}
          </Text>
        </Box>
    </Box>
  );
}