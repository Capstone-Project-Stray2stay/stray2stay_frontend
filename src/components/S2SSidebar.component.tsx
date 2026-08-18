import { Box, Heading, VStack } from "@chakra-ui/react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAppDispatch } from "../hooks/redux"
import { setAuth } from "../store/slices/authSlices"

import { useAuth, useLogout } from "../hooks/query/auth.query"
import { NavItem, BASE_NAV_ITEMS, AUTH_ONLY_KEYS, getActiveNavKey } from "../utils/navigation.util"

import { LuLogOut, LuLogIn } from "react-icons/lu";

export default function S2SSidebar() {
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useAppDispatch()

    const { user } = useAuth()
    const authorized: boolean = user?.data?.authorized ?? false
    const logoutMutation = useLogout()

    const authItem = authorized
        ? { key: "logout", label: "Log Out", icon: LuLogOut, nav: "/" }
        : { key: "login", label: "Log In", icon: LuLogIn, nav: "/login" }
    
    const NAV_ITEMS = [
        ...BASE_NAV_ITEMS.filter((item) =>
            authorized ? true : !AUTH_ONLY_KEYS.includes(item.key)
        ),
        authItem,
    ]
    const activeKey = getActiveNavKey(location.pathname, NAV_ITEMS)

    const handleNavItemClick = (key: string, nav: string) => {
        if (key === "logout") {
            logoutMutation.mutate(undefined, {
                onSuccess: () => {
                    dispatch(setAuth({ authorized: false, firstname: "", coverImage: "" }))
                    navigate(nav)
                    window.location.reload()
                },
            })
            return
        }
        navigate(nav)
    }

    return (
        <Box
            w="12vw"
            h="100vh"
            display={{ base: "none", md: "block" }}
            bgColor="white"
            position="fixed"
            top={0}
            left={0}
            borderRadius="0 30px 30px 0"
            py={4}
            overflow="hidden"
        >
            <Heading p={4} color="Grey">
                Stray2Stay
            </Heading>

            <VStack gap={2} align="stretch" mt={4}>
                {NAV_ITEMS.map((item) => (
                    <NavItem
                        key={item.key}
                        icon={item.icon}
                        label={item.label}
                        active={activeKey === item.key}
                        onClick={() => handleNavItemClick(item.key, item.nav)}
                    />
                ))}
            </VStack>
        </Box>
    )
}