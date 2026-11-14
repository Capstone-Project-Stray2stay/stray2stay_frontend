import { Avatar, Box, Flex, Text } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/query/auth.query"
import S2SNotificationCenter from "./S2SNotificationCenter.component"

/** `onNavigate` runs after the jump to /profile, e.g. so the mobile drawer can close itself. */
export default function S2SAvatar({ onNavigate }: { onNavigate?: () => void }) {
    const { user } = useAuth()
    const navigate = useNavigate()

    if (!user?.data?.authorized) return null

    return (
        <Box
            display="inline-flex"
            alignItems="center"
            gap="10px"
            h="57px"
            minW="171px"
            pl="10px"
            pr="14px"
            bgColor="rgba(255, 255, 255, 0.80)"
            rounded="full"
        >
            {/* Picture and name open the profile; the bell beside them keeps its own popover */}
            <Flex
                as="button"
                flex="1"
                alignItems="center"
                gap="10px"
                cursor="pointer"
                rounded="full"
                aria-label="Go to profile"
                onClick={() => {
                    navigate("/profile")
                    onNavigate?.()
                }}
            >
                <Avatar.Root boxSize="43px">
                    <Avatar.Fallback name={user.data.userFirstname} />
                    <Avatar.Image src={user.data.userCoverImage} />
                </Avatar.Root>
                <Text flex="1" textAlign="right" fontSize="18" fontWeight="semibold" color="Grey">{user.data.userFirstname}</Text>
            </Flex>
            <S2SNotificationCenter enabled />
        </Box>
    )
}
