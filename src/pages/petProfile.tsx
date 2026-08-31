import {
  Badge,
  Box,
  Button,
  Dialog,
  Flex,
  Icon,
  Image,
  Portal,
  Text,
  VStack,
  IconButton
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { isAxiosError } from "axios";
import {
  LuCheck,
  LuChevronLeft,
  LuChevronRight,
  LuHeart,
  LuPawPrint,
  LuStethoscope,
  LuSyringe,
  LuTrash2,
  LuX,
} from "react-icons/lu";
import { IoMaleOutline, IoFemaleOutline } from "react-icons/io5";

import { S2SPageTitle, S2SAccordion, S2SButton } from "../components/S2S.components";
import { useAdoptPet, useDeletePet, usePetInfo } from "../hooks/query/pet.query";
import AdoptionFormModal from "./profile/adoptionFormModal.component";
import { formatGender, ageGroupOptions } from "../utils/petOptions.util";
import { VACCINE_OPTIONS } from "./rehome/rehome.type";

const FALLBACK_IMAGE = "/assets/images/house.png";

function formatAgeGroup(ageGroup: string): string {
  const match = ageGroupOptions.find((o) => o.value === ageGroup);
  return match?.label ?? ageGroup;
}

/**
 * The server's own reason for a rejected request — "pet not available for
 * adoption" is one the user can act on, and a generic message would hide it.
 */
function serverMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const data = error.response?.data as { error?: string; message?: string } | undefined;
    return data?.error ?? data?.message ?? error.message;
  }
  return error instanceof Error ? error.message : "Unknown error";
}

export default function PetProfile() {
  const { pid } = useParams();
  const navigate = useNavigate();
  const { pet, isOwner, isLoading, isError } = usePetInfo(pid);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const deletePetMutation = useDeletePet();

  const handleDelete = () => {
    if (!pid) return;
    deletePetMutation.mutate(pid, {
      onSuccess: () => navigate("/adopt"),
    });
  };

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [adoptError, setAdoptError] = useState("");
  /**
   * Flipped once this visit's request goes through, which is as far as the
   * button can currently tell. There is no endpoint for "does the signed-in
   * user already have a request on this pet", so a reload drops back to
   * "Adopt the pet" — a second submit is then rejected by PostPetAdopt only
   * after the pet is taken.
   * TODO: read the real state once the backend exposes the user's own requests.
   */
  const [requestSent, setRequestSent] = useState(false);
  const adopt = useAdoptPet(pid);

  if (isLoading) {
    return (
      <Box width={{ base: "100%", md: "80vw" }}>
        <S2SPageTitle title="Pet Profile" />
        <Text mt="48px" color="Grey" textAlign="center">Loading...</Text>
      </Box>
    );
  }

  if (isError || !pet) {
    return (
      <Box width={{ base: "100%", md: "80vw" }}>
        <S2SPageTitle title="Pet Profile" />
        <Text mt="48px" color="Grey" textAlign="center">Pet not found.</Text>
      </Box>
    );
  }

  const images = pet.petImageAddress.length > 0 ? pet.petImageAddress : [FALLBACK_IMAGE];
  const knownVaccines = VACCINE_OPTIONS[pet.petType?.toLowerCase() as "dog" | "cat"] ?? ["Rabies"];
  // Stored as a single comma-joined string (see registerPetAPI), so split it back apart for display.
  const specialCareItems = (pet.petSpecialCare ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const activeImage = images[Math.min(activeImageIndex, images.length - 1)];

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Anything other than an outright ADOPTED is treated as open, so an
  // unexpected status value leaves the request path available rather than
  // silently removing the only action on the page.
  const isAdopted = pet.status?.toUpperCase() === "ADOPTED";

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
                <Image src={activeImage} alt={pet.petName || pet.petBreed} w="100%" h="300px" objectFit="contain" />

                {images.length > 1 && (
                  <>
                    <IconButton
                      onClick={prevImage}
                      position="absolute"
                      left={2}
                      top="50%"
                      transform="translateY(-50%)"
                      color="white"
                      bg="Grey"
                      opacity={0.75}
                      rounded="full"
                      _hover={{ opacity: 1 }}
                    >
                      <LuChevronLeft size={20} />
                    </IconButton>

                    <IconButton
                      onClick={nextImage}
                      position="absolute"
                      right={2}
                      top="50%"
                      transform="translateY(-50%)"
                      color="white"
                      bg="Grey"
                      opacity={0.75}
                      rounded="full"
                      _hover={{ opacity: 1 }}
                    >
                      <LuChevronRight size={20} />
                    </IconButton>

                    <Flex position="absolute" bottom={3} left="50%" transform="translateX(-50%)" gap={2}>
                      {images.map((_, index) => (
                        <Box key={index} w="6px" h="6px" borderRadius="full" bg={index === activeImageIndex ? "white" : "rgba(255,255,255,0.5)"} />
                      ))}
                    </Flex>
                  </>
                )}
              </Box>

              {images.length > 1 && (
                <Flex mt={4} gap={4}>
                  {images.map((src, index) => (
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
              )}
            </Box>

            <VStack flex="1 1 340px" align="flex-start" gap={6}>
              <Box>
                <Text color="BlueText" fontSize="16px" fontWeight="500" mb={1}>
                  Name
                </Text>
                <Badge bg="#FFEEC1" color="Grey" borderRadius="full" px={4} py={1.5} fontSize="18px" fontWeight="500">
                  {pet.petName || "Unnamed"}
                </Badge>
              </Box>

              <Flex w="100%" gap={12}>
                <Box>
                  <Text color="BlueText" fontSize="16px" fontWeight="500" mb={1}>
                    Breed
                  </Text>
                  <Text color="#7E7E7E" fontSize="18px" fontWeight="500">
                    {pet.petBreed || "Mixed breed"}
                  </Text>
                </Box>
                <Box>
                  <Text color="BlueText" fontSize="16px" fontWeight="500" mb={1}>
                    Color
                  </Text>
                  <Text color="#7E7E7E" fontSize="18px" fontWeight="500">
                    {pet.petColor || "Unknown"}
                  </Text>
                </Box>
              </Flex>

              <Flex w="100%" gap={12}>
                <Box>
                  <Text color="BlueText" fontSize="16px" fontWeight="500" mb={1}>
                    Age Group
                  </Text>
                  <Text color="#7E7E7E" fontSize="18px" fontWeight="500">
                    {formatAgeGroup(pet.petAgeGroup)}
                  </Text>
                </Box>
                <Box>
                  <Text color="BlueText" fontSize="16px" fontWeight="500" mb={1}>
                    Gender
                  </Text>
                  <Flex align="center" gap={1.5}>
                    {pet.petGender?.toUpperCase() === "MALE" ? (
                      <IoMaleOutline size={16} color="#87CFF0" />
                    ) : (
                      <IoFemaleOutline size={16} color="#FF69B4" />
                    )}
                    <Text color="#7E7E7E" fontSize="18px" fontWeight="500">
                      {formatGender(pet.petGender)}
                    </Text>
                  </Flex>
                </Box>
              </Flex>

              <Box>
                <Text color="BlueText" fontSize="16px" fontWeight="500" mb={1}>
                  Location
                </Text>
                <Text color="#7E7E7E" fontSize="18px" fontWeight="500">
                  {pet.petAddress || "Unknown"}
                </Text>
              </Box>

              <Box>
                <Text color="BlueText" fontSize="16px" fontWeight="500" mb={2}>
                  Personality
                </Text>
                <Flex gap={3} wrap="wrap">
                  {pet.petPersonality.length > 0 ? (
                    pet.petPersonality.map((tag) => (
                      <Badge key={tag} bg="#E3F4FF" color="#7E7E7E" borderRadius="full" px={4} py={2} fontSize="16px" fontWeight="500">
                        {tag}
                      </Badge>
                    ))
                  ) : (
                    <Text color="#7E7E7E" fontSize="16px">None</Text>
                  )}
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
                  {knownVaccines.map((vaccine) => {
                    const received = pet.petVaccination.includes(vaccine);
                    return (
                      <Flex key={vaccine} align="center" gap={1.5}>
                        <Icon as={received ? LuCheck : LuX} boxSize={5} strokeWidth={3} color={received ? "#76CAAC" : "#F57676"} />
                        <Text color="#969696" fontSize="18px" fontWeight="400">
                          {vaccine}
                        </Text>
                      </Flex>
                    );
                  })}
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
                  <Icon as={pet.petSterilized ? LuCheck : LuX} boxSize={5} strokeWidth={3} color={pet.petSterilized ? "#76CAAC" : "#F57676"} />
                  <Text color="#969696" fontSize="18px" fontWeight="400">
                    {pet.petSterilized ? "Yes" : "No"}
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
                {specialCareItems.length > 0 ? (
                  <VStack align="flex-start" gap={0.5}>
                    {specialCareItems.map((item, i) => (
                      <Text key={i} color="#969696" fontSize="18px" fontWeight="400">
                        • {item}
                      </Text>
                    ))}
                  </VStack>
                ) : (
                  <Text color="#969696" fontSize="18px" fontWeight="400">
                    None
                  </Text>
                )}
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
            {pet.note || "No additional notes."}
          </Text>
        </Box>

        <Box mt={8} boxShadow="0px 3.61px 18.06px rgba(201, 220, 225, 0.20)" borderRadius="25px">
          <S2SAccordion
            title="Pet's Nature Personality"
            content={pet.petDetail || "No description available."}
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

        {/* The two roles get different actions on the same page: the finder
            manages their own listing, everyone else can ask to adopt it. */}
        {isOwner ? (
          <Flex justify="center" mt="48px">
            <S2SButton
              text="Delete Pet"
              icon={<LuTrash2 size={18} />}
              bgColor="red.500"
              width="200px"
              height="48px"
              fontSize="18px"
              onClick={() => setShowDeleteConfirm(true)}
            />
          </Flex>
        ) : (
          <VStack mt="64px" gap="16px">
            {requestSent ? (
              // Not a disabled button: the design shows this filled in, as a
              // status the adopter reads rather than a control they can press.
              <Button
                bg="YellowBorder"
                color="White"
                borderRadius="full"
                px={10}
                py={6}
                fontSize="20px"
                fontWeight="600"
                cursor="default"
                _hover={{ bg: "YellowBorder" }}
              >
                Pending Approval
              </Button>
            ) : isAdopted ? (
              <Button
                bg="BabyGray"
                color="White"
                borderRadius="full"
                px={10}
                py={6}
                fontSize="20px"
                fontWeight="600"
                cursor="default"
                _hover={{ bg: "BabyGray" }}
              >
                Already Adopted
              </Button>
            ) : (
              <S2SButton
                text="Adopt the pet"
                width={{ base: "230px", md: "260px" }}
                height={{ base: "44px", md: "52px" }}
                fontSize="20px"
                onClick={() => {
                  setAdoptError("");
                  setIsFormOpen(true);
                }}
              />
            )}

            {adoptError && (
              <Text fontSize="14px" color="red.500" textAlign="center">
                {adoptError}
              </Text>
            )}
          </VStack>
        )}
      </Box>

      <Dialog.Root
        open={showDeleteConfirm}
        onOpenChange={(e) => setShowDeleteConfirm(e.open)}
        placement="center"
      >
        <Portal>
          <Dialog.Backdrop bg="blackAlpha.400" />
          <Dialog.Positioner>
            <Dialog.Content maxW="380px" borderRadius="30px" p="0">
              <VStack pt="40px" pb="32px" px="32px" gap="16px" align="center">
                <Text fontSize="20px" fontWeight="600" color="Grey" textAlign="center">
                  Delete this pet?
                </Text>
                <Text fontSize="14px" color="GreyText" textAlign="center">
                  This removes {pet.petName || "this pet"}'s listing and all of its photos permanently. This can't be undone.
                </Text>
                <Flex gap="12px" mt="8px">
                  <S2SButton
                    text="Cancel"
                    variant="outline"
                    width="120px"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={deletePetMutation.isPending}
                  />
                  <S2SButton
                    text="Delete"
                    bgColor="red.500"
                    width="120px"
                    loading={deletePetMutation.isPending}
                    onClick={handleDelete}
                  />
                </Flex>
              </VStack>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      <AdoptionFormModal
        isOpen={isFormOpen}
        petName={pet.petName || "this pet"}
        isSubmitting={adopt.isPending}
        submitError={adoptError}
        onClose={() => setIsFormOpen(false)}
        onSubmit={(payload) => {
          setAdoptError("");
          adopt.mutate(payload, {
            onSuccess: () => {
              setIsFormOpen(false);
              setRequestSent(true);
            },
            // Keep the form open on failure so the filled-in answers survive
            // and can be resubmitted.
            onError: (error) => {
              setAdoptError(`Couldn't send the request: ${serverMessage(error)}`);
            },
          });
        }}
      />
    </Box>
  );
}
