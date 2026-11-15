import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Flex, Icon, IconButton, Image, Input, Text, VStack } from "@chakra-ui/react";
import { IoImages } from "react-icons/io5";

import EditIcon from "../icons/editIcon.component";
import DiaryPhotosIcon from "../icons/diaryPhotosIcon.component";
import { S2SButton } from "../S2S.components";
import { S2SCardShell } from "../S2S.components";
import { WEEKDAYS } from "../../utils/dateUtils";
import type { DiaryEntry } from "../../types/diary.type";

const CAPTION_INPUT_PROPS = {
    bg: "white",
    // Figma mobile and desktop share the 38px, 21.42px-radius, 24px-padded field; colours stay the desktop ones
    borderRadius: "21.42px",
    borderWidth: "0.86px",
    borderColor: "BlueText",
    px: "24px",
    py: "8px",
    h: "38px",
    fontSize: "16",
    fontWeight: "400",
    color: "Grey",
    _placeholder: { color: "GreyText" },
} as const;

// Figma (filled entry): 426×260 photo above the caption; mobile full width × 181, 16px corners
const PHOTO_PROPS = {
    w: "100%",
    maxW: { base: "100%", md: "426px" },
    h: { base: "181px", md: "260px" },
    bg: "rgba(255,255,255,0.60)",
    borderRadius: { base: "16px", md: "21.42px" },
    alignSelf: { base: "stretch", md: "flex-end" },
} as const;

// Figma's drop zone dashes are 12px on / 8px off, which a CSS `dashed` border can't do.
// The rect's 3px stroke is centred on the edge, so 1.5px of it shows. `color` is URL-encoded.
const dashedBorder = (color: string, radius: number) =>
    `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3e%3crect width='100%25' height='100%25' fill='none' rx='${radius}' ry='${radius}' stroke='${color}' stroke-width='3' stroke-dasharray='12 8'/%3e%3c/svg%3e")`;

function EntryView({ entry }: { entry: DiaryEntry }) {
    return (
        <VStack align="stretch" gap="24px" w="100%">
            <Image {...PHOTO_PROPS} src={entry.imageAddress} alt={entry.caption || "Diary photo"} objectFit="cover" />

            <Box
                bg="white"
                borderRadius="21.42px"
                borderWidth="0.86px"
                borderColor="BlueText"
                px="24px"
                py="8px"
            >
                <Text fontSize="16" fontWeight="400" color="Grey">
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
        <VStack align="stretch" gap="24px" w="100%">
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
                    // Figma mobile: 40px top/bottom, 16px corners
                    py={{ base: "40px", md: "32px" }}
                    px="16px"
                    borderRadius={{ base: "16px", md: "24px" }}
                    // Blue / BlueText theme colours, inlined because the SVG can't read tokens
                    backgroundImage={{
                        base: dashedBorder(isDragging ? "%2385BFE2" : "%2387CFF0", 16),
                        md: dashedBorder(isDragging ? "%2385BFE2" : "%2387CFF0", 24),
                    }}
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
                    <VStack gap={{ base: "16.85px", md: "16px" }}>
                        {/* Mobile: the Figma photos icon at its 62.56 x 57.42 size; desktop unchanged */}
                        <Box display={{ base: "flex", md: "none" }} color="SkyBlue">
                            <DiaryPhotosIcon />
                        </Box>
                        <Icon
                            as={IoImages}
                            display={{ base: "none", md: "block" }}
                            w="68.33px"
                            h="64.92px"
                            color="SkyBlue"
                        />
                        <VStack gap={{ base: "12.48px", md: "12px" }}>
                            <Text
                                fontSize={{ base: "16", md: "20" }}
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
                                    width={{ base: "154px", md: "158px" }}
                                    height={{ base: "36px", md: "38px" }}
                                    fontSize={{ base: "14", md: "18" }}
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
    // Nothing recorded and nothing this user can do about it (read-only, or outside the writable window)
    const isEmptyState = !(entry && isComplete && !isEditing) && !canEdit;

    const editPencil = isComplete && canEdit && !isEditing && (
        <IconButton
            aria-label="Edit entry"
            variant="plain"
            minW="unset"
            // Figma pencil (Icon_edit): the art is 16 of the 24px frame. Mobile Figma draws 15.43px of art = a 23.14px frame
            boxSize={{ base: "23.14px", md: "26px" }}
            p="0"
            color="Blue"
            flexShrink={0}
            css={{ "& svg": { width: "100%", height: "100%" } }}
            onClick={() => setIsEditing(true)}
        >
            <EditIcon />
        </IconButton>
    );

    return (
        <S2SCardShell
            railColor="SkyBlue"
            railWidth="14px"
            w="100%"
            direction={{ base: "column", md: "row" }}
            // Figma mobile (1009:2470): 32px left / 24px right, 16px top/bottom, 24px under the date row
            px={{ base: "24px", md: "32px" }}
            pl={{ base: "32px", md: "46px" }}
            py={{ base: "16px", md: "24px" }}
            gap={{ base: "24px", md: "32px" }}
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
                    align="center"
                    gap={{ base: "8px", md: "0.86px" }}
                >
                    <Text fontSize={{ base: "20", md: "32" }} fontWeight="600" color="Grey">
                        {date.getDate()}
                    </Text>
                    <Text fontSize={{ base: "16", md: "18" }} fontWeight="600" color="Grey">
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

            <VStack flex="1" align="stretch" gap={{ base: "24px", md: "16px" }} minW="0">
                {/* Figma keeps this 24px pencil row even when the pencil is hidden. The empty state drops it
                    (and grows by the same 24 + 16px) so its message sits centred top-to-bottom in the card. */}
                {!isEmptyState && (
                    <Flex display={{ base: "none", md: "flex" }} justify="flex-end" align="center" minH="24px">
                        {editPencil}
                    </Flex>
                )}

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
                    // Centred in the whole entry column (not right-aligned like a photo), in --font like the
                    // Profile empty states; 16 size, regular weight. 300px = the 260px photo + the pencil row and gap
                    // it replaces, so the card keeps the same height as the other days.
                    <Flex
                        {...PHOTO_PROPS}
                        h={{ base: "181px", md: "300px" }}
                        maxW="100%"
                        alignSelf="stretch"
                        align="center"
                        justify="center"
                        px="24px"
                        borderRadius={{ base: "11.62px", md: "16px" }}
                    >
                        <Text fontSize={{ base: "14", md: "16" }} fontWeight="400" color="Grey" textAlign="center">
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
