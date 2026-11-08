// @vitest-environment jsdom
import { cleanup, fireEvent, screen, waitFor } from "@testing-library/react";
import { Route } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";

import Register from "../src/pages/register.page";
import { startMockApi, type MockApi } from "./helpers/mockApi";
import { renderRoutes } from "./helpers/renderWithProviders";

let api: MockApi | undefined;

function renderRegister(): void {
    renderRoutes(
        <>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<p>Login page</p>} />
        </>,
        { initialEntries: ["/register"] },
    );
}

function fillForm(overrides: Partial<Record<string, string>> = {}): void {
    const values: Record<string, string> = {
        "First name": "Ada",
        "Last name": "Lovelace",
        Email: "ada@example.com",
        Password: "password123",
        "Confirm password": "password123",
        ...overrides,
    };
    for (const [placeholder, value] of Object.entries(values)) {
        fireEvent.change(screen.getByPlaceholderText(placeholder), { target: { value } });
    }
}

afterEach(async () => {
    cleanup();
    await api?.close();
    api = undefined;
});

describe("register page integration", () => {
    // IT-FE-REG-01
    it("posts the signup payload and sends the user to the login page", async () => {
        api = await startMockApi({
            "POST /user/register": { body: { message: "Registered" } },
        });
        renderRegister();

        fillForm();
        fireEvent.click(screen.getByRole("button", { name: "Sign up" }));

        expect(await screen.findByText("Login page")).toBeTruthy();
        expect(api.lastRequest("POST /user/register")?.body).toEqual({
            email: "ada@example.com",
            password: "password123",
            firstname: "Ada",
            lastname: "Lovelace",
        });
    });

    // IT-FE-REG-01
    it("trims the name fields before they reach the backend", async () => {
        api = await startMockApi({
            "POST /user/register": { body: { message: "Registered" } },
        });
        renderRegister();

        fillForm({ "First name": "  Ada  ", "Last name": "  Lovelace  " });
        fireEvent.click(screen.getByRole("button", { name: "Sign up" }));

        expect(await screen.findByText("Login page")).toBeTruthy();
        expect(api.lastRequest("POST /user/register")?.body).toMatchObject({
            firstname: "Ada",
            lastname: "Lovelace",
        });
    });

    // IT-FE-REG-02
    it("rejects mismatched passwords locally without calling the backend", async () => {
        api = await startMockApi({
            "POST /user/register": { body: { message: "Registered" } },
        });
        renderRegister();

        fillForm({ "Confirm password": "different" });
        fireEvent.click(screen.getByRole("button", { name: "Sign up" }));

        expect(await screen.findByText("Passwords do not match")).toBeTruthy();
        expect(api.requestsFor("POST /user/register")).toHaveLength(0);
        expect(screen.queryByText("Login page")).toBeNull();
    });

    // IT-FE-REG-03
    it("keeps the user on the form and surfaces the failure when the email is taken", async () => {
        api = await startMockApi({
            "POST /user/register": { status: 409, body: { error: "Email already registered" } },
        });
        renderRegister();

        fillForm();
        fireEvent.click(screen.getByRole("button", { name: "Sign up" }));

        // registerAPI lets the axios error through untouched, so the page renders axios'
        // own message rather than the backend's `error` field.
        expect(await screen.findByText(/status code 409/i)).toBeTruthy();
        expect(screen.queryByText("Login page")).toBeNull();
        // One failed attempt must not be retried behind the user's back.
        await waitFor(() => expect(api!.requestsFor("POST /user/register")).toHaveLength(1));
    });
});
