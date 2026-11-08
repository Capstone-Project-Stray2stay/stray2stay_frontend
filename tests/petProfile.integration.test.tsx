// @vitest-environment jsdom
import { cleanup, fireEvent, screen, waitFor } from "@testing-library/react";
import { Route, useLocation } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";

import PetProfile from "../src/pages/petProfile";
import { petDetail } from "./helpers/fixtures";
import { sessionRoutes, startMockApi, type MockApi, type RouteTable } from "./helpers/mockApi";
import { renderRoutes } from "./helpers/renderWithProviders";

let api: MockApi | undefined;

function LoginStub() {
    const location = useLocation();
    const from = (location.state as { from?: { pathname: string } } | null)?.from;
    return <p>Login page (from: {from?.pathname ?? "none"})</p>;
}

function renderPetProfile(pid = "1"): void {
    renderRoutes(
        <>
            <Route path="/pet-profile/:pid" element={<PetProfile />} />
            <Route path="/login" element={<LoginStub />} />
            <Route path="/rehome/:petId/edit" element={<p>Edit pet page</p>} />
        </>,
        { initialEntries: [`/pet-profile/${pid}`] },
    );
}

function petRoute(
    body: Record<string, unknown>,
    extra: { isOwner?: boolean; adoptionStatus?: string } = {},
): RouteTable {
    return {
        "GET /pets/:pid": {
            body: {
                petsInfo: body,
                isOwner: extra.isOwner ?? false,
                adoptionStatus: extra.adoptionStatus ?? "",
            },
        },
    };
}

afterEach(async () => {
    cleanup();
    await api?.close();
    api = undefined;
});

describe("pet profile integration", () => {
    // IT-FE-PET-01
    it("fetches the pet by the id in the URL and renders its card", async () => {
        api = await startMockApi({
            ...sessionRoutes({ authorized: true, firstname: "Ada" }),
            ...petRoute(petDetail({ pid: 42, petName: "Mochi", petBreed: "Shiba Inu" })),
        });
        renderPetProfile("42");

        expect(await screen.findByText("Mochi")).toBeTruthy();
        expect(screen.getByText("Shiba Inu")).toBeTruthy();
        expect(screen.getByText("Needs a fenced yard.")).toBeTruthy();
        expect(api.lastRequest("GET /pets/:pid")?.path).toBe("/pets/42");
    });

    // IT-FE-PET-01
    it("normalises Go's null slices so an empty pet still renders", async () => {
        api = await startMockApi({
            ...sessionRoutes({ authorized: true }),
            ...petRoute(
                petDetail({
                    petImageAddress: null,
                    petPersonality: null,
                    petVaccination: null,
                    petName: "",
                    note: "",
                }),
            ),
        });
        renderPetProfile();

        expect(await screen.findByText("Unnamed")).toBeTruthy();
        expect(screen.getByText("No additional notes.")).toBeTruthy();
    });

    // IT-FE-PET-02
    it("sends an anonymous visitor to log in, remembering the pet they were viewing", async () => {
        api = await startMockApi({
            ...sessionRoutes({ authorized: false }),
            ...petRoute(petDetail({ pid: 42 })),
        });
        renderPetProfile("42");

        fireEvent.click(await screen.findByRole("button", { name: /Adopt this pet/ }));

        expect(await screen.findByText("Login page (from: /pet-profile/42)")).toBeTruthy();
        // No adoption request may escape for a visitor who was never signed in.
        expect(api.requestsFor("POST /pets/:pid/adopt")).toHaveLength(0);
    });

    // IT-FE-PET-03
    it("offers the owner tools instead of the adopt button on their own pet", async () => {
        api = await startMockApi({
            ...sessionRoutes({ authorized: true }),
            ...petRoute(petDetail({ pid: 42 }), { isOwner: true }),
        });
        renderPetProfile("42");

        expect(await screen.findByRole("button", { name: /Edit Pet Profile/ })).toBeTruthy();
        expect(screen.queryByRole("button", { name: /Adopt this pet/ })).toBeNull();

        fireEvent.click(screen.getByRole("button", { name: /Edit Pet Profile/ }));
        expect(await screen.findByText("Edit pet page")).toBeTruthy();
    });

    // IT-FE-PET-04
    it("shows pending approval instead of letting the user apply twice", async () => {
        api = await startMockApi({
            ...sessionRoutes({ authorized: true }),
            ...petRoute(petDetail(), { adoptionStatus: "PENDING" }),
        });
        renderPetProfile();

        expect(await screen.findByRole("button", { name: /Pending Approval/ })).toBeTruthy();
        expect(screen.queryByRole("button", { name: /Adopt this pet/ })).toBeNull();
    });

    // IT-FE-PET-04
    it("closes off adoption once the pet is marked ADOPTED", async () => {
        api = await startMockApi({
            ...sessionRoutes({ authorized: true }),
            ...petRoute(petDetail({ status: "ADOPTED" })),
        });
        renderPetProfile();

        expect(await screen.findByText("This pet has already been adopted.")).toBeTruthy();
        expect(screen.queryByRole("button", { name: /Adopt this pet/ })).toBeNull();
    });

    // IT-FE-PET-05
    it("shows the not-found state for an id the backend rejects", async () => {
        api = await startMockApi({
            ...sessionRoutes({ authorized: true }),
            "GET /pets/:pid": { status: 404, body: { error: "pet not found" } },
        });
        renderPetProfile("9999");

        expect(await screen.findByText("Pet not found.")).toBeTruthy();
        await waitFor(() => expect(api!.requestsFor("GET /pets/:pid")).toHaveLength(1));
    });
});
