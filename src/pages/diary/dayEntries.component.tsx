import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Flex, Icon, Image, Input, Text, VStack } from "@chakra-ui/react";
import { LuImage, LuPencil } from "react-icons/lu";

import { S2SButton } from "../../components/S2S.components";
import { S2SCardShell } from "../../components/S2S.components";
import { WEEKDAYS } from "./dateUtils";
import type { DiaryEntry } from "./diary.type";

const CAPTION_INPUT_PROPS = {
    bg: "white",
    borderRadius: "21.42px",
    borderWidth: "0.86px",
    borderColor: "BlueText",
    px: "24px",
    py: "8px",
    h: "38px",
    fontSize: "16px",
    fontWeight: "500",
    color: "Grey",
    _placeholder: { color: "GreyMuted" },
} as const;

const PHOTO_PROPS = {
    w: "100%",
    maxW: "425.72px",
    h: "252.80px",
    bg: "rgba(255,255,255,0.60)",
    borderRadius: "21.42px",
    alignSelf: "flex-end",
} as const;

/** The day's saved entry, with a pencil that hands it back to the editor. */
function EntryView({ entry, onEdit }: { entry: DiaryEntry; onEdit: () => void }) {
    return (
        <VStack align="stretch" gap="24px" w="100%">
            <Flex justify="flex-end">
                <Icon
                    as={LuPencil}
                    aria-label="Edit entry"
                    boxSize="15.43px"
                    color="Blue"
                    cursor="pointer"
                    onClick={onEdit}
                />
            </Flex>

            <Image {...PHOTO_PROPS} src={entry.imageURL} alt={entry.caption || "Diary photo"} objectFit="cover" />

            <Box
                bg="white"
                borderRadius="21.42px"
                borderWidth="0.86px"
                borderColor="BlueText"
                px="24px"
                py="8px"
            >
                <Text fontSize="16px" fontWeight="500" color="GreyMuted">
                    {entry.caption}
                </Text>
            </Box>
        </VStack>
    );
}

/**
 * Dropzone + caption. With nothing filled in this is exactly the "empty day"
 * mockup; it doubles as the editor when the pencil reopens an existing entry.
 */
function EntryEditor({
    entry,
    onSave,
    onCancel,
}: {
    /** undefined when composing the day's first entry. */
    entry?: DiaryEntry;
    onSave: (photo: File | null, caption: string) => void;
    onCancel?: () => void;
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [photo, setPhoto] = useState<File | null>(null);
    const [caption, setCaption] = useState(entry?.caption ?? "");
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState("");

    const preview = useMemo(() => (photo ? URL.createObjectURL(photo) : ""), [photo]);

    // Object URLs have to be handed back explicitly, otherwise every re-pick
    // leaks a blob that lives as long as the document does.
    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    // A newly picked photo wins; otherwise fall back to the one already saved.
    const shownImage = preview || entry?.imageURL || "";

    const acceptFile = (incoming: FileList | File[]) => {
        const image = Array.from(incoming).find((file) => file.type.startsWith("image/"));
        if (!image) {
            setError("Only image files are supported.");
            return;
        }
        setError("");
        setPhoto(image);
    };

    // Nothing to save until the day has a photo, whether just picked or already
    // stored on the entry being edited.
    const canSave = photo !== null || Boolean(entry?.imageURL);

    return (
        <VStack align="stretch" gap="24px" w="100%">
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                    if (e.target.files) acceptFile(e.target.files);
                    // Reset so picking the same file twice still fires onChange.
                    e.target.value = "";
                }}
            />

            {shownImage ? (
                // Clicking the photo re-opens the picker, which is the only way
                // to swap it out once one is chosen.
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
                <Box
                    {...PHOTO_PROPS}
                    borderRadius="16px"
                    borderWidth="1.51px"
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
                    <VStack justify="center" h="100%" gap="16.85px">
                        <Icon as={LuImage} w="62.56px" h="57.42px" color="SkyBlue" />
                        <VStack gap="12.48px">
                            <Text fontSize="18px" fontWeight="600" color="Blue" textAlign="center">
                                Drag and Drop Photos here
                            </Text>
                            {/* Stops the click reaching the zone's own handler,
                                which would open the file dialog a second time. */}
                            <Box onClick={(e) => e.stopPropagation()}>
                                <S2SButton
                                    text="Upload Photo"
                                    variant="outline"
                                    width="154.11px"
                                    height="26.83px"
                                    fontSize="14px"
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

            {/* Absent until there is a photo, so the untouched empty day matches
                the mockup exactly. */}
            {canSave && (
                <Flex justify="flex-end" gap="12px">
                    {onCancel && (
                        <S2SButton
                            text="Cancel"
                            variant="outline"
                            width="115px"
                            height="38px"
                            fontSize="16px"
                            onClick={onCancel}
                        />
                    )}
                    <S2SButton
                        text="Save"
                        width="115px"
                        height="38px"
                        fontSize="16px"
                        onClick={() => onSave(photo, caption.trim())}
                    />
                </Flex>
            )}

            {error && (
                <Text fontSize="14px" color="red.500">
                    {error}
                </Text>
            )}
        </VStack>
    );
}

export default function DayEntries({
    date,
    entry,
    onSaveEntry,
}: {
    date: Date;
    /** A day holds at most one entry. */
    entry?: DiaryEntry;
    onSaveEntry: (photo: File | null, caption: string) => void;
}) {
    const [isEditing, setIsEditing] = useState(false);

    const handleSave = (photo: File | null, caption: string) => {
        onSaveEntry(photo, caption);
        setIsEditing(false);
    };

    // An entry without a photo isn't finished, so it opens straight into the
    // editor — otherwise the read-only view would show an empty frame with no
    // way to add the photo short of finding the pencil.
    const isComplete = Boolean(entry?.imageURL);

    return (
        <S2SCardShell railColor="SkyBlue" w="100%" px="32px" pl="46px" py="24px" gap="32px" align="stretch">
            <VStack gap="0.86px" minW="46.28px">
                <Text fontSize="32px" fontWeight="600" color="Grey">
                    {date.getDate()}
                </Text>
                <Text fontSize="18px" fontWeight="600" color="Grey">
                    {WEEKDAYS[date.getDay()]}
                </Text>
            </VStack>

            {/* A real flex child rather than the Figma export's rotated box,
                which would not stretch with the card. */}
            <Box w="1.71px" alignSelf="stretch" bg="SkyBlue" flexShrink={0} />

            <VStack flex="1" align="stretch" gap="24px" minW="0">
                {entry && isComplete && !isEditing ? (
                    <EntryView entry={entry} onEdit={() => setIsEditing(true)} />
                ) : (
                    <EntryEditor
                        entry={entry}
                        onSave={handleSave}
                        onCancel={isComplete ? () => setIsEditing(false) : undefined}
                    />
                )}
            </VStack>
        </S2SCardShell>
    );
}
