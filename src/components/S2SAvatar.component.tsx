import { Avatar, Box, Text } from "@chakra-ui/react"
import { useAuth } from "../hooks/query/auth.query"
import S2SNotificationCenter from "./S2SNotificationCenter.component"

export default function S2SAvatar() {
    const { user } = useAuth()

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
            <Avatar.Root boxSize="43px">
                <Avatar.Fallback name={user.data.userFirstname} />
                <Avatar.Image src={user.data.userCoverImage} />
            </Avatar.Root>
            <Text flex="1" textAlign="right" fontSize="18" fontWeight="semibold" color="Grey">{user.data.userFirstname}</Text>
            <S2SNotificationCenter enabled />
        </Box>
    )
}
