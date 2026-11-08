// @vitest-environment jsdom
import { once } from "node:events";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import Login from "../src/pages/login.page";
import axiosInstance from "../src/services/axios/axiosInstance";
import system from "../src/theme";

type LoginRequest = { email: string; password: string };

let apiServer: Server | undefined;
let receivedLoginRequest: LoginRequest | undefined;
const originalBaseURL = axiosInstance.defaults.baseURL;
const originalAdapter = axiosInstance.defaults.adapter;

async function startLoginApi(statusCode: number): Promise<void> {
    receivedLoginRequest = undefined;
    const server = createServer((request, response) => {
        let body = "";
        request.setEncoding("utf8");
        request.on("data", (chunk: string) => { body += chunk; });
        request.on("end", () => {
            if (request.method !== "POST" || request.url !== "/api/user/login") {
                response.writeHead(404, { "Content-Type": "application/json" });
                response.end(JSON.stringify({ message: "Not found" }));
                return;
            }

            receivedLoginRequest = JSON.parse(body) as LoginRequest;
            response.writeHead(statusCode, { "Content-Type": "application/json" });
            response.end(JSON.stringify(
                statusCode === 200
                    ? { message: "Login successful" }
                    : { message: "Invalid credentials" },
            ));
        });
    });
    apiServer = server;

    const listening = once(server, "listening");
    server.listen(0, "127.0.0.1");
    await listening;

    const address = server.address() as AddressInfo;
    axiosInstance.defaults.baseURL = `http://127.0.0.1:${address.port}/api`;
    // Use Node's real HTTP transport so the test crosses an HTTP boundary.
    axiosInstance.defaults.adapter = axios.getAdapter("http");
}

function renderLogin(): void {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    });

    render(
        <ChakraProvider value={system}>
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={["/login"]}>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/" element={<p>Home after successful login</p>} />
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        </ChakraProvider>,
    );
}

afterEach(async () => {
    cleanup();
    axiosInstance.defaults.baseURL = originalBaseURL;
    axiosInstance.defaults.adapter = originalAdapter;

    const server = apiServer;
    if (server?.listening) {
        const closed = once(server, "close");
        server.close();
        await closed;
    }
    apiServer = undefined;
});

describe("login page integration", () => {
    // IT-FE-LOGIN-01
    it("submits credentials through the auth API and navigates after success", async () => {
        await startLoginApi(200);
        renderLogin();

        fireEvent.change(screen.getByPlaceholderText("Email"), {
            target: { value: "ada@example.com" },
        });
        fireEvent.change(screen.getByPlaceholderText("Password"), {
            target: { value: "password123" },
        });
        fireEvent.click(screen.getByRole("button", { name: "Log in" }));

        expect(await screen.findByText("Home after successful login")).toBeTruthy();
        expect(receivedLoginRequest).toEqual({ email: "ada@example.com", password: "password123" });
    });

    // IT-FE-LOGIN-02
    it("shows the login error when the auth API rejects credentials", async () => {
        await startLoginApi(401);
        renderLogin();

        fireEvent.change(screen.getByPlaceholderText("Email"), {
            target: { value: "ada@example.com" },
        });
        fireEvent.change(screen.getByPlaceholderText("Password"), {
            target: { value: "wrong-password" },
        });
        fireEvent.click(screen.getByRole("button", { name: "Log in" }));

        expect(await screen.findByText("Invalid email or password")).toBeTruthy();
        expect(receivedLoginRequest).toEqual({ email: "ada@example.com", password: "wrong-password" });
    });
});
