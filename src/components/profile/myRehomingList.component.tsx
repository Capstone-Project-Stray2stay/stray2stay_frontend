import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Dialog, Flex, Icon, IconButton, Portal, Text, VStack } from "@chakra-ui/react";
import {
    LuBookOpen,
    LuCheck,
    LuChevronDown,
    LuChevronUp,
    LuClipboardList,
    LuEye,
    LuPencil,
    LuPhone,
    LuTrash2,
} from "react-icons/lu";

import { S2SButton } from "../S2S.components";
import { useDeletePet, useMyPetAdoptors, useScreeningAnswer, useSelectAdopter } from "../../hooks/query/pet.query";
import RoundIconButton from "./roundIconButton.component";
import ScreeningAnswersModal from "./screeningAnswersModal.component";
import StatusBadge from "./statusBadge.component";
import type { RehomingInterest, RehomingPet } from "../../types/profile.type";

function InterestRow({ pid, interest }: { pid: string; interest: RehomingInterest }) {
    const [showAnswers, setShowAnswers] = useState(false);
    const [showAcceptConfirm, setShowAcceptConfirm] = useState(false);
    // Set the instant the user confirms, rather than waiting on the
    // adoptors refetch to reflect ACCEPT: without it, the trigger button
    // below stays clickable for the round-trip, so a second click (or the
    // same click landing again) reopens this same confirm dialog.
    const [justAccepted, setJustAccepted] = useState(false);
    const isAccepted = interest.status === "accepted" || justAccepted;
    const { answers } = useScreeningAnswer(pid, interest.rid, showAnswers);
    const selectAdopterMutation = useSelectAdopter();

    return (
        <Flex justify="space-between" align="center" gap="16px" w="100%">
            <Flex align="center" gap="16px" minW={0}>
                <Avatar.Root boxSize={{ base: "48px", md: "60px" }} flexShrink={0}>
                    <Avatar.Fallback name={interest.name} />
                    <Avatar.Image src={interest.imageURL} />
                </Avatar.Root>
                <VStack align="flex-start" gap="4px" minW={0}>
                    <Text fontSize={{ base: "16", md: "18" }} fontWeight="500" color="Grey" truncate maxW="100%">
                        {interest.name}
                    </Text>
                    <Flex align="center" gap="8px">
                        <Icon as={LuPhone} boxSize="14px" color="GreyText" />
                        <Text fontSize={{ base: "13", md: "15" }} fontWeight="500" color="GreyMuted" whiteSpace="nowrap">
                            {interest.phone}
                        </Text>
                    </Flex>
                </VStack>
            </Flex>

            {/* Figma: labelled Small "Line" buttons on desktop, icon-only circles on mobile */}
            <Flex align="center" gap="16px" flexShrink={0} hideBelow="md">
                <S2SButton
                    text="Screening Answers"
                    variant="outline"
                    bgColor="BlueText"
                    size="sm"
                    icon={<LuEye />}
                    onClick={() => setShowAnswers(true)}
                />
                {isAccepted ? (
                    <StatusBadge status="success" />
                ) : (
                    <S2SButton
                        text="Accept"
                        variant="outline"
                        bgColor="AcceptGreen"
                        size="sm"
                        onClick={() => setShowAcceptConfirm(true)}
                    />
                )}
            </Flex>
            <Flex align="center" gap="8px" flexShrink={0} hideFrom="md">
                <RoundIconButton
                    icon={LuClipboardList}
                    ariaLabel={`View ${interest.name}'s screening answers`}
                    color="BlueText"
                    onClick={() => setShowAnswers(true)}
                />
                {isAccepted ? (
                    <StatusBadge status="success" />
                ) : (
                    <RoundIconButton
                        icon={LuCheck}
                        ariaLabel={`Accept ${interest.name}`}
                        color="AcceptGreen"
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

            {/* Only mounted while open, rather than always-mounted with `open`
                toggled: keeps no Ark UI transition state alive across
                open/close cycles for this row to get stuck in, since the
                whole subtree is freshly created every time it opens. */}
            {showAcceptConfirm && (
                <Dialog.Root
                    open
                    onOpenChange={(e) => setShowAcceptConfirm(e.open)}
                    placement="center"
                >
                    <Portal>
                        <Dialog.Backdrop bg="blackAlpha.400" />
                        <Dialog.Positioner>
                            <Dialog.Content maxW="380px" borderRadius="30px" p="0">
                                <VStack pt="40px" pb="32px" px="32px" gap="16px" align="center">
                                    <Text fontSize="20" fontWeight="600" color="Grey" textAlign="center">
                                        Accept {interest.name}?
                                    </Text>
                                    <Text fontSize="14" color="GreyText" textAlign="center">
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
                                            onClick={() => {
                                                setShowAcceptConfirm(false);
                                                setJustAccepted(true);
                                                selectAdopterMutation.mutate({ pid, rid: interest.rid });
                                            }}
                                        />
                                    </Flex>
                                </VStack>
                            </Dialog.Content>
                        </Dialog.Positioner>
                    </Portal>
                </Dialog.Root>
            )}
        </Flex>
    );
}

function RehomingRow({
    pet,
    interests,
    focusToken,
}: {
    pet: RehomingPet;
    interests: RehomingInterest[];
    /** Set when a notification linked to this pet; a new value opens the row again */
    focusToken: string | null;
}) {
    const navigate = useNavigate();
    const rowRef = useRef<HTMLDivElement>(null);
    const [expanded, setExpanded] = useState(focusToken !== null);
    const [seenFocusToken, setSeenFocusToken] = useState(focusToken);
    if (focusToken !== seenFocusToken) {
        setSeenFocusToken(focusToken);
        if (focusToken !== null) setExpanded(true);
    }
    useEffect(() => {
        if (focusToken !== null) rowRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, [focusToken]);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const deletePetMutation = useDeletePet();
    const pendingCount = interests.filter((interest) => interest.status === "pending").length;
    const isAdopted = interests.some((interest) => interest.status === "accepted");

    return (
        <VStack ref={rowRef} align="stretch" gap="16px" w="100%">
            <Flex justify="space-between" align="center" gap="16px" w="100%">
                <Flex align="center" gap={{ base: "16px", md: "24px" }} minW={0}>
                    <Avatar.Root boxSize={{ base: "60px", md: "85px" }} flexShrink={0}>
                        <Avatar.Fallback name={pet.name} />
                        <Avatar.Image src={pet.imageURL} />
                    </Avatar.Root>
                    <VStack align="flex-start" gap="8px" minW={0}>
                        <Text fontSize={{ base: "16", md: "18" }} fontWeight="500" color="Grey" truncate maxW="100%">
                            {pet.name}
                        </Text>
                        <Flex align="center" gap="8px">
                            <Flex
                                boxSize="8px"
                                borderRadius="full"
                                bg={isAdopted ? "Green" : "Orange"}
                                flexShrink={0}
                            />
                            <Text fontSize="15" fontWeight="500" color="GreyMuted">
                                {isAdopted ? "Adopted" : `${pendingCount} Interested`}
                            </Text>
                        </Flex>
                    </VStack>
                </Flex>

                <Flex align="center" gap={{ base: "12px", md: "24px" }} flexShrink={0}>
                    <Flex align="center" gap={{ base: "8px", md: "12px" }}>
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
                    </Flex>
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
                <VStack align="stretch" gap="24px" pl={{ base: "16px", md: "96px" }} w="100%">
                    {interests.map((interest) => (
                        <InterestRow key={interest.id} pid={pet.id} interest={interest} />
                    ))}
                </VStack>
            )}

            {showDeleteConfirm && (
                <Dialog.Root
                    open
                    onOpenChange={(e) => setShowDeleteConfirm(e.open)}
                    placement="center"
                >
                    <Portal>
                        <Dialog.Backdrop bg="blackAlpha.400" />
                        <Dialog.Positioner>
                            <Dialog.Content maxW="380px" borderRadius="30px" p="0">
                                <VStack pt="40px" pb="32px" px="32px" gap="16px" align="center">
                                    <Text fontSize="20" fontWeight="600" color="Grey" textAlign="center">
                                        Delete this pet?
                                    </Text>
                                    <Text fontSize="14" color="GreyText" textAlign="center">
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
                                            onClick={() => {
                                                setShowDeleteConfirm(false);
                                                deletePetMutation.mutate(pet.id);
                                            }}
                                        />
                                    </Flex>
                                </VStack>
                            </Dialog.Content>
                        </Dialog.Positioner>
                    </Portal>
                </Dialog.Root>
            )}
        </VStack>
    );
}

export default function MyRehomingList({
    pets,
    focusPet = null,
}: {
    pets: RehomingPet[];
    /** The pet a notification linked to, opened and scrolled to on arrival */
    focusPet?: { id: string; token: string } | null;
}) {
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
                <Text color="Grey" fontSize="16">You haven't listed any pets for rehoming yet.</Text>
            </Flex>
        );
    }

    return (
        <VStack align="stretch" gap={{ base: "24px", md: "40px" }} px={{ base: "0", md: "40px" }} w="100%">
            {sortedRows.map(({ pet, interests }) => (
                <RehomingRow
                    key={pet.id}
                    pet={pet}
                    interests={interests}
                    focusToken={focusPet?.id === pet.id ? focusPet.token : null}
                />
            ))}
        </VStack>
    );
}
