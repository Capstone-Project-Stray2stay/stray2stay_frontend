import { useEffect, useRef, useState } from "react";
import { Box, Dialog, Flex, Icon, IconButton, Image, Portal, Text, VStack } from "@chakra-ui/react";
import { IoCameraOutline, IoClose } from "react-icons/io5";

import { S2SButton } from "../../components/S2S.components";

/** Filenames the backend and the classifier see, so they need to stay unique. */
const shotName = () => `camera-${Date.now()}.jpg`;

/**
 * Turn whatever getUserMedia threw into something a user can act on. The
 * DOMException names are the documented ones; anything else falls through to a
 * generic message rather than leaking a raw exception string into the UI.
 */
function cameraErrorMessage(error: unknown): string {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
        // getUserMedia is gated behind a secure context, so plain http on a LAN
        // IP (the usual way a phone reaches the dev server) has no camera at all.
        return "This browser can't open the camera here. Camera access needs https or localhost.";
    }
    if (error instanceof DOMException) {
        if (error.name === "NotAllowedError" || error.name === "SecurityError") {
            return "Camera permission was blocked. Allow camera access for this site, then try again.";
        }
        if (error.name === "NotFoundError" || error.name === "OverconstrainedError") {
            return "No camera was found on this device.";
        }
        if (error.name === "NotReadableError") {
            return "The camera is already in use by another app.";
        }
    }
    return "Couldn't start the camera.";
}

/**
 * Live camera capture for the photo picker.
 *
 * The stream is opened when the dialog opens and every track is stopped again
 * on close — leaving one running keeps the camera indicator lit and locks the
 * device against other tabs. When getUserMedia isn't available (insecure
 * origin, denied permission, no camera) this falls back to the OS camera app
 * through a `capture` file input, which is all a phone browser needs.
 */
export default function CameraCaptureModal({
    isOpen,
    onClose,
    onCapture,
}: {
    isOpen: boolean;
    onClose: () => void;
    onCapture: (photo: File) => void;
}) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const fallbackInputRef = useRef<HTMLInputElement>(null);

    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState("");
    // Set once a frame is grabbed: the still is reviewed before it is kept, so
    // a blurred shot can be retaken without leaving the dialog.
    const [shot, setShot] = useState<{ file: File; previewURL: string } | null>(null);

    // Ask for the back camera — on a phone that's the one pointed at the pet.
    // `facingMode` is a hint, not a constraint, so a laptop with only a front
    // camera still gets a stream instead of an OverconstrainedError.
    useEffect(() => {
        if (!isOpen) return;

        let cancelled = false;
        let opened: MediaStream | null = null;

        setError("");
        setShot(null);

        (async () => {
            try {
                if (!navigator.mediaDevices?.getUserMedia) throw new Error("unsupported");
                opened = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "environment" },
                    audio: false,
                });
                // The dialog can close while the permission prompt is still up;
                // the stream that arrives afterwards has to be released here,
                // because the cleanup below has already run.
                if (cancelled) {
                    opened.getTracks().forEach((track) => track.stop());
                    return;
                }
                setStream(opened);
            } catch (err) {
                if (!cancelled) setError(cameraErrorMessage(err));
            }
        })();

        return () => {
            cancelled = true;
            opened?.getTracks().forEach((track) => track.stop());
            setStream(null);
        };
    }, [isOpen]);

    // Attaching in a separate effect rather than inside the async block above:
    // the <video> only exists once the open dialog has rendered, which is after
    // the stream resolves.
    useEffect(() => {
        const video = videoRef.current;
        if (!video || !stream) return;
        video.srcObject = stream;
        // Autoplay can still be refused; the poster-less black box plus the
        // disabled Capture button is a reasonable end state, so ignore it.
        video.play().catch(() => {});
    }, [stream]);

    // The still's object URL outlives the frame it was made from, so it is
    // revoked whenever the shot is replaced or the dialog goes away.
    useEffect(() => {
        if (!shot) return;
        return () => URL.revokeObjectURL(shot.previewURL);
    }, [shot]);

    const capture = () => {
        const video = videoRef.current;
        if (!video || !video.videoWidth) return;

        // Capture at the sensor's own resolution rather than the CSS size, so
        // the classifier gets the full detail the camera gave us.
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    setError("Couldn't save the photo. Try again.");
                    return;
                }
                const file = new File([blob], shotName(), { type: "image/jpeg" });
                setShot({ file, previewURL: URL.createObjectURL(file) });
            },
            "image/jpeg",
            0.92,
        );
    };

    const keepShot = () => {
        if (!shot) return;
        onCapture(shot.file);
        onClose();
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()} placement="center">
            <Portal>
                <Dialog.Backdrop bg="blackAlpha.400" />
                <Dialog.Positioner>
                    <Dialog.Content
                        maxW={{ base: "335px", md: "560px" }}
                        borderRadius={{ base: "25.34px", md: "40px" }}
                        p="0"
                        position="relative"
                        boxShadow="0px 3.37px 16.84px rgba(201,220,225,0.20)"
                    >
                        <IconButton
                            aria-label="Close"
                            onClick={onClose}
                            position="absolute"
                            top={{ base: "20px", md: "24px" }}
                            right={{ base: "20px", md: "24px" }}
                            boxSize="23.58px"
                            minW="unset"
                            p="0"
                            rounded="full"
                            bg="#EDEDED"
                            _hover={{ bg: "#e0e0e0" }}
                            zIndex={1}
                        >
                            <Icon as={IoClose} boxSize="12px" color="GreyText" />
                        </IconButton>

                        <VStack
                            pt={{ base: "48px", md: "56px" }}
                            pb={{ base: "28px", md: "36px" }}
                            px={{ base: "24px", md: "40px" }}
                            gap={{ base: "18px", md: "24px" }}
                            align="stretch"
                        >
                            <Text
                                fontSize={{ base: "18px", md: "22px" }}
                                fontWeight="600"
                                color="Grey"
                                textAlign="center"
                            >
                                {shot ? "Use this photo?" : "Take a Photo"}
                            </Text>

                            <Box
                                w="100%"
                                aspectRatio={4 / 3}
                                bg="#1F1F1F"
                                borderRadius={{ base: "16px", md: "22px" }}
                                overflow="hidden"
                                position="relative"
                            >
                                {shot ? (
                                    <Image
                                        src={shot.previewURL}
                                        alt="Captured photo"
                                        w="100%"
                                        h="100%"
                                        objectFit="cover"
                                    />
                                ) : (
                                    <>
                                        {/* A plain <video>, not Box as="video":
                                            Chakra's polymorphic props don't carry
                                            the media attributes, and muted +
                                            playsInline are what let iOS Safari
                                            start the preview inline instead of
                                            taking over fullscreen. */}
                                        <video
                                            ref={videoRef}
                                            muted
                                            playsInline
                                            autoPlay
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                            }}
                                        />
                                        {!stream && !error && (
                                            <Flex
                                                position="absolute"
                                                inset="0"
                                                align="center"
                                                justify="center"
                                            >
                                                <Text fontSize="14px" color="White">
                                                    Starting the camera…
                                                </Text>
                                            </Flex>
                                        )}
                                        {error && (
                                            <Flex
                                                position="absolute"
                                                inset="0"
                                                align="center"
                                                justify="center"
                                                px="24px"
                                            >
                                                <Text
                                                    fontSize="14px"
                                                    color="White"
                                                    textAlign="center"
                                                >
                                                    {error}
                                                </Text>
                                            </Flex>
                                        )}
                                    </>
                                )}
                            </Box>

                            {/* Fallback path: hands the shot off to the OS camera
                                app, which needs no permission of our own. */}
                            <input
                                ref={fallbackInputRef}
                                type="file"
                                accept="image/*"
                                capture="environment"
                                hidden
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    e.target.value = "";
                                    if (!file) return;
                                    onCapture(file);
                                    onClose();
                                }}
                            />

                            {shot ? (
                                <Flex gap="12px" justify="center" wrap="wrap">
                                    <S2SButton
                                        text="Retake"
                                        variant="outline"
                                        width={{ base: "130px", md: "160px" }}
                                        height={{ base: "36px", md: "44px" }}
                                        fontSize={{ base: "14px", md: "18px" }}
                                        onClick={() => setShot(null)}
                                    />
                                    <S2SButton
                                        text="Use Photo"
                                        width={{ base: "130px", md: "160px" }}
                                        height={{ base: "36px", md: "44px" }}
                                        fontSize={{ base: "14px", md: "18px" }}
                                        onClick={keepShot}
                                    />
                                </Flex>
                            ) : (
                                <Flex gap="12px" justify="center" wrap="wrap">
                                    {error && (
                                        <S2SButton
                                            text="Use device camera"
                                            variant="outline"
                                            width={{ base: "180px", md: "200px" }}
                                            height={{ base: "36px", md: "44px" }}
                                            fontSize={{ base: "14px", md: "18px" }}
                                            onClick={() => fallbackInputRef.current?.click()}
                                        />
                                    )}
                                    <S2SButton
                                        icon={<Icon as={IoCameraOutline} boxSize="20px" />}
                                        text="Capture"
                                        width={{ base: "160px", md: "190px" }}
                                        height={{ base: "36px", md: "44px" }}
                                        fontSize={{ base: "14px", md: "18px" }}
                                        disabled={!stream}
                                        onClick={capture}
                                    />
                                </Flex>
                            )}
                        </VStack>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}
