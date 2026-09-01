import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Button, Dialog, Flex, Icon, IconButton, Portal, Text, VStack } from "@chakra-ui/react";
import { LuBookOpen, LuChevronDown, LuChevronUp, LuPencil, LuPhone, LuTrash2 } from "react-icons/lu";

import { S2SButton } from "../S2S.components";
import { useDeletePet, useMyPetAdoptors, useScreeningAnswer, useSelectAdopter } from "../../hooks/query/pet.query";
import RoundIconButton from "./roundIconButton.component";
import ScreeningAnswersModal from "./screeningAnswersModal.component";
import StatusBadge from "./statusBadge.component";
import type { RehomingInterest, RehomingPet } from "../../types/profile.type";

function PillButton({
    label,
    borderColor,
    width,
    onClick,
}: {
    label: string;
    borderColor: string;
    width: string;
    onClick?: () => void;
}) {
    return (
        <Button
            variant="plain"
            h="38px"
            w={width}
            maxW="100%"
            px="12px"
            borderRadius="30.44px"
            borderWidth="1px"
            borderColor={borderColor}
            transition="background 0.15s ease"
            _hover={{ bg: "blackAlpha.50" }}
            onClick={onClick}
        >
            <Text fontSize="18px" fontWeight="500" color="GreyText" whiteSpace="nowrap">
                {label}
            </Text>
        </Button>
    );
}

function InterestRow({ pid, interest }: { pid: string; interest: RehomingInterest }) {
    const [showAnswers, setShowAnswers] = useState(false);
    const [showAcceptConfirm, setShowAcceptConfirm] = useState(false);
    const { answers } = useScreeningAnswer(pid, interest.rid, showAnswers);
    const selectAdopterMutation = useSelectAdopter();

    return (
        <Flex justify="space-between" align="center" gap="24px" wrap="wrap" w="100%">
            <Flex align="center" gap="32px">
                <Avatar.Root boxSize="85px">
                    <Avatar.Fallback name={interest.name} />
                    <Avatar.Image src={interest.imageURL} />
                </Avatar.Root>
                <VStack align="flex-start" gap="12px">
                    <Text fontSize="18px" fontWeight="500" color="Grey">
                        {interest.name}
                    </Text>
                    <Flex align="center" gap="8px">
                        <Icon as={LuPhone} boxSize="14px" color="GreyText" />
                        <Text fontSize="15px" fontWeight="500" color="GreyMuted">
                            {interest.phone}
                        </Text>
                    </Flex>
                </VStack>
            </Flex>

            <Flex align="center" gap="16px" wrap="wrap">
                <PillButton
                    label="View Screening Answers"
                    borderColor="Blue"
                    width="276px"
                    onClick={() => setShowAnswers(true)}
                />
                {interest.status === "accepted" ? (
                    <StatusBadge status="success" />
                ) : (
                    <PillButton
                        label="Accept"
                        borderColor="GreenBorder"
                        width="115px"
                        onClick={() => setShowAcceptConfirm(true)}
                    />
                )}
            </Flex>

            <ScreeningAnswersModal
                isOpen={showAnswers}
                adopterName={interest.name}
                answers={answers}
                onClose={() => setShowAnswers(false)}
            />

            <Dialog.Root
                open={showAcceptConfirm}
                onOpenChange={(e) => setShowAcceptConfirm(e.open)}
                placement="center"
            >
                <Portal>
                    <Dialog.Backdrop bg="blackAlpha.400" />
                    <Dialog.Positioner>
                        <Dialog.Content maxW="380px" borderRadius="30px" p="0">
                            <VStack pt="40px" pb="32px" px="32px" gap="16px" align="center">
                                <Text fontSize="20px" fontWeight="600" color="Grey" textAlign="center">
                                    Accept {interest.name}?
                                </Text>
                                <Text fontSize="14px" color="GreyText" textAlign="center">
                                    This marks the pet as adopted and denies every other pending request.
                                    This can't be undone.
                                </Text>
                                <Flex gap="12px" mt="8px">
                                    <S2SButton
                                        text="Cancel"
                                        variant="outline"
                                        width="120px"
                                        onClick={() => setShowAcceptConfirm(false)}
                                        disabled={selectAdopterMutation.isPending}
                                    />
                                    <S2SButton
                                        text="Accept"
                                        width="120px"
                                        loading={selectAdopterMutation.isPending}
                                        onClick={() =>
                                            selectAdopterMutation.mutate(
                                                { pid, rid: interest.rid },
                                                { onSuccess: () => setShowAcceptConfirm(false) },
                                            )
                                        }
                                    />
                                </Flex>
                            </VStack>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
        </Flex>
    );
}

function RehomingRow({ pet, interests }: { pet: RehomingPet; interests: RehomingInterest[] }) {
    const navigate = useNavigate();
    const [expanded, setExpanded] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const deletePetMutation = useDeletePet();
    const pendingCount = interests.filter((interest) => interest.status === "pending").length;
    const isAdopted = interests.some((interest) => interest.status === "accepted");

    return (
        <VStack align="stretch" gap="32px" w="100%">
            <Flex justify="space-between" align="center" gap="24px" wrap="wrap" w="100%">
                <Flex align="center" gap="32px">
                    <Avatar.Root boxSize="85px">
                        <Avatar.Fallback name={pet.name} />
                        <Avatar.Image src={pet.imageURL} />
                    </Avatar.Root>
                    <VStack align="flex-start" gap="12px">
                        <Text fontSize="18px" fontWeight="500" color="Grey">
                            {pet.name}
                        </Text>
                        <Flex align="center" gap="8px">
                            <Flex
                                boxSize="8px"
                                borderRadius="full"
                                bg={isAdopted ? "Green" : "YellowBorder"}
                                flexShrink={0}
                            />
                            <Text fontSize="15px" fontWeight="500" color="GreyMuted">
                                {isAdopted ? "Adopted" : `${pendingCount} Interested`}
                            </Text>
                        </Flex>
                    </VStack>
                </Flex>

                <Flex align="center" gap="16px">
                    {isAdopted ? (
                        <RoundIconButton
                            icon={LuBookOpen}
                            ariaLabel={`Open ${pet.name}'s diary`}
                            color="BlueText"
                            onClick={() => navigate("/diary")}
                        />
                    ) : (
                        <>
                            <RoundIconButton
                                icon={LuPencil}
                                ariaLabel={`Edit ${pet.name}`}
                                color="Blue"
                                onClick={() => navigate(`/rehome/${pet.id}/edit`)}
                            />
                            <RoundIconButton
                                icon={LuTrash2}
                                ariaLabel={`Delete ${pet.name}`}
                                color="GreyMuted"
                                onClick={() => setShowDeleteConfirm(true)}
                            />
                        </>
                    )}
                    <IconButton
                        aria-label={expanded ? "Collapse" : "Expand"}
                        variant="plain"
                        minW="unset"
                        p="0"
                        color="GreyText"
                        onClick={() => setExpanded((open) => !open)}
                    >
                        <Icon as={expanded ? LuChevronUp : LuChevronDown} boxSize="22px" />
                    </IconButton>
                </Flex>
            </Flex>

            {expanded && (
                <VStack align="stretch" gap="32px" pl={{ base: "24px", lg: "112px" }} w="100%">
                    {interests.map((interest) => (
                        <InterestRow key={interest.id} pid={pet.id} interest={interest} />
                    ))}
                </VStack>
            )}

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
                                    This removes {pet.name}'s listing and all of its photos permanently. This can't be undone.
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
                                        onClick={() =>
                                            deletePetMutation.mutate(pet.id, {
                                                onSuccess: () => setShowDeleteConfirm(false),
                                            })
                                        }
                                    />
                                </Flex>
                            </VStack>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
        </VStack>
    );
}

export default function MyRehomingList({ pets }: { pets: RehomingPet[] }) {
    // Fetched once for every pet at once (see useMyPetAdoptors), then each
    // row picks its own slice out of the result below.
    const { adoptorsByPet } = useMyPetAdoptors(pets.length > 0);

    // DENIED requests are dropped — once one applicant is accepted, the
    // backend denies every other request for that pet, and GetAllAdoptors
    // still returns them so history isn't lost, but they're not useful here.
    // PENDING and ACCEPT both stay: PENDING keeps its live Accept action,
    // ACCEPT is kept read-only so the owner can still see who they picked —
    // sorted after every PENDING row so the still-open decisions stay on top.
    const rows = pets.map((pet) => {
        const entry = adoptorsByPet.find((a) => String(a.petId) === pet.id);
        const interests: RehomingInterest[] = (entry?.adoptorsInfo ?? [])
            .filter((a) => a.rehomeStatus === "PENDING" || a.rehomeStatus === "ACCEPT")
            .map((a) => ({
                id: a.userId,
                rid: a.rehomeId,
                name: `${a.firstName} ${a.lastName}`.trim(),
                phone: a.phoneNumber,
                imageURL: a.imageAddress,
                status: a.rehomeStatus === "ACCEPT" ? ("accepted" as const) : ("pending" as const),
            }))
            .sort((a, b) => Number(a.status === "accepted") - Number(b.status === "accepted"));

        return { pet, interests, isAdopted: interests.some((i) => i.status === "accepted") };
    });

    // Pets that already found an adopter sink to the bottom of the list, so
    // the ones still open for interest stay front and center.
    const sortedRows = [...rows].sort((a, b) => Number(a.isAdopted) - Number(b.isAdopted));

    if (pets.length === 0) {
        return (
            <Flex minH="200px" align="center" justify="center">
                <Text color="Grey" fontSize="md">You haven't listed any pets for rehoming yet.</Text>
            </Flex>
        );
    }

    return (
        <VStack align="stretch" gap="32px" w="100%">
            {sortedRows.map(({ pet, interests }) => (
                <RehomingRow key={pet.id} pet={pet} interests={interests} />
            ))}
        </VStack>
    );
}
