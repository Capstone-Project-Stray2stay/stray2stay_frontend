import type { ReactElement, ReactNode } from "react";
import { configureStore } from "@reduxjs/toolkit";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, type RenderResult } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import authReducer from "../../src/store/slices/authSlices";
import system from "../../src/theme";

/**
 * Retries off so a stubbed 4xx surfaces immediately instead of after react-query's
 * back-off, and a fresh client per render so one test's cache can't answer the next
 * test's query.
 */
export function createTestQueryClient(): QueryClient {
    return new QueryClient({
        defaultOptions: {
            queries: { retry: false, gcTime: 0 },
            mutations: { retry: false },
        },
    });
}

/**
 * The real store minus redux-persist: persistence writes to localStorage, which jsdom
 * shares across tests in a file, so a persisted `authorized: true` would leak forward.
 */
export function createTestStore() {
    return configureStore({ reducer: { auth: authReducer } });
}

interface RenderOptions {
    /** Router history to start from; the last entry is the active route. */
    initialEntries?: string[];
}

/**
 * Renders caller-supplied `<Route>` elements under the same provider stack as
 * `src/main.tsx`. Use this when a test needs to prove a redirect or a navigation landed
 * on a particular path.
 */
export function renderRoutes(routes: ReactNode, options: RenderOptions = {}): RenderResult {
    const { initialEntries = ["/"] } = options;

    return render(
        <Provider store={createTestStore()}>
            <ChakraProvider value={system}>
                <QueryClientProvider client={createTestQueryClient()}>
                    <MemoryRouter initialEntries={initialEntries}>
                        <Routes>{routes}</Routes>
                    </MemoryRouter>
                </QueryClientProvider>
            </ChakraProvider>
        </Provider>,
    );
}

/** Renders a single component at `path` with the full provider stack around it. */
export function renderWithProviders(
    ui: ReactElement,
    options: RenderOptions & { path?: string } = {},
): RenderResult {
    const { path = "/", initialEntries = [path] } = options;
    return renderRoutes(<Route path={path} element={ui} />, { initialEntries });
}
