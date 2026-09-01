import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Flex, Icon, IconButton, Image, Input, Text, VStack } from "@chakra-ui/react";
import { LuImage, LuPencil } from "react-icons/lu";

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
    fontSize: { base: "14px", md: "16px" },
    fontWeight: "500",
    color: "Grey",
    _placeholder: { color: "GreyMuted" },
} as const;

const PHOTO_PROPS = {
    w: "100%",
    maxW: { base: "100%", md: "425.72px" },
    h: { base: "183.25px", md: "252.80px" },
    bg: "rgba(255,255,255,0.60)",
    borderRadius: { base: "11.62px", md: "21.42px" },
    alignSelf: { base: "stretch", md: "flex-end" },
} as const;

function EntryView({ entry }: { entry: DiaryEntry }) {
    return (
        <VStack align="stretch" gap={{ base: "18.60px", md: "24px" }} w="100%">
            <Image {...PHOTO_PROPS} src={entry.imageURL} alt={entry.caption || "Diary photo"} objectFit="cover" />

            <Box
                bg="white"
                borderRadius={{ base: "28px", md: "21.42px" }}
                borderWidth="0.86px"
                borderColor="BlueText"
                px={{ base: "16px", md: "24px" }}
                py="8px"
            >
                <Text fontSize={{ base: "14px", md: "16px" }} fontWeight="500" color="GreyMuted">
                    {entry.caption}
                </Text>
            </Box>
        </VStack>
    );
}

function EntryEditor({
    entry,
    onSave,
    onCancel,
}: {
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

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

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

    const canSave = photo !== null || Boolean(entry?.imageURL);

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
                <Box
                    {...PHOTO_PROPS}
                    borderRadius={{ base: "11.62px", md: "16px" }}
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
                    <VStack justify="center" h="100%" gap={{ base: "9.14px", md: "16.85px" }} px="16px">
                        <Icon
                            as={LuImage}
                            w={{ base: "50px", md: "62.56px" }}
                            h={{ base: "46px", md: "57.42px" }}
                            color="SkyBlue"
                        />
                        <VStack gap="12px">
                            <Text
                                fontSize={{ base: "14px", md: "18px" }}
                                fontWeight="600"
                                color="Blue"
                                textAlign="center"
                            >
                                Drag and Drop Photos here
                            </Text>
                            <Box onClick={(e) => e.stopPropagation()}>
                                <S2SButton
                                    text="Upload Photo"
                                    variant="outline"
                                    width={{ base: "160px", md: "154.11px" }}
                                    height={{ base: "28px", md: "26.83px" }}
                                    fontSize={{ base: "12px", md: "14px" }}
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
    entry?: DiaryEntry;
    onSaveEntry: (photo: File | null, caption: string) => void;
}) {
    const [isEditing, setIsEditing] = useState(false);

    const handleSave = (photo: File | null, caption: string) => {
        onSaveEntry(photo, caption);
        setIsEditing(false);
    };

    const isComplete = Boolean(entry?.imageURL);

    const editPencil = isComplete && !isEditing && (
        <IconButton
            aria-label="Edit entry"
            variant="plain"
            minW="unset"
            boxSize={{ base: "14.36px", md: "15.43px" }}
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
                    <Text fontSize={{ base: "20px", md: "32px" }} fontWeight="600" color="Grey">
                        {date.getDate()}
                    </Text>
                    <Text fontSize={{ base: "14px", md: "18px" }} fontWeight="600" color="Grey">
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
