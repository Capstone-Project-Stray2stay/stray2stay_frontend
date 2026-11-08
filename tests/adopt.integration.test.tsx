// @vitest-environment jsdom
import { cleanup, fireEvent, screen, waitFor } from "@testing-library/react";
import { Route } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import Adopt from "../src/pages/adopt.page";
import { petCard } from "./helpers/fixtures";
import { sessionRoutes, startMockApi, type MockApi, type RouteTable } from "./helpers/mockApi";
import { renderRoutes } from "./helpers/renderWithProviders";

// The province list comes from a third-party GitHub dataset over plain axios, not from
// our backend. Stubbing the module keeps the test off the public internet; every other
// request in this file still goes over a real socket to the stub server.
vi.mock("../src/services/apis/address.api", () => ({
    getThaiProvincesAPI: async () => [{ id: 1, name_th: "กรุงเทพมหานคร", name_en: "Bangkok" }],
    getThaiDistrictsAPI: async () => [],
    getThaiSubDistrictsAPI: async () => [],
}));

let api: MockApi | undefined;

// Deliberately disjoint from the breeds the cards carry: the breed dropdown renders its
// option labels into the same DOM, so overlapping names would make a card assertion pass
// on a dropdown entry.
const BREED_ROUTES: RouteTable = {
    "GET /pets/breeds": ({ query }) => ({
        body: { breedData: query.petType === "cat" ? ["Siamese"] : ["Shiba Inu"] },
    }),
    "GET /pets/breeds/images": ({ query }) => ({
        body: {
            imageData: [
                {
                    breed: query.petType === "cat" ? "Siamese" : "Shiba Inu",
                    image: "https://cdn.example.test/breed.jpg",
                },
            ],
        },
    }),
};

function searchRoute(pets: ReturnType<typeof petCard>[], totalPages = 1): RouteTable {
    return {
        "GET /pets": { body: { petsInfo: pets, totalCount: pets.length, totalPages } },
    };
}

function renderAdopt(): void {
    renderRoutes(
        <>
            <Route path="/adopt" element={<Adopt />} />
            <Route path="/pet-profile/:pid" element={<p>Pet profile page</p>} />
        </>,
        { initialEntries: ["/adopt"] },
    );
}

/** Adopt renders the keyword box twice (mobile + desktop); both are live in jsdom. */
function keywordInput(): HTMLElement {
    return screen.getAllByPlaceholderText("Search by keyword ( e.g. black, orange )")[0];
}

/** Blocks until the first /pets response has actually been painted as cards. */
async function waitForResults(): Promise<void> {
    await waitFor(() => expect(api!.requestsFor("GET /pets").length).toBeGreaterThan(0));
    await screen.findByText("Corgi");
}

afterEach(async () => {
    cleanup();
    await api?.close();
    api = undefined;
});

describe("adopt page search integration", () => {
    // IT-FE-ADOPT-01
    it("asks the backend for the first page and renders the returned pets", async () => {
        api = await startMockApi({
            ...sessionRoutes(),
            ...BREED_ROUTES,
            ...searchRoute([
                petCard({ pid: 7, petBreed: "Corgi" }),
                petCard({ pid: 8, petBreed: "Beagle", petAddress: "9 Rd, Yan Nawa, Sathon, Bangkok" }),
            ]),
        });
        renderAdopt();
        await waitForResults();

        expect(screen.getByText("Beagle")).toBeTruthy();
        // districtState() keeps only the last two address parts.
        expect(screen.getByText("Thung Khru, Bangkok")).toBeTruthy();
        expect(screen.getByText("Sathon, Bangkok")).toBeTruthy();

        expect(api.lastRequest("GET /pets")?.query).toEqual({ page: "1", pageSize: "16" });
    });

    // IT-FE-ADOPT-02
    it("narrows the query to one species when a category is picked", async () => {
        api = await startMockApi({
            ...sessionRoutes(),
            ...BREED_ROUTES,
            ...searchRoute([petCard({ pid: 7, petBreed: "Corgi" })]),
        });
        renderAdopt();
        await waitForResults();

        fireEvent.click(screen.getByText("Dog"));

        await waitFor(() =>
            expect(api!.lastRequest("GET /pets")?.query).toEqual({
                page: "1",
                pageSize: "16",
                petType: "dog",
            }),
        );
    });

    // IT-FE-ADOPT-03
    it("debounces keyword typing into a single backend search", async () => {
        api = await startMockApi({
            ...sessionRoutes(),
            ...BREED_ROUTES,
            ...searchRoute([petCard({ pid: 7, petBreed: "Corgi" })]),
        });
        renderAdopt();
        await waitForResults();
        const before = api.requestsFor("GET /pets").length;

        for (const value of ["b", "bl", "bla", "blac", "black"]) {
            fireEvent.change(keywordInput(), { target: { value } });
        }

        await waitFor(
            () => expect(api!.lastRequest("GET /pets")?.query.keyword).toBe("black"),
            { timeout: 3000 },
        );
        // Five keystrokes, one search.
        expect(api.requestsFor("GET /pets").length).toBe(before + 1);
    });

    // IT-FE-ADOPT-04
    it("requests the next page when a page number is clicked", async () => {
        api = await startMockApi({
            ...sessionRoutes(),
            ...BREED_ROUTES,
            ...searchRoute([petCard({ pid: 7, petBreed: "Corgi" })], 3),
        });
        renderAdopt();
        await waitForResults();

        // Chakra labels each page button "page N", which wins over its text content.
        fireEvent.click(await screen.findByRole("button", { name: "page 2" }));

        await waitFor(() =>
            expect(api!.lastRequest("GET /pets")?.query).toEqual({ page: "2", pageSize: "16" }),
        );
    });

    // IT-FE-ADOPT-04
    it("drops the keyword and filters back to defaults when Clear is pressed", async () => {
        api = await startMockApi({
            ...sessionRoutes(),
            ...BREED_ROUTES,
            ...searchRoute([petCard({ pid: 7, petBreed: "Corgi" })]),
        });
        renderAdopt();
        await waitForResults();

        fireEvent.change(keywordInput(), { target: { value: "black" } });
        await waitFor(
            () => expect(api!.lastRequest("GET /pets")?.query.keyword).toBe("black"),
            { timeout: 3000 },
        );

        fireEvent.click(screen.getByRole("button", { name: "Clear" }));

        await waitFor(
            () => expect(api!.lastRequest("GET /pets")?.query).toEqual({ page: "1", pageSize: "16" }),
            { timeout: 3000 },
        );
    });

    // IT-FE-ADOPT-05
    it("navigates to the pet profile for the card that was clicked", async () => {
        api = await startMockApi({
            ...sessionRoutes(),
            ...BREED_ROUTES,
            ...searchRoute([
                petCard({ pid: 7, petBreed: "Corgi" }),
                petCard({ pid: 42, petBreed: "Beagle" }),
            ]),
        });
        renderAdopt();
        await waitForResults();

        fireEvent.click(screen.getByText("Beagle"));

        expect(await screen.findByText("Pet profile page")).toBeTruthy();
    });

    // IT-FE-ADOPT-06
    it("shows the empty state rather than a spinner when nothing matches", async () => {
        api = await startMockApi({
            ...sessionRoutes(),
            ...BREED_ROUTES,
            ...searchRoute([], 1),
        });
        renderAdopt();

        expect(await screen.findByText("No pets match these filters.")).toBeTruthy();
    });

    // IT-FE-ADOPT-06
    it("shows the error state when the search endpoint fails", async () => {
        api = await startMockApi({
            ...sessionRoutes(),
            ...BREED_ROUTES,
            "GET /pets": { status: 500, body: { message: "boom" } },
        });
        renderAdopt();

        // useSearchPets retries once, so the error state is a couple of seconds out.
        await waitFor(
            () => expect(screen.getByText("Unable to load pets right now.")).toBeTruthy(),
            { timeout: 6000 },
        );
        expect(api.requestsFor("GET /pets").length).toBe(2);
    });
});
