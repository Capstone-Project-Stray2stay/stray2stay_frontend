import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    Box,
    Flex,
    VStack,
    Heading,
    Text,
} from "@chakra-ui/react";

import { registerAPI } from "../services/apis/auth.api";

import { S2SInput, S2SButton } from "../components/S2S.components";
import { registerSchema } from "../validators/auth.validator";

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState<{ Firstname: string; Lastname: string; Email: string; Password: string; ConfirmPassword: string }>({
        Firstname: "",
        Lastname: "",
        Email: "",
        Password: "",
        ConfirmPassword: ""
    });
    const [error, setError] = useState<string>("");
    const [isPending, setIsPending] = useState<boolean>(false);

    const handleChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((f) => ({ ...f, [key]: e.target.value }));

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");

        const parsed = registerSchema.safeParse(form);
        if (!parsed.success) {
            setError(parsed.error.issues[0]?.message ?? "Please check your input");
            return;
        }

        setIsPending(true);
        try {
            await registerAPI(
                parsed.data.Email,
                parsed.data.Password,
                parsed.data.Firstname,
                parsed.data.Lastname
            );
            navigate("/login");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Registration failed");
        } finally {
            setIsPending(false);
        }
    }

    return (
        <Box w="100%" h="100vh" bgGradient="BlueYellow">

            <Box maxW="sm" mx="auto" pt={20} px="25px">
                <Heading mb={6} size="lg" color="Grey">
                    Sign up
                </Heading>

                <form onSubmit={handleSubmit}>
                    <VStack gap={4} mb={6}>
                        <S2SInput
                            placeholder="First name"
                            value={form.Firstname}
                            onChange={handleChange("Firstname")}
                        />
                        <S2SInput
                            placeholder="Last name"
                            value={form.Lastname}
                            onChange={handleChange("Lastname")}
                        />
                        <S2SInput
                            placeholder="Email"
                            type="email"
                            value={form.Email}
                            onChange={handleChange("Email")}
                        />
                        <S2SInput
                            placeholder="Password"
                            type="password"
                            value={form.Password}
                            onChange={handleChange("Password")}
                        />
                        <S2SInput
                            placeholder="Confirm password"
                            type="password"
                            value={form.ConfirmPassword}
                            onChange={handleChange("ConfirmPassword")}
                        />
                        {error && (
                            <Text color="red.500" fontSize="sm">
                                {error}
                            </Text>
                        )}
                        <S2SButton type="submit" text="Sign up" bgColor="Blue" width="full" loading={isPending} />
                    </VStack>
                </form>

                <Flex justify="center" align="center" gap={1}>
                    <Text fontSize="sm" color="LightGrey">
                        Already have an account?{" "}
                    </Text>
                    <Link to="/login">
                        <Text
                            fontSize="sm"
                            color="BlueText"
                            fontWeight="medium"
                            _hover={{ textDecoration: "underline", textUnderlineOffset: "2px" }}
                        >
                            Log in
                        </Text>
                    </Link>
                </Flex>
            </Box>
        </Box>
    );
}