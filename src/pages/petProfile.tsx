import {
  Badge,
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  LuCheck,
  LuChevronLeft,
  LuChevronRight,
  LuHeart,
  LuPawPrint,
  LuStethoscope,
  LuSyringe,
  LuX,
} from "react-icons/lu";
import { IoFemaleOutline } from "react-icons/io5";

import { S2SPageTitle, S2SAccordion } from "../components/S2S.components";

const galleryImages = [
  "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1583511655826-407a4f1f6ef7?auto=format&fit=crop&w=1200&q=80",
];

const vaccinations = [
  { label: "DHPPI", received: true },
  { label: "Rabies", received: false },
];

const personalityTags = ["Friendly", "Sociable"];

export default function PetProfile() {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <Box width={{ base: "100%", md: "80vw" }}>
      <S2SPageTitle title="Pet Profile" />

      <Box maxW="900px" mx="auto" mt="48px">
        <Box borderRadius="24px" overflow="hidden" boxShadow="0px 4px 20px rgba(201, 220, 225, 0.20)">
          <Flex bg="rgba(135, 207, 240, 0.70)" align="center" justify="space-between" px={{ base: 5, md: 10 }} py={6}>
            <Text color="White" fontSize="24px" fontWeight="600">
              Pet ID Card
            </Text>
            <Flex bg="rgba(255,255,255,0.35)" p={2.5} borderRadius="full" color="White">
              <LuPawPrint size={20} />
            </Flex>
          </Flex>

          <Flex bg="White" p={{ base: 5, md: 10 }} gap={{ base: 6, md: 10 }} wrap="wrap">
            <Box flex="1 1 320px" maxW="320px">
              <Box position="relative" borderRadius="13px" overflow="hidden">
                <Image src={galleryImages[activeImageIndex]} alt="Happy the Golden Retriever" w="100%" h="300px" objectFit="cover" />

                <Button
                  onClick={prevImage}
                  variant="ghost"
                  position="absolute"
                  left={2}
                  top="50%"
                  transform="translateY(-50%)"
                  minW={0}
                  p={1}
                  h="auto"
                  color="white"
                  bg="transparent"
                  _hover={{ bg: "transparent", opacity: 0.75 }}
                  _active={{ bg: "transparent" }}
                >
                  <LuChevronLeft size={20} />
                </Button>

                <Button
                  onClick={nextImage}
                  variant="ghost"
                  position="absolute"
                  right={2}
                  top="50%"
                  transform="translateY(-50%)"
                  minW={0}
                  p={1}
                  h="auto"
                  color="white"
                  bg="transparent"
                  _hover={{ bg: "transparent", opacity: 0.75 }}
                  _active={{ bg: "transparent" }}
                >
                  <LuChevronRight size={20} />
                </Button>

                <Flex position="absolute" bottom={3} left="50%" transform="translateX(-50%)" gap={2}>
                  {galleryImages.map((_, index) => (
                    <Box key={index} w="6px" h="6px" borderRadius="full" bg={index === activeImageIndex ? "white" : "rgba(255,255,255,0.5)"} />
                  ))}
                </Flex>
              </Box>

              <Flex mt={4} gap={4}>
                {galleryImages.map((src, index) => (
                  <Box
                    key={src}
                    w="80px"
                    h="80px"
                    borderRadius="13px"
                    overflow="hidden"
                    border={index === activeImageIndex ? "2px solid #85BFE2" : "1px solid #E9E9E9"}
                    bg="#E9E9E9"
                    cursor="pointer"
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <Image src={src} alt={`Pet thumbnail ${index + 1}`} w="100%" h="100%" objectFit="cover" />
                  </Box>
                ))}
              </Flex>
            </Box>

            <VStack flex="1 1 340px" align="flex-start" gap={6}>
              <Box>
                <Text color="BlueText" fontSize="16px" fontWeight="500" mb={1}>
                  Name
                </Text>
                <Badge bg="#FFEEC1" color="Grey" borderRadius="full" px={4} py={1.5} fontSize="18px" fontWeight="500">
                  Happy
                </Badge>
              </Box>

              <Flex w="100%" gap={12}>
                <Box>
                  <Text color="BlueText" fontSize="16px" fontWeight="500" mb={1}>
                    Breed
                  </Text>
                  <Text color="#7E7E7E" fontSize="18px" fontWeight="500">
                    Golden Retriever
                  </Text>
                </Box>
                <Box>
                  <Text color="BlueText" fontSize="16px" fontWeight="500" mb={1}>
                    Color
                  </Text>
                  <Text color="#7E7E7E" fontSize="18px" fontWeight="500">
                    Light Golden
                  </Text>
                </Box>
              </Flex>

              <Flex w="100%" gap={12}>
                <Box>
                  <Text color="BlueText" fontSize="16px" fontWeight="500" mb={1}>
                    Age Group
                  </Text>
                  <Text color="#7E7E7E" fontSize="18px" fontWeight="500">
                    Baby
                  </Text>
                </Box>
                <Box>
                  <Text color="BlueText" fontSize="16px" fontWeight="500" mb={1}>
                    Gender
                  </Text>
                  <Flex align="center" gap={1.5}>
                    <IoFemaleOutline size={16} color="#FF69B4" />
                    <Text color="#7E7E7E" fontSize="18px" fontWeight="500">
                      Female
                    </Text>
                  </Flex>
                </Box>
              </Flex>

              <Box>
                <Text color="BlueText" fontSize="16px" fontWeight="500" mb={1}>
                  Location
                </Text>
                <Text color="#7E7E7E" fontSize="18px" fontWeight="500">
                  Lorem ipsum dolor sit amet consectetur. Amet aliquam non elementum
                </Text>
              </Box>

              <Box>
                <Text color="BlueText" fontSize="16px" fontWeight="500" mb={2}>
                  Personality
                </Text>
                <Flex gap={3} wrap="wrap">
                  {personalityTags.map((tag) => (
                    <Badge key={tag} bg="#E3F4FF" color="#7E7E7E" borderRadius="full" px={4} py={2} fontSize="16px" fontWeight="500">
                      {tag}
                    </Badge>
                  ))}
                </Flex>
              </Box>
            </VStack>
          </Flex>
        </Box>

        <Box mt={8} borderRadius="24px" bg="rgba(255, 255, 255, 0.70)" boxShadow="0px 3.61px 18.06px rgba(201, 220, 225, 0.20)" px={{ base: 5, md: 10 }} py={{ base: 5, md: 8 }}>
          <Text color="Grey" fontSize="20px" fontWeight="600" mb={2}>
            Health &amp; Conditions
          </Text>
          <Box height="1px" bg="#C6E7F7" mb={6} />

          <Flex gap="96px" wrap="wrap">
            <Flex align="flex-start" gap={3}>
              <Flex w="41px" h="41px" flexShrink={0} borderRadius="full" bg="white" boxShadow="0px 3.32px 16.59px rgba(201, 220, 225, 0.20)" border="1px solid #D5D5D5" align="center" justify="center">
                <Icon as={LuSyringe} boxSize={6} color="#6a8ea5" />
              </Flex>
              <Box>
                <Text color="Grey" fontSize="18px" fontWeight="600" mb={1}>
                  Vaccinations
                </Text>
                <VStack align="flex-start" gap={1}>
                  {vaccinations.map((vaccine) => (
                    <Flex key={vaccine.label} align="center" gap={1.5}>
                      <Icon as={vaccine.received ? LuCheck : LuX} boxSize={5} strokeWidth={3} color={vaccine.received ? "#76CAAC" : "#F57676"} />
                      <Text color="#969696" fontSize="18px" fontWeight="400">
                        {vaccine.label}
                      </Text>
                    </Flex>
                  ))}
                </VStack>
              </Box>
            </Flex>

            <Flex align="flex-start" gap={3}>
              <Flex w="41px" h="41px" flexShrink={0} borderRadius="full" bg="white" boxShadow="0px 3.32px 16.59px rgba(201, 220, 225, 0.20)" border="1px solid #D5D5D5" align="center" justify="center">
                <Icon as={LuStethoscope} boxSize={6} color="#6a8ea5" />
              </Flex>
              <Box>
                <Text color="Grey" fontSize="18px" fontWeight="600" mb={1}>
                  Sterilized
                </Text>
                <Flex align="center" gap={1.5}>
                  <Icon as={LuCheck} boxSize={5} strokeWidth={3} color="#76CAAC" />
                  <Text color="#969696" fontSize="18px" fontWeight="400">
                    Yes
                  </Text>
                </Flex>
              </Box>
            </Flex>

            <Flex align="flex-start" gap={3}>
              <Flex w="41px" h="41px" flexShrink={0} borderRadius="full" bg="white" boxShadow="0px 3.32px 16.59px rgba(201, 220, 225, 0.20)" border="1px solid #D5D5D5" align="center" justify="center">
                <Icon as={LuHeart} boxSize={6} color="#6a8ea5" />
              </Flex>
              <Box>
                <Text color="Grey" fontSize="18px" fontWeight="600" mb={1}>
                  Special Care
                </Text>
                <Text color="#969696" fontSize="18px" fontWeight="400">
                  None
                </Text>
              </Box>
            </Flex>
          </Flex>
        </Box>

        <Box mt={8} borderRadius="24px" bg="rgba(255, 255, 255, 0.70)" boxShadow="0px 3.61px 18.06px rgba(201, 220, 225, 0.20)" px={{ base: 5, md: 10 }} py={{ base: 5, md: 8 }}>
          <Text color="Grey" fontSize="20px" fontWeight="600" mb={2}>
            Note
          </Text>
          <Box height="1px" bg="#C6E7F7" mb={4} />
          <Text color="#969696" fontSize="18px" fontWeight="400" lineHeight="1.7">
            Lorem ipsum dolor sit amet consectetur. Consectetur sed velit tincidunt dolor. Vitae
            consectetur purus laoreet gravida. Tincidunt non et quis sem aliquet justo. Eget faucibus
            amet tortor congue lectus sed ullamcorper nisl.
          </Text>
        </Box>

        <Box mt={8} boxShadow="0px 3.61px 18.06px rgba(201, 220, 225, 0.20)" borderRadius="25px">
          <S2SAccordion
            title="Pet’s Nature Personality"
            content="Happy, calm, and gentle with people. Loves social interaction, playful activities, and kindness during daily care."
            width="100%"
            px={{ base: 5, md: 10 }}
            py={{ base: 5, md: 8 }}
            fontSize="20px"
            contentFontSize="18px"
            contentPt="0px"
            contentPb="32px"
            contentColor="#969696"
          />
        </Box>

        <Flex justify="center" mt="64px">
          <Button bg="#FFD387" color="White" borderRadius="full" px={10} py={6} fontSize="20px" fontWeight="600" _hover={{ bg: "#f5c76a" }} _active={{ bg: "#f0bd59" }}>
            Pending Approval
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}
