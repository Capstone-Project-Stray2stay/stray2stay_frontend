import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Box, Flex, IconButton, Spinner, Text, VStack } from "@chakra-ui/react"
import { LuBell, LuCheckCheck } from "react-icons/lu"

import {
    useMarkAllNotificationsRead,
    useMarkNotificationRead,
    useNotifications,
} from "../hooks/query/pet.query"

function formatNotificationDate(value: string) {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return ""
    return date.toLocaleString([], { dateStyle: "medium", timeStyle: "short" })
}

export default function S2SNotificationCenter({ enabled }: { enabled: boolean }) {
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()
    const { notifications, unreadCount, isLoading } = useNotifications(enabled)
    const markReadMutation = useMarkNotificationRead()
    const markAllMutation = useMarkAllNotificationsRead()
    if (!enabled) return null

    return (
        <Box position="relative">
            <IconButton
                aria-label="Notifications"
                variant="ghost"
                color="Grey"
                rounded="full"
                onClick={() => setOpen((current) => !current)}
            >
                <LuBell />
            </IconButton>
            {unreadCount > 0 && (
                <Flex
                    position="absolute"
                    top="0"
                    right="0"
                    minW="18px"
                    h="18px"
                    px="1"
                    rounded="full"
                    bg="Red"
                    color="white"
                    align="center"
                    justify="center"
                    fontSize="10px"
                    fontWeight="bold"
                    pointerEvents="none"
                >
                    {unreadCount > 99 ? "99+" : unreadCount}
                </Flex>
            )}

            {open && (
                <Box
                    position="absolute"
                    top="calc(100% + 10px)"
                    right="0"
                    zIndex="popover"
                    w={{ base: "min( calc(100vw - 32px), 360px)", lg: "360px" }}
                    maxH="min(70vh, 520px)"
                    overflowY="auto"
                    bg="white"
                    rounded="xl"
                    shadow="lg"
                    borderWidth="1px"
                    borderColor="gray.100"
                >
                    <Flex px="4" py="3" justify="space-between" align="center" borderBottomWidth="1px">
                        <Text fontWeight="bold" color="Grey">Notifications</Text>
                        {unreadCount > 0 && (
                            <IconButton
                                aria-label="Mark all notifications as read"
                                title="Mark all as read"
                                size="sm"
                                variant="ghost"
                                color="BlueText"
                                onClick={() => markAllMutation.mutate()}
                                loading={markAllMutation.isPending}
                            >
                                <LuCheckCheck />
                            </IconButton>
                        )}
                    </Flex>

                    {isLoading ? (
                        <Flex justify="center" py="8"><Spinner color="Blue" /></Flex>
                    ) : notifications.length === 0 ? (
                        <Text px="4" py="8" textAlign="center" color="GreyMuted" fontSize="sm">
                            You have no notifications.
                        </Text>
                    ) : (
                        <VStack gap="0" align="stretch">
                            {notifications.map((notification) => (
                                <Box
                                    key={notification.id}
                                    px="4"
                                    py="3"
                                    bg={notification.isRead ? "white" : "LightYellow"}
                                    borderBottomWidth="1px"
                                    borderColor="gray.100"
                                    cursor={notification.isRead ? "default" : "pointer"}
                                    onClick={() => {
                                        if (!notification.isRead) markReadMutation.mutate(notification.id)
                                        navigate("/profile")
                                        setOpen(false)
                                    }}
                                >
                                    <Text fontSize="sm" fontWeight="semibold" color="Grey">
                                        {notification.title}
                                    </Text>
                                    <Text mt="1" fontSize="sm" color="GreyText">
                                        {notification.message}
                                    </Text>
                                    <Text mt="2" fontSize="xs" color="GreyMuted">
                                        {formatNotificationDate(notification.createdAt)}
                                    </Text>
                                </Box>
                            ))}
                        </VStack>
                    )}
                </Box>
            )}
        </Box>
    )
}
