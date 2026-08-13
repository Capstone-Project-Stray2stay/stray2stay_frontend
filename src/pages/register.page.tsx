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

import { S2SInput, S2SButton } from "../components/S2S.components";

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ Firstname: "", Lastname: "", Email: "", Password: "" });
    const [error, setError] = useState("");
    const [isPending, setIsPending] = useState(false);

    const handleChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((f) => ({ ...f, [key]: e.target.value }));

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        setIsPending(true);
        try {
            const res = await fetch("/api/user/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => null);
                throw new Error(data?.error || "Registration failed");
            }
            navigate("/login");
        } catch (err: any) {
            setError(err.message || "Registration failed");
        } finally {
            setIsPending(false);
        }
    }

    return (
        <Box maxW="sm" mx="auto" mt={20}>
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
                        color="Blue"
                        fontWeight="medium"
                        _hover={{ textDecoration: "underline", textUnderlineOffset: "2px" }}
                    >
                        Log in
                    </Text>
                </Link>
            </Flex>
        </Box>
    );
}