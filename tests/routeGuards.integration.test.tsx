// @vitest-environment jsdom
import { cleanup, screen, waitFor } from "@testing-library/react";
import { Route, useLocation } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";

import NewUserRedirect from "../src/middlewares/newUserRedirect.middleware";
import ProtectedRoute from "../src/middlewares/protectedRoute.middleware";
import { startMockApi, type MockApi } from "./helpers/mockApi";
import { renderRoutes } from "./helpers/renderWithProviders";

let api: MockApi | undefined;

/** Echoes back where the guard sent us and what it remembered, so tests can assert both. */
function LoginStub() {
    const location = useLocation();
    const from = (location.state as { from?: { pathname: string } } | null)?.from;
    return <p>Login page (from: {from?.pathname ?? "none"})</p>;
}

afterEach(async () => {
    cleanup();
    await api?.close();
    api = undefined;
});

describe("ProtectedRoute integration", () => {
    // IT-FE-GUARD-01
    it("renders the guarded page once /user/authorize confirms the session", async () => {
        api = await startMockApi({
            "GET /user/authorize": {
                body: { authorized: true, userFirstname: "Ada", userCoverImage: null },
            },
        });

        renderRoutes(
            <>
                <Route element={<ProtectedRoute />}>
                    <Route path="/profile" element={<p>Profile page</p>} />
                </Route>
                <Route path="/login" element={<LoginStub />} />
            </>,
            { initialEntries: ["/profile"] },
        );

        expect(await screen.findByText("Profile page")).toBeTruthy();
        expect(api.requestsFor("GET /user/authorize")).toHaveLength(1);
    });

    // IT-FE-GUARD-02
    it("redirects to /login and remembers the page the user wanted", async () => {
        api = await startMockApi({
            "GET /user/authorize": { status: 401, body: { message: "Unauthorized" } },
        });

        renderRoutes(
            <>
                <Route element={<ProtectedRoute />}>
                    <Route path="/diary" element={<p>Diary page</p>} />
                </Route>
                <Route path="/login" element={<LoginStub />} />
            </>,
            { initialEntries: ["/diary"] },
        );

        expect(await screen.findByText("Login page (from: /diary)")).toBeTruthy();
        expect(screen.queryByText("Diary page")).toBeNull();
    });

    // IT-FE-GUARD-02
    it("treats a 200 carrying authorized:false as unauthenticated", async () => {
        api = await startMockApi({
            "GET /user/authorize": { body: { authorized: false } },
        });

        renderRoutes(
            <>
                <Route element={<ProtectedRoute />}>
                    <Route path="/rehome" element={<p>Rehome page</p>} />
                </Route>
                <Route path="/login" element={<LoginStub />} />
            </>,
            { initialEntries: ["/rehome"] },
        );

        expect(await screen.findByText("Login page (from: /rehome)")).toBeTruthy();
    });

    // IT-FE-GUARD-01
    it("shows nothing from the guarded page while the session check is in flight", async () => {
        api = await startMockApi({
            "GET /user/authorize": { body: { authorized: true } },
        });

        renderRoutes(
            <>
                <Route element={<ProtectedRoute />}>
                    <Route path="/profile" element={<p>Profile page</p>} />
                </Route>
                <Route path="/login" element={<LoginStub />} />
            </>,
            { initialEntries: ["/profile"] },
        );

        // Before the round trip resolves the guard must show neither the page nor a
        // premature bounce to /login — otherwise every refresh would flash the login screen.
        expect(screen.queryByText("Profile page")).toBeNull();
        expect(screen.queryByText(/Login page/)).toBeNull();

        expect(await screen.findByText("Profile page")).toBeTruthy();
    });
});

describe("NewUserRedirect integration", () => {
    // IT-FE-GUARD-03
    it("sends a brand-new account to the profile setup page", async () => {
        api = await startMockApi({
            "GET /user/status": { body: { userData: true } },
        });

        renderRoutes(
            <>
                <Route element={<NewUserRedirect />}>
                    <Route path="/" element={<p>Home page</p>} />
                    <Route path="/user-information" element={<p>Setup page</p>} />
                </Route>
            </>,
            { initialEntries: ["/"] },
        );

        expect(await screen.findByText("Setup page")).toBeTruthy();
        expect(screen.queryByText("Home page")).toBeNull();
    });

    // IT-FE-GUARD-03
    it("lets the setup page itself render so the redirect cannot loop", async () => {
        api = await startMockApi({
            "GET /user/status": { body: { userData: true } },
        });

        renderRoutes(
            <>
                <Route element={<NewUserRedirect />}>
                    <Route path="/" element={<p>Home page</p>} />
                    <Route path="/user-information" element={<p>Setup page</p>} />
                </Route>
            </>,
            { initialEntries: ["/user-information"] },
        );

        expect(await screen.findByText("Setup page")).toBeTruthy();
    });

    // IT-FE-GUARD-04
    it("renders the requested page for an established account", async () => {
        api = await startMockApi({
            "GET /user/status": { body: { userData: false } },
        });

        renderRoutes(
            <>
                <Route element={<NewUserRedirect />}>
                    <Route path="/" element={<p>Home page</p>} />
                    <Route path="/user-information" element={<p>Setup page</p>} />
                </Route>
            </>,
            { initialEntries: ["/"] },
        );

        expect(await screen.findByText("Home page")).toBeTruthy();
        expect(screen.queryByText("Setup page")).toBeNull();
    });

    // IT-FE-GUARD-04
    it("falls through to the page when the status call fails", async () => {
        api = await startMockApi({
            "GET /user/status": { status: 500, body: { message: "boom" } },
        });

        renderRoutes(
            <>
                <Route element={<NewUserRedirect />}>
                    <Route path="/" element={<p>Home page</p>} />
                    <Route path="/user-information" element={<p>Setup page</p>} />
                </Route>
            </>,
            { initialEntries: ["/"] },
        );

        // A failing status endpoint must not strand an existing user on the setup form.
        expect(await screen.findByText("Home page")).toBeTruthy();
        await waitFor(() => expect(api!.requestsFor("GET /user/status").length).toBeGreaterThan(0));
    });
});
