import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    Box,
    Flex,
    Button,
    VStack,
    HStack,
    Heading,
    Text,
    Separator,
} from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";

import { S2SInput, S2SButton } from "../components/S2S.components";

import { useLogin } from "../hooks/query/auth.query";
import { loginSchema } from "../validators/auth.validator";

export default function Login() {
    const { mutateAsync: login, isPending } = useLogin();
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");

        const parsed = loginSchema.safeParse({ email, password });
        if (!parsed.success) {
            setError(parsed.error.issues[0]?.message ?? "Please check your input");
            return;
        }
        try {
            await login(parsed.data);
            navigate("/");
        } catch (err: unknown) {
            setError("Invalid email or password");
        }
    }

    const handleGoogleLogin = () => {
        window.location.href = import.meta.env.VITE_LOGIN_REDIRECT;
    };

    return (
        <Box maxW="sm" mx="auto" mt={20}>
            <Heading mb={6} size="lg" color="Grey">
                Log in
            </Heading>

            <form onSubmit={handleSubmit}>
                <VStack gap={4} mb={6}>
                    <S2SInput
                        placeholder="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <S2SInput
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && <Text color="red.500" fontSize="sm">
                        {error}
                    </Text>}
                    <S2SButton type="submit" text="Log in" bgColor="Blue" width="full" loading={isPending} />
                </VStack>
            </form>

            <Flex justify="center" align="center" mb={6} gap={1}>
                <Text fontSize="sm" color="LightGrey">
                    Don't have an account?{" "}
                </Text>
                <Link to="/register">
                    <Text fontSize="sm" color="Blue" fontWeight="medium" _hover={{ textDecoration: "underline", textUnderlineOffset: "2px" }}>
                        Register
                    </Text>
                </Link>
            </Flex>

            <HStack mb={6}>
                <Separator flex="1" />
                <Text fontSize="sm" color="Grey" whiteSpace="nowrap">
                    or continue with Google
                </Text>
                <Separator flex="1" />
            </HStack>

            <Button onClick={handleGoogleLogin} w="full" variant="outline" rounded="full" _hover={{ bg: "grey.200" }}>
                <FcGoogle size={20} />
                Sign in with Google
            </Button>
        </Box>
    );
}