import { defineConfig, devices } from "@playwright/test";

const APP_PORT = Number(process.env.E2E_APP_PORT ?? 5173);
const API_PORT = Number(process.env.E2E_API_PORT ?? 3100);

export const APP_URL = `http://127.0.0.1:${APP_PORT}`;
export const API_URL = `http://127.0.0.1:${API_PORT}/api`;

export default defineConfig({
    testDir: "./e2e",
    testMatch: "**/*.spec.ts",
    // The stub backend holds shared, mutable state (sessions, notifications, registered
    // emails), so specs take turns rather than racing each other through it.
    fullyParallel: false,
    workers: 1,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : [["list"]],
    timeout: 30_000,
    expect: { timeout: 7_000 },

    use: {
        baseURL: APP_URL,
        trace: "retain-on-failure",
        screenshot: "only-on-failure",
        video: "retain-on-failure",
    },

    projects: [
        {
            name: "chromium",
            // 1280x720 keeps the viewport above Chakra's `lg` breakpoint, so the desktop
            // sidebar and the desktop filter row are the ones under test.
            use: { ...devices["Desktop Chrome"] },
        },
    ],

    webServer: [
        {
            command: "node e2e/mock-api/server.mjs",
            url: `${API_URL}/pets/random`,
            reuseExistingServer: !process.env.CI,
            timeout: 30_000,
            env: {
                MOCK_API_PORT: String(API_PORT),
                MOCK_API_ORIGIN: APP_URL,
            },
        },
        {
            command: `bunx vite --host 127.0.0.1 --port ${APP_PORT} --strictPort`,
            url: APP_URL,
            reuseExistingServer: !process.env.CI,
            timeout: 60_000,
            env: {
                // Inline VITE_* vars win over .env, so the app talks to the stub backend
                // and never to a developer's local Go instance.
                VITE_API_URL: API_URL,
                VITE_LOGIN_REDIRECT: `${API_URL}/user/oauth/google`,
            },
        },
    ],
});
