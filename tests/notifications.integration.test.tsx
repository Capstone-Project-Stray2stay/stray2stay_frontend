// @vitest-environment jsdom
import { cleanup, fireEvent, screen, waitFor } from "@testing-library/react";
import { Route, useLocation } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";

import S2SAvatar from "../src/components/S2SAvatar.component";
import { notification } from "./helpers/fixtures";
import { sessionRoutes, startMockApi, type MockApi } from "./helpers/mockApi";
import { renderRoutes } from "./helpers/renderWithProviders";

let api: MockApi | undefined;

/** Surfaces the querystring the notification click built, which is the real behaviour. */
function ProfileStub() {
    const location = useLocation();
    return <p>Profile page{location.search}</p>;
}

function renderAvatar(): void {
    renderRoutes(
        <>
            <Route path="/" element={<S2SAvatar />} />
            <Route path="/profile" element={<ProfileStub />} />
        </>,
        { initialEntries: ["/"] },
    );
}

afterEach(async () => {
    cleanup();
    await api?.close();
    api = undefined;
});

describe("notification centre integration", () => {
    // IT-FE-NOTIF-01
    it("renders nothing at all for a signed-out visitor", async () => {
        api = await startMockApi(sessionRoutes({ authorized: false }));
        renderAvatar();

        await waitFor(() => expect(api!.requestsFor("GET /user/authorize").length).toBe(1));
        expect(screen.queryByRole("button", { name: "Notifications" })).toBeNull();
        // The bell is gated behind the avatar, so an anonymous page never polls.
        expect(api.requestsFor("GET /notifications")).toHaveLength(0);
    });

    // IT-FE-NOTIF-02
    it("shows the signed-in name and the unread badge from the backend", async () => {
        api = await startMockApi(
            sessionRoutes({
                authorized: true,
                firstname: "Ada",
                notifications: [notification({ id: 1 }), notification({ id: 2, isRead: true })],
                unreadCount: 1,
            }),
        );
        renderAvatar();

        expect(await screen.findByText("Ada")).toBeTruthy();
        expect(await screen.findByText("1")).toBeTruthy();
    });

    // IT-FE-NOTIF-02
    it("caps the badge at 99+ so a large backlog cannot break the layout", async () => {
        api = await startMockApi(
            sessionRoutes({ authorized: true, notifications: [notification()], unreadCount: 250 }),
        );
        renderAvatar();

        expect(await screen.findByText("99+")).toBeTruthy();
    });

    // IT-FE-NOTIF-03
    it("lists the notifications once the bell is opened", async () => {
        api = await startMockApi(
            sessionRoutes({
                authorized: true,
                notifications: [
                    notification({ id: 1, title: "New adoption request" }),
                    notification({ id: 2, type: "ADOPTION_SELECTED", title: "You were selected" }),
                ],
                unreadCount: 2,
            }),
        );
        renderAvatar();

        fireEvent.click(await screen.findByRole("button", { name: "Notifications" }));

        expect(await screen.findByText("New adoption request")).toBeTruthy();
        expect(screen.getByText("You were selected")).toBeTruthy();
    });

    // IT-FE-NOTIF-04
    it("marks an unread item read and opens the rehoming tab for that pet", async () => {
        api = await startMockApi(
            sessionRoutes({
                authorized: true,
                notifications: [
                    notification({ id: 11, type: "ADOPTION_REQUESTED", petId: 5 }),
                ],
                unreadCount: 1,
            }),
        );
        renderAvatar();

        fireEvent.click(await screen.findByRole("button", { name: "Notifications" }));
        fireEvent.click(await screen.findByText("New adoption request"));

        expect(await screen.findByText("Profile page?tab=rehoming&pet=5")).toBeTruthy();
        await waitFor(() =>
            expect(api!.lastRequest("PUT /notifications/:id/read")?.path).toBe(
                "/notifications/11/read",
            ),
        );
    });

    // IT-FE-NOTIF-04
    it("routes an adopter-facing notification to the adoptions tab instead", async () => {
        api = await startMockApi(
            sessionRoutes({
                authorized: true,
                notifications: [
                    notification({
                        id: 12,
                        type: "ADOPTION_SELECTED",
                        title: "You were selected",
                        petId: 9,
                    }),
                ],
                unreadCount: 1,
            }),
        );
        renderAvatar();

        fireEvent.click(await screen.findByRole("button", { name: "Notifications" }));
        fireEvent.click(await screen.findByText("You were selected"));

        expect(await screen.findByText("Profile page?tab=adoptions&pet=9")).toBeTruthy();
    });

    // IT-FE-NOTIF-04
    it("does not re-mark an item the backend already reported as read", async () => {
        api = await startMockApi(
            sessionRoutes({
                authorized: true,
                notifications: [notification({ id: 13, isRead: true })],
                unreadCount: 0,
            }),
        );
        renderAvatar();

        fireEvent.click(await screen.findByRole("button", { name: "Notifications" }));
        fireEvent.click(await screen.findByText("New adoption request"));

        expect(await screen.findByText(/Profile page/)).toBeTruthy();
        expect(api.requestsFor("PUT /notifications/:id/read")).toHaveLength(0);
    });

    // IT-FE-NOTIF-05
    it("clears the badge after Mark all as read and the refetch that follows", async () => {
        const unread = sessionRoutes({
            authorized: true,
            notifications: [notification({ id: 1 }), notification({ id: 2 })],
            unreadCount: 2,
        });
        api = await startMockApi({ ...unread, "PUT /notifications/read-all": { body: {} } });
        renderAvatar();

        fireEvent.click(await screen.findByRole("button", { name: "Notifications" }));
        expect(await screen.findByText("2")).toBeTruthy();

        // The backend has cleared them by the time react-query invalidates and refetches.
        api.setRoutes({
            ...sessionRoutes({
                authorized: true,
                notifications: [
                    notification({ id: 1, isRead: true }),
                    notification({ id: 2, isRead: true }),
                ],
                unreadCount: 0,
            }),
            "PUT /notifications/read-all": { body: {} },
        });

        fireEvent.click(screen.getByRole("button", { name: "Mark all notifications as read" }));

        await waitFor(() =>
            expect(api!.requestsFor("PUT /notifications/read-all")).toHaveLength(1),
        );
        await waitFor(() => expect(screen.queryByText("2")).toBeNull());
        expect(
            screen.queryByRole("button", { name: "Mark all notifications as read" }),
        ).toBeNull();
    });
});
