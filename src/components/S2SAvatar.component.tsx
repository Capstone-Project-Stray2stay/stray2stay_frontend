import { Avatar, Box, Text } from "@chakra-ui/react"
import { useAuth } from "../hooks/query/auth.query"

export default function S2SAvatar() {
    const { user } = useAuth()

    if (!user?.data?.authorized) return null

    return (
        <Box display="inline-flex" alignItems="center" gap={2} bgColor="White" p={2} rounded="full" boxShadow="md">
            <Avatar.Root>
                <Avatar.Fallback name={user.data.userFirstname} />
                <Avatar.Image src={user.data.userCoverImage} />
            </Avatar.Root>
            <Text fontWeight="semibold" color="Grey" pr="1">{user.data.userFirstname}</Text>
        </Box>
    )
}