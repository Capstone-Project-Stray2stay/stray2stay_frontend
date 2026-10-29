import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Flex, Icon, IconButton, Image, Input, Text, VStack } from "@chakra-ui/react";
import { LuPencil } from "react-icons/lu";
import { IoImages } from "react-icons/io5";

import { S2SButton } from "../S2S.components";
import { S2SCardShell } from "../S2S.components";
import { WEEKDAYS } from "../../utils/dateUtils";
import type { DiaryEntry } from "../../types/diary.type";

const CAPTION_INPUT_PROPS = {
    bg: "white",
    borderRadius: { base: "28px", md: "21.42px" },
    borderWidth: "0.86px",
    borderColor: "BlueText",
    px: { base: "16px", md: "24px" },
    py: "8px",
    h: { base: "41px", md: "38px" },
    fontSize: { base: "14", md: "16" },
    fontWeight: "400",
    color: "Grey",
    _placeholder: { color: "GreyText" },
} as const;

// Figma (filled entry): 426×260 photo above the caption
const PHOTO_PROPS = {
    w: "100%",
    maxW: { base: "100%", md: "426px" },
    h: { base: "183.25px", md: "260px" },
    bg: "rgba(255,255,255,0.60)",
    borderRadius: { base: "11.62px", md: "21.42px" },
    alignSelf: { base: "stretch", md: "flex-end" },
} as const;

function EntryView({ entry }: { entry: DiaryEntry }) {
    return (
        <VStack align="stretch" gap={{ base: "18.60px", md: "24px" }} w="100%">
            <Image {...PHOTO_PROPS} src={entry.imageAddress} alt={entry.caption || "Diary photo"} objectFit="cover" />

            <Box
                bg="white"
                borderRadius={{ base: "28px", md: "21.42px" }}
                borderWidth="0.86px"
                borderColor="BlueText"
                px={{ base: "16px", md: "24px" }}
                py="8px"
            >
                <Text fontSize={{ base: "14", md: "16" }} fontWeight="400" color="Grey">
                    {entry.caption}
                </Text>
            </Box>
        </VStack>
    );
}

function EntryEditor({
    entry,
    isSaving,
    onSave,
    onCancel,
}: {
    entry?: DiaryEntry;
    isSaving: boolean;
    onSave: (photo: File | null, caption: string) => void;
    onCancel?: () => void;
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [photo, setPhoto] = useState<File | null>(null);
    const [caption, setCaption] = useState(entry?.caption ?? "");
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState("");

    const preview = useMemo(() => (photo ? URL.createObjectURL(photo) : ""), [photo]);

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    const shownImage = preview || entry?.imageAddress || "";

    const acceptFile = (incoming: FileList | File[]) => {
        const image = Array.from(incoming).find((file) => file.type.startsWith("image/"));
        if (!image) {
            setError("Only image files are supported.");
            return;
        }
        setError("");
        setPhoto(image);
    };

    const canSave = photo !== null || Boolean(entry?.imageAddress);

    return (
        <VStack align="stretch" gap={{ base: "18.60px", md: "24px" }} w="100%">
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                    if (e.target.files) acceptFile(e.target.files);
                    e.target.value = "";
                }}
            />

            {shownImage ? (
                <Image
                    {...PHOTO_PROPS}
                    src={shownImage}
                    alt={photo?.name ?? entry?.caption ?? "Diary photo"}
                    objectFit="cover"
                    cursor="pointer"
                    title="Click to choose a different photo"
                    onClick={() => inputRef.current?.click()}
                />
            ) : (
                // Figma: grows with its content (32px top/bottom) instead of a fixed photo-sized box
                <Box
                    w="100%"
                    py={{ base: "24px", md: "32px" }}
                    px="16px"
                    bg="rgba(255,255,255,0.60)"
                    borderRadius={{ base: "11.62px", md: "24px" }}
                    borderWidth="1.5px"
                    borderStyle="dashed"
                    borderColor={isDragging ? "BlueText" : "Blue"}
                    transition="border-color 0.15s ease"
                    cursor="pointer"
                    onClick={() => inputRef.current?.click()}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        acceptFile(e.dataTransfer.files);
                    }}
                >
                    <VStack gap={{ base: "9.14px", md: "16px" }}>
                        <Icon
                            as={IoImages}
                            w={{ base: "50px", md: "68.33px" }}
                            h={{ base: "46px", md: "64.92px" }}
                            color="SkyBlue"
                        />
                        <VStack gap="12px">
                            <Text
                                fontSize={{ base: "14", md: "20" }}
                                fontWeight="600"
                                color="Blue"
                                textAlign="center"
                            >
                                Drag and Drop Photos here
                            </Text>
                            <Box onClick={(e) => e.stopPropagation()}>
                                {/* Figma "Small" Line button */}
                                <S2SButton
                                    text="Upload Photo"
                                    variant="outline"
                                    width={{ base: "160px", md: "158px" }}
                                    height={{ base: "28px", md: "38px" }}
                                    fontSize={{ base: "12", md: "18" }}
                                    onClick={() => inputRef.current?.click()}
                                />
                            </Box>
                        </VStack>
                    </VStack>
                </Box>
            )}

            <Input
                {...CAPTION_INPUT_PROPS}
                placeholder="Type here.."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && canSave && onSave(photo, caption.trim())}
            />

            {canSave && (
                <Flex justify="flex-end" gap="12px">
                    {onCancel && (
                        <S2SButton
                            text="Cancel"
                            variant="outline"
                            width="115px"
                            height="38px"
                            fontSize="16"
                            disabled={isSaving}
                            onClick={onCancel}
                        />
                    )}
                    <S2SButton
                        text="Save"
                        width="115px"
                        height="38px"
                        fontSize="16"
                        loading={isSaving}
                        onClick={() => onSave(photo, caption.trim())}
                    />
                </Flex>
            )}

            {error && (
                <Text fontSize="14" color="red.500">
                    {error}
                </Text>
            )}
        </VStack>
    );
}

export default function DayEntries({
    date,
    entry,
    canWrite,
    isWritableDay,
    isSaving,
    saveError,
    onSaveEntry,
}: {
    date: Date;
    entry?: DiaryEntry;
    /** False for a finder, who may read the diary but not add to it. */
    canWrite: boolean;
    /** False outside [adoption date, today] — see the page's writableDay check. */
    isWritableDay: boolean;
    isSaving: boolean;
    saveError: string;
    /** Resolves false when the save failed, so the editor stays open with the draft. */
    onSaveEntry: (photo: File | null, caption: string) => Promise<boolean>;
}) {
    const [isEditing, setIsEditing] = useState(false);

    const handleSave = async (photo: File | null, caption: string) => {
        if (await onSaveEntry(photo, caption)) setIsEditing(false);
    };

    const isComplete = Boolean(entry?.imageAddress);
    const canEdit = canWrite && isWritableDay;

    const editPencil = isComplete && canEdit && !isEditing && (
        <IconButton
            aria-label="Edit entry"
            variant="plain"
            minW="unset"
            boxSize={{ base: "14.36px", md: "16px" }}
            p="0"
            color="Blue"
            flexShrink={0}
            onClick={() => setIsEditing(true)}
        >
            <Icon as={LuPencil} boxSize="100%" />
        </IconButton>
    );

    return (
        <S2SCardShell
            railColor="SkyBlue"
            w="100%"
            direction={{ base: "column", md: "row" }}
            px={{ base: "20px", md: "32px" }}
            pl={{ base: "26px", md: "46px" }}
            py={{ base: "20px", md: "24px" }}
            gap={{ base: "16px", md: "32px" }}
            align="stretch"
        >
            <Flex
                direction={{ base: "row", md: "column" }}
                align="center"
                justify={{ base: "space-between", md: "flex-start" }}
                gap={{ base: "12px", md: "0.86px" }}
                minW={{ md: "46.28px" }}
            >
                <Flex
                    direction={{ base: "row", md: "column" }}
                    align={{ base: "baseline", md: "center" }}
                    gap={{ base: "8px", md: "0.86px" }}
                >
                    <Text fontSize={{ base: "20", md: "32" }} fontWeight="600" color="Grey">
                        {date.getDate()}
                    </Text>
                    <Text fontSize={{ base: "14", md: "18" }} fontWeight="600" color="Grey">
                        {WEEKDAYS[date.getDay()]}
                    </Text>
                </Flex>

                <Box display={{ base: "block", md: "none" }}>{editPencil}</Box>
            </Flex>

            <Box
                display={{ base: "none", md: "block" }}
                w="1.71px"
                alignSelf="stretch"
                bg="SkyBlue"
                flexShrink={0}
            />

            <VStack flex="1" align="stretch" gap={{ base: "18.60px", md: "24px" }} minW="0">
                <Flex display={{ base: "none", md: "flex" }} justify="flex-end">
                    {editPencil}
                </Flex>

                {entry && isComplete && !isEditing ? (
                    <EntryView entry={entry} />
                ) : canEdit ? (
                    <EntryEditor
                        entry={entry}
                        isSaving={isSaving}
                        onSave={handleSave}
                        onCancel={isComplete ? () => setIsEditing(false) : undefined}
                    />
                ) : (
                    // Nothing recorded and nothing this user can do about it:
                    // either they only have read access, or the day is outside
                    // the window they may write to.
                    <Flex
                        {...PHOTO_PROPS}
                        align="center"
                        justify="center"
                        px="24px"
                        borderRadius={{ base: "11.62px", md: "16px" }}
                    >
                        <Text fontSize={{ base: "14", md: "16" }} fontWeight="500" color="GreyMuted" textAlign="center">
                            {!canWrite
                                ? "No entry for this day."
                                : "This day is outside the diary's range."}
                        </Text>
                    </Flex>
                )}

                {saveError && (
                    <Text fontSize="14" color="red.500">
                        {saveError}
                    </Text>
                )}
            </VStack>
        </S2SCardShell>
    );
}
