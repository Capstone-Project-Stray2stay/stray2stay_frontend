import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
    Box,
    chakra,
    createListCollection,
    Flex,
    Icon,
    IconButton,
    Image,
    Input,
    Portal,
    Select,
    Switch,
    Text,
    Textarea,
    VStack,
} from "@chakra-ui/react";
import { LuChevronDown, LuChevronUp, LuGripVertical, LuPlus, LuTrash2, LuX } from "react-icons/lu";
import { MdImage } from "react-icons/md";
import { RiImageAiFill } from "react-icons/ri";
import { IoCameraOutline, IoClose } from "react-icons/io5";

import { S2SButton, S2SIconButton } from "../S2S.components";
import { OTHER_OPTION, type CustomQuestionType, type CustomScreeningQuestionDraft } from "../../types/profile.type";
import { MAX_PHOTOS } from "../../types/rehome.type";
import { discardScreeningImage, stageScreeningImage } from "../../utils/screeningImages.util";
import CameraCaptureModal from "../rehome/cameraCaptureModal.component";

const QUESTION_TYPES = createListCollection({
    items: [
        { value: "ESSAY", label: "Essay / Short Answer" },
        { value: "MULTIPLE_CHOICE", label: "Multiple Choice" },
        { value: "CHECKLIST", label: "Checklist" },
        { value: "IMAGE", label: "Image Upload" },
    ],
});

/**
 * Pick-only dropdown for the question type. Unlike S2SDropDown (a searchable combobox), there is
 * nothing to type here — four fixed choices, so a click opens the full list straight away.
 */
function QuestionTypeSelect({ value, onChange }: { value: CustomQuestionType; onChange: (type: CustomQuestionType) => void }) {
    return (
        <Select.Root
            collection={QUESTION_TYPES}
            value={[value]}
            onValueChange={(e) => e.value[0] && onChange(e.value[0] as CustomQuestionType)}
            positioning={{ gutter: 0, sameWidth: true }}
            width={{ base: "100%", md: "256px" }}
        >
            <Select.HiddenSelect />
            <Select.Control>
                <Select.Trigger
                    h="38px"
                    px="16px"
                    bg="rgba(198, 231, 247, 0.30)"
                    borderWidth="1px"
                    borderColor="BlueText"
                    borderRadius="24px"
                    cursor="pointer"
                    transition="border-radius 0.15s ease"
                    _open={{ bg: "white", borderBottomRadius: "0", borderTopRadius: "10px" }}
                >
                    <Select.ValueText fontSize="16" fontWeight="400" color="Grey" />
                </Select.Trigger>
                <Select.IndicatorGroup pe="12px">
                    <Select.Indicator color="GreyText" />
                </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
                <Select.Positioner>
                    <Select.Content
                        bg="white"
                        borderTopRadius="0"
                        borderBottomRadius="10px"
                        boxShadow="0px 4px 20px rgba(201, 220, 225, 0.20)"
                        py="8px"
                    >
                        {QUESTION_TYPES.items.map((item) => (
                            <Select.Item
                                key={item.value}
                                item={item}
                                px="20px"
                                py="8px"
                                rounded="0"
                                fontSize="16"
                                color="GreyText"
                                cursor="pointer"
                                _highlighted={{ bg: "White_hover" }}
                            >
                                {item.label}
                                <Select.ItemIndicator />
                            </Select.Item>
                        ))}
                    </Select.Content>
                </Select.Positioner>
            </Portal>
        </Select.Root>
    );
}

function emptyScreeningQuestion(order: number): CustomScreeningQuestionDraft {
    return {
        questionType: "ESSAY",
        questionText: "",
        questionOptions: [],
        questionRequired: true,
        questionOrder: order,
    };
}

/** Grows with its content so long questions wrap instead of scrolling (Figma "click2"). */
function AutoGrowTextarea({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
    const ref = useRef<HTMLTextAreaElement>(null);
    useLayoutEffect(() => {
        const el = ref.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
    }, [value]);

    return (
        <Textarea
            ref={ref}
            rows={1}
            resize="none"
            overflow="hidden"
            minH="38px"
            px="16px"
            py="8px"
            bg="rgba(255, 255, 255, 0.70)"
            borderRadius="24px"
            borderWidth="1px"
            borderColor="BlueText"
            fontSize="16"
            lineHeight="1.35"
            color="Grey"
            _placeholder={{ color: "GreyText" }}
            focusRingColor="BlueText"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    );
}

/** The "Answer" underline an Essay question shows in both states — adopters type on a line like this. */
function AnswerLine() {
    return (
        <Box w="100%" py="4px" px="8px" borderBottom="1px solid" borderColor="BlueText">
            <Text fontSize="16" fontWeight="400" color="Grey">
                Answer
            </Text>
        </Box>
    );
}

type OptionShape = "radio" | "checkbox";

/** The empty circle (Multiple Choice) or square (Checklist) in front of each option. */
function OptionMarker({ shape, faded }: { shape: OptionShape; faded?: boolean }) {
    return (
        <Box
            boxSize="20px"
            flexShrink={0}
            borderWidth="1px"
            borderColor="BlueText"
            borderRadius={shape === "checkbox" ? "4px" : "full"}
            opacity={faded ? 0.5 : 1}
        />
    );
}

function RemoveOptionButton({ label, onClick }: { label: string; onClick: () => void }) {
    return (
        <IconButton
            aria-label={label}
            variant="plain"
            minW="unset"
            boxSize="20px"
            flexShrink={0}
            color="GreyMuted"
            _hover={{ color: "GreyText" }}
            onClick={onClick}
        >
            <Icon as={LuX} boxSize="12px" />
        </IconButton>
    );
}

/**
 * Figma "Flow how to add option": one option to start, options edited in place, then
 * "Add another option" (adds and selects "Option N" so typing replaces it) or
 * Add "Other" (a free-text line the adopter fills in, kept last).
 */
function OptionsEditor({
    options,
    shape,
    onChange,
}: {
    options: string[];
    shape: OptionShape;
    onChange: (options: string[]) => void;
}) {
    const choices = options.filter((o) => o !== OTHER_OPTION);
    const hasOther = options.includes(OTHER_OPTION);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    // Index to focus and select after the next render (set when an option is added)
    const pendingFocus = useRef<number | null>(null);

    useLayoutEffect(() => {
        if (pendingFocus.current === null) return;
        const el = inputRefs.current[pendingFocus.current];
        pendingFocus.current = null;
        el?.focus();
        el?.select();
    });

    // "Other" always stays at the end of the stored list
    const commit = (nextChoices: string[], other = hasOther) =>
        onChange(other ? [...nextChoices, OTHER_OPTION] : nextChoices);

    const addOption = () => {
        pendingFocus.current = choices.length;
        commit([...choices, `Option ${choices.length + 1}`]);
    };

    return (
        <VStack align="stretch" gap="12px" w="100%">
            {choices.map((option, i) => (
                <Flex key={i} align="center" gap="8px">
                    <OptionMarker shape={shape} />
                    <Input
                        ref={(el) => {
                            inputRefs.current[i] = el;
                        }}
                        flex="1"
                        minW={0}
                        h="28px"
                        px="0"
                        border="none"
                        borderBottom="1px solid"
                        borderColor="transparent"
                        borderRadius="0"
                        bg="transparent"
                        fontSize="16"
                        fontWeight="400"
                        color="Grey"
                        _hover={{ borderColor: "BabyGray" }}
                        _focusVisible={{ outline: "none", borderColor: "BlueText" }}
                        // Figma: clicking an option selects its text so typing replaces it
                        onFocus={(e) => e.target.select()}
                        value={option}
                        onChange={(e) => commit(choices.map((c, ci) => (ci === i ? e.target.value : c)))}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                addOption();
                            }
                        }}
                    />
                    {/* The only option left can't be removed */}
                    {choices.length > 1 ? (
                        <RemoveOptionButton
                            label={`Remove ${option || "option"}`}
                            onClick={() => commit(choices.filter((_, ci) => ci !== i))}
                        />
                    ) : (
                        <Box boxSize="20px" flexShrink={0} />
                    )}
                </Flex>
            ))}

            {hasOther && (
                <Flex align="center" gap="8px">
                    <OptionMarker shape={shape} />
                    <Text fontSize="16" fontWeight="400" color="Grey" flexShrink={0}>
                        Other:
                    </Text>
                    <Box flex="1" h="20px" borderBottom="1px solid" borderColor="BlueText" />
                    <RemoveOptionButton label="Remove Other" onClick={() => commit(choices, false)} />
                </Flex>
            )}

            <Flex align="center" gap="8px">
                {/* The faded box adds an option too, same as the "Add another option" text */}
                <chakra.button type="button" aria-label="Add another option" cursor="pointer" display="flex" onClick={addOption}>
                    <OptionMarker shape={shape} faded />
                </chakra.button>
                <Text fontSize="16" fontWeight="500" py="4px">
                    <chakra.button type="button" color="GreyMuted" cursor="pointer" onClick={addOption}>
                        Add another option
                    </chakra.button>
                    {!hasOther && (
                        <>
                            <Text as="span" color="GreyText"> or </Text>
                            <chakra.button
                                type="button"
                                color="BlueText"
                                cursor="pointer"
                                _hover={{ textDecoration: "underline" }}
                                onClick={() => commit(choices, true)}
                            >
                                Add &quot;Other&quot;
                            </chakra.button>
                        </>
                    )}
                </Text>
            </Flex>
        </VStack>
    );
}

/** Figma "use grid layout": one photo fills the row, two split 1:2, more go three across. */
function ImageGrid({ urls, onRemove }: { urls: string[]; onRemove?: (url: string) => void }) {
    return (
        <Box
            display="grid"
            w="100%"
            gap="10px"
            gridTemplateColumns={{
                base: "1fr",
                md: urls.length === 1 ? "1fr" : urls.length === 2 ? "1fr 2fr" : "repeat(3, 1fr)",
            }}
        >
            {urls.map((url, i) => (
                <Box key={url} position="relative">
                    <Image
                        src={url}
                        alt={`Photo ${i + 1}`}
                        w="100%"
                        h={{ base: "220px", md: urls.length > 2 ? "220px" : "320px" }}
                        objectFit="cover"
                        bg="#E9E9E9"
                    />
                    {onRemove && (
                        <IconButton
                            aria-label={`Remove photo ${i + 1}`}
                            position="absolute"
                            top="8px"
                            right="8px"
                            boxSize="23.58px"
                            minW="unset"
                            rounded="full"
                            bg="#EDEDED"
                            _hover={{ bg: "#e0e0e0" }}
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemove(url);
                            }}
                        >
                            <Icon as={IoClose} boxSize="12px" color="GreyText" />
                        </IconButton>
                    )}
                </Box>
            ))}
        </Box>
    );
}

/** Empty IMAGE question: a drop zone for the owner's photos (Figma "No image"), plus the camera. */
function ImageDropZone({ onFiles }: { onFiles: (files: File[]) => void }) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isCameraOpen, setIsCameraOpen] = useState(false);

    return (
        <>
            <VStack
                w="100%"
                py="32px"
                px="16px"
                gap="24px"
                bg="rgba(255, 255, 255, 0.60)"
                borderRadius="24px"
                borderWidth="1.5px"
                borderStyle="dashed"
                borderColor={isDragging ? "Blue" : "SkyBlue"}
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
                    onFiles(Array.from(e.dataTransfer.files));
                }}
            >
                <PhotoInput inputRef={inputRef} onFiles={onFiles} />
                <Icon as={RiImageAiFill} w="65px" h="60px" color="SkyBlue" />
                <VStack gap="12px">
                    <Text fontSize="18" fontWeight="600" color="Blue" textAlign="center">
                        Drag and Drop Photos here
                    </Text>
                    {/* Stops the click reaching the zone's own handler, which would open the file dialog again */}
                    <Flex
                        direction={{ base: "column", md: "row" }}
                        align="center"
                        gap={{ base: "10px", md: "16px" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <S2SButton
                            text="Upload Photo"
                            variant="outline"
                            width="217px"
                            height="38px"
                            fontSize="16"
                            onClick={() => inputRef.current?.click()}
                        />
                        <S2SButton
                            text="Take Photo"
                            variant="outline"
                            icon={<Icon as={IoCameraOutline} boxSize="18px" />}
                            width="217px"
                            height="38px"
                            fontSize="16"
                            onClick={() => setIsCameraOpen(true)}
                        />
                    </Flex>
                </VStack>
            </VStack>

            {/* Kept outside the zone: React events bubble out of portals, so clicks inside the
                camera window would otherwise reach the zone's click-to-upload handler */}
            <CameraCaptureModal
                isOpen={isCameraOpen}
                onClose={() => setIsCameraOpen(false)}
                onCapture={(photo) => onFiles([photo])}
            />
        </>
    );
}

function PhotoInput({ inputRef, onFiles }: { inputRef: React.RefObject<HTMLInputElement | null>; onFiles: (files: File[]) => void }) {
    return (
        <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
                if (e.target.files) onFiles(Array.from(e.target.files));
                // Reset so picking the same file again still fires onChange
                e.target.value = "";
            }}
        />
    );
}

/**
 * The small image icon beside the question field: switches another type to Image, and on an
 * Image question that already has photos, adds more (the drop zone is gone by then).
 */
function ImageShortcut({ question, onSwitch, onFiles }: { question: CustomScreeningQuestionDraft; onSwitch: () => void; onFiles: (files: File[]) => void }) {
    const inputRef = useRef<HTMLInputElement>(null);
    const isImage = question.questionType === "IMAGE";
    // Figma "No image": an empty Image question has no shortcut — the drop zone does the job
    if (isImage && question.questionOptions.length === 0) return null;
    const isFull = isImage && question.questionOptions.length >= MAX_PHOTOS;

    return (
        <>
            {isImage && <PhotoInput inputRef={inputRef} onFiles={onFiles} />}
            <IconButton
                aria-label={isImage ? "Add photos" : "Make this an image question"}
                variant="plain"
                minW="unset"
                boxSize="28px"
                color="Blue"
                disabled={isFull}
                onClick={() => (isImage ? inputRef.current?.click() : onSwitch())}
            >
                <Icon as={MdImage} boxSize="28px" />
            </IconButton>
        </>
    );
}

/** How the question reads to an adopter — the card's "Unclick" state. */
function QuestionPreview({ question }: { question: CustomScreeningQuestionDraft }) {
    const choices = question.questionOptions.filter((o) => o !== OTHER_OPTION);

    return (
        <VStack align="stretch" gap="16px">
            <Text fontSize="18" fontWeight="500" color="Grey">
                {question.questionText ||
                    (question.questionType !== "IMAGE" && <Text as="span" color="GreyMuted">Untitled question</Text>)}
                {question.questionRequired && question.questionType !== "IMAGE" && (
                    <>{" "}<Text as="span" color="#FF5151">*</Text></>
                )}
            </Text>

            {question.questionType === "ESSAY" && <AnswerLine />}

            {(question.questionType === "MULTIPLE_CHOICE" || question.questionType === "CHECKLIST") && (
                <VStack align="stretch" gap="12px">
                    {choices.map((option, i) => (
                        <Flex key={i} align="center" gap="8px">
                            <OptionMarker shape={question.questionType === "CHECKLIST" ? "checkbox" : "radio"} />
                            <Text fontSize="16" fontWeight="400" color="Grey" py="4px">{option}</Text>
                        </Flex>
                    ))}
                    {question.questionOptions.includes(OTHER_OPTION) && (
                        <Flex align="center" gap="8px">
                            <OptionMarker shape={question.questionType === "CHECKLIST" ? "checkbox" : "radio"} />
                            <Text fontSize="16" fontWeight="400" color="Grey" flexShrink={0}>Other:</Text>
                            <Box flex="1" h="20px" borderBottom="1px solid" borderColor="BlueText" />
                        </Flex>
                    )}
                </VStack>
            )}

            {question.questionType === "IMAGE" &&
                (choices.length > 0 ? (
                    <ImageGrid urls={choices} />
                ) : (
                    // Without this an empty image question collapses into a blank card
                    !question.questionText && <Text fontSize="16" color="GreyMuted">Image question — no photos yet</Text>
                ))}
        </VStack>
    );
}

function RequireToggle({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
    return (
        <Switch.Root size="sm" checked={checked} onCheckedChange={(e) => onChange(e.checked)} gap="8px">
            <Switch.HiddenInput />
            <Switch.Label fontSize="16" fontWeight="400" color="Grey">
                Require
            </Switch.Label>
            <Switch.Control bg="BabyGray" _checked={{ bg: "Blue" }}>
                <Switch.Thumb />
            </Switch.Control>
        </Switch.Root>
    );
}

export default function ScreeningQuestionsBuilder({
    questions,
    onChange,
    disabled,
}: {
    questions: CustomScreeningQuestionDraft[];
    onChange: (questions: CustomScreeningQuestionDraft[]) => void;
    disabled?: boolean;
}) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [dragIndex, setDragIndex] = useState<number | null>(null);
    const [dropIndex, setDropIndex] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Clicking anywhere outside the builder drops every card back to its preview state
    useEffect(() => {
        const handlePointerDown = (e: PointerEvent) => {
            const target = e.target as Element;
            // The question-type list and the camera window render in portals at the end of <body>, so a
            // click inside them looks "outside" — closing the card there would drop the selection/photo
            if (target.closest?.('[data-scope="select"], [data-scope="dialog"]')) return;
            if (containerRef.current && !containerRef.current.contains(target)) {
                setActiveIndex(null);
            }
        };
        document.addEventListener("pointerdown", handlePointerDown);
        return () => document.removeEventListener("pointerdown", handlePointerDown);
    }, []);

    const renumber = (list: CustomScreeningQuestionDraft[]) => list.map((q, i) => ({ ...q, questionOrder: i }));

    const updateAt = (index: number, patch: Partial<CustomScreeningQuestionDraft>) => {
        if (disabled) return;
        onChange(questions.map((q, i) => (i === index ? { ...q, ...patch } : q)));
    };

    /** Releases any not-yet-uploaded photos a question is about to lose. */
    const dropImages = (question: CustomScreeningQuestionDraft) => {
        if (question.questionType === "IMAGE") question.questionOptions.forEach(discardScreeningImage);
    };

    const removeAt = (index: number) => {
        dropImages(questions[index]);
        onChange(renumber(questions.filter((_, i) => i !== index)));
        setActiveIndex(null);
    };

    const changeType = (index: number, questionType: CustomQuestionType) => {
        const question = questions[index];
        if (questionType === question.questionType) return;
        dropImages(question);
        updateAt(index, {
            questionType,
            // Figma: a choice question starts with a single "Option 1"
            questionOptions: questionType === "MULTIPLE_CHOICE" || questionType === "CHECKLIST" ? ["Option 1"] : [],
        });
    };

    const addPhotos = (index: number, files: File[]) => {
        const current = questions[index].questionOptions;
        const room = Math.max(MAX_PHOTOS - current.length, 0);
        const added = files
            .filter((file) => file.type.startsWith("image/"))
            .slice(0, room)
            .map(stageScreeningImage);
        if (added.length > 0) updateAt(index, { questionOptions: [...current, ...added] });
    };

    const removePhoto = (index: number, url: string) => {
        discardScreeningImage(url);
        updateAt(index, { questionOptions: questions[index].questionOptions.filter((u) => u !== url) });
    };

    const move = (from: number, to: number) => {
        if (to < 0 || to >= questions.length || from === to) return;
        const next = [...questions];
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        onChange(renumber(next));
        setActiveIndex(to);
    };

    /** Adds a blank question right after `index` (or at the end) and opens it for editing. */
    const addAfter = (index: number | null) => {
        const at = index === null ? questions.length : index + 1;
        const next = [...questions];
        next.splice(at, 0, emptyScreeningQuestion(at));
        onChange(renumber(next));
        setActiveIndex(at);
    };

    return (
        <VStack ref={containerRef} align="stretch" gap="24px" w="100%">
            {questions.length === 0 && (
                <Text fontSize="14" color="GreyText">
                    No additional questions yet.
                </Text>
            )}

            {questions.map((question, index) => {
                const isActive = !disabled && activeIndex === index;
                return (
                    <Box
                        key={index}
                        data-question-card
                        position="relative"
                        borderRadius="16px"
                        borderWidth="1px"
                        borderColor={dropIndex === index && dragIndex !== index ? "Blue" : "BlueText"}
                        cursor={isActive || disabled ? "default" : "pointer"}
                        opacity={dragIndex === index ? 0.5 : 1}
                        onClick={() => !disabled && setActiveIndex(index)}
                        onDragOver={(e) => {
                            if (dragIndex === null) return;
                            e.preventDefault();
                            setDropIndex(index);
                        }}
                        onDrop={(e) => {
                            e.preventDefault();
                            if (dragIndex !== null) move(dragIndex, index);
                            setDragIndex(null);
                            setDropIndex(null);
                        }}
                    >
                        {/* Figma padding — open: 24 right (+6px bar on the left), closed: 32 right */}
                        <Box
                            py="24px"
                            pr={isActive ? "24px" : "32px"}
                            pl={isActive ? "30px" : "32px"}
                            bg="rgba(255, 255, 255, 0.70)"
                            borderRadius="15px"
                            // Figma: the open card gets a 6px light-blue bar down its left edge
                            borderLeft={isActive ? "6px solid" : undefined}
                            borderLeftColor="SkyBlue"
                        >
                            {isActive && (
                                // Drag handle — desktop only; mobile reorders with the arrows below
                                <Flex
                                    draggable
                                    display={{ base: "none", md: "flex" }}
                                    position="absolute"
                                    left="6px"
                                    top="50%"
                                    transform="translateY(-50%)"
                                    color="GreyMuted"
                                    cursor="grab"
                                    aria-label="Drag to reorder"
                                    onDragStart={(e) => {
                                        const card = e.currentTarget.closest("[data-question-card]");
                                        if (card) e.dataTransfer.setDragImage(card, 24, 24);
                                        e.dataTransfer.effectAllowed = "move";
                                        setDragIndex(index);
                                    }}
                                    onDragEnd={() => {
                                        setDragIndex(null);
                                        setDropIndex(null);
                                    }}
                                >
                                    <Icon as={LuGripVertical} boxSize="20px" />
                                </Flex>
                            )}

                            {isActive ? (
                                <VStack align="stretch" gap="16px">
                                    <Flex direction={{ base: "column", md: "row" }} align={{ base: "stretch", md: "flex-start" }} gap="12px">
                                        <Box flex="1" minW={0}>
                                            <AutoGrowTextarea
                                                // An image question's text is a caption, not something to answer
                                                placeholder={question.questionType === "IMAGE" ? "Type something here" : "Type question here"}
                                                value={question.questionText}
                                                onChange={(questionText) => updateAt(index, { questionText })}
                                            />
                                        </Box>
                                        <Flex align="center" gap="12px" flexShrink={0}>
                                            <ImageShortcut
                                                question={question}
                                                onSwitch={() => changeType(index, "IMAGE")}
                                                onFiles={(files) => addPhotos(index, files)}
                                            />
                                            <QuestionTypeSelect
                                                value={question.questionType}
                                                onChange={(type) => changeType(index, type)}
                                            />
                                        </Flex>
                                    </Flex>

                                    {question.questionType === "ESSAY" && <AnswerLine />}

                                    {question.questionType === "IMAGE" &&
                                        (question.questionOptions.length === 0 ? (
                                            <ImageDropZone onFiles={(files) => addPhotos(index, files)} />
                                        ) : (
                                            <ImageGrid
                                                urls={question.questionOptions}
                                                onRemove={(url) => removePhoto(index, url)}
                                            />
                                        ))}

                                    {(question.questionType === "CHECKLIST" ||
                                        question.questionType === "MULTIPLE_CHOICE") && (
                                        <OptionsEditor
                                            options={question.questionOptions}
                                            shape={question.questionType === "CHECKLIST" ? "checkbox" : "radio"}
                                            onChange={(questionOptions) => updateAt(index, { questionOptions })}
                                        />
                                    )}

                                    <Flex justify="space-between" align="center">
                                        {/* Mobile has no drag, so it keeps the move arrows */}
                                        <Flex gap="6px" display={{ base: "flex", md: "none" }}>
                                            <S2SIconButton icon={<LuChevronUp />} ariaLabel="Move up" bgColor="White" iconColor="GreyText" onClick={() => move(index, index - 1)} />
                                            <S2SIconButton icon={<LuChevronDown />} ariaLabel="Move down" bgColor="White" iconColor="GreyText" onClick={() => move(index, index + 1)} />
                                        </Flex>
                                        <Flex flex="1" justify="flex-end" align="center" gap="8px">
                                            {/* Adopters don't answer an image question, so it has nothing to require */}
                                            {question.questionType !== "IMAGE" && (
                                                <>
                                                    <RequireToggle
                                                        checked={question.questionRequired}
                                                        onChange={(questionRequired) => updateAt(index, { questionRequired })}
                                                    />
                                                    <Box w="1px" h="22px" bg="BabyGray" />
                                                </>
                                            )}
                                            <IconButton
                                                aria-label="Remove question"
                                                variant="plain"
                                                minW="unset"
                                                boxSize="22px"
                                                color="GreyMuted"
                                                _hover={{ color: "GreyText" }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeAt(index);
                                                }}
                                            >
                                                <Icon as={LuTrash2} boxSize="20px" />
                                            </IconButton>
                                        </Flex>
                                    </Flex>
                                </VStack>
                            ) : (
                                <QuestionPreview question={question} />
                            )}
                        </Box>

                        {isActive && (
                            // Figma: round + floating just outside the open card's top-right corner
                            <IconButton
                                aria-label="Add question below"
                                position="absolute"
                                top={{ base: "-14px", md: "18px" }}
                                right={{ base: "-10px", md: "-42px" }}
                                boxSize="30px"
                                minW="unset"
                                rounded="full"
                                bg="Blue"
                                color="white"
                                _hover={{ bg: "Blue_hover" }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    addAfter(index);
                                }}
                            >
                                <Icon as={LuPlus} boxSize="16px" />
                            </IconButton>
                        )}
                    </Box>
                );
            })}

            {!disabled && activeIndex === null && (
                <S2SButton
                    text="Add Question"
                    variant="outline"
                    bgColor="BlueText"
                    size="sm"
                    icon={<LuPlus />}
                    onClick={() => addAfter(null)}
                />
            )}
        </VStack>
    );
}
