import { useState } from "react"
import { Flex, VStack, Drawer, Portal, Text, Heading } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
import { Turn as Hamburger } from 'hamburger-react'

import { LuLogOut, LuLogIn } from "react-icons/lu";

import { useAppDispatch } from "../hooks/redux"
import { setAuth } from "../store/slices/authSlices"
import { useAuth, useLogout } from "../hooks/query/auth.query"

import { NavItem, BASE_NAV_ITEMS } from "../utils/navigation.util"
import { S2SAvatar } from "./S2S.components"

export default function S2SNavbar() {
    const [open, setOpen] = useState<boolean>(false)
    const [activeKey, setActiveKey] = useState<string>("home")

    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const { user } = useAuth()
    const authorized = user?.data?.authorized
    const logoutMutation = useLogout()

    const authItem = authorized
        ? { key: "logout", label: "Log Out", icon: LuLogOut, nav: "/" }
        : { key: "login", label: "Log In", icon: LuLogIn, nav: "/login" }

    const NAV_ITEMS = [...BASE_NAV_ITEMS, authItem]

    const handleNavItemClick = (key: string, nav: string) => {
        if (key === "logout") {
            logoutMutation.mutate(undefined, {
                onSuccess: () => {
                    dispatch(setAuth({ authorized: false, firstname: "", coverImage: "" }))
                    navigate(nav)
                    setOpen(false)
                    window.location.reload()
                },
            })
            return
        }
        setActiveKey(key)
        navigate(nav)
        setOpen(false)
    }

    return (
        <Flex display={{ base: "flex", md: "none" }} width="100%" justifyContent="space-between" alignItems="center" px={8} py={4} bg="LightBlue">
            <Text fontWeight={"semibold"} color="Grey" fontSize={"20px"}>Stray2Stay</Text>
            <Drawer.Root placement="start" size="full" open={open} onOpenChange={(e) => setOpen(e.open)}>
                <Drawer.Trigger asChild p={0}>
                    <Hamburger direction="right" size={20} toggled={open} toggle={setOpen} color="Grey" />
                </Drawer.Trigger>
                <Portal>
                    <Drawer.Backdrop />
                    <Drawer.Positioner>
                        <Drawer.Content>
                                <Flex width="100%" justify={"end"} pt={6} px={6}>
                                    <Drawer.CloseTrigger asChild>
                                        <Hamburger direction="right" size={20} toggled={open} toggle={setOpen} color="Grey" />
                                    </Drawer.CloseTrigger>
                                </Flex>
                                <Flex pt={4} px={8} alignItems="center" justifyContent="space-between" gap={2} color="Grey">
                                    <Heading as="h1">Stray2Stay</Heading>
                                    <Flex alignItems="center" gap={4}>
                                        <S2SAvatar />
                                    </Flex>
                                </Flex>
                            <Drawer.Header>
                            </Drawer.Header>
                            <Drawer.Body p={0}>
                                <VStack gap={2} align="stretch" mt={2}>
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
                            </Drawer.Body>
                        </Drawer.Content>
                    </Drawer.Positioner>
                </Portal>
            </Drawer.Root>
        </Flex>
    )
}