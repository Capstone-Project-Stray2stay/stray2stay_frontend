import { test as base, expect, type Page } from "@playwright/test";

import { API_URL } from "../playwright.config";
import { USER } from "./mock-api/data.mjs";

export { expect, USER, API_URL };

/**
 * The province dropdown pulls a ~2MB dataset straight from raw.githubusercontent.com
 * over plain axios. Letting that through would make every run depend on GitHub being up
 * and fast; it is third-party reference data, not our backend, so it gets stubbed here
 * while every other request in these specs goes to the stub API over real HTTP.
 */
const PROVINCES = [
    { id: 1, name: { th: "กรุงเทพมหานคร", en: "Bangkok" } },
    { id: 2, name: { th: "เชียงใหม่", en: "Chiang Mai" } },
];

export const test = base.extend({
    /**
     * Overriding `page` rather than adding a `test.beforeEach` here is deliberate: a
     * module-level hook in a shared helper is registered against whichever spec file
     * happened to load the module first, so every later file silently runs without it.
     * A fixture is bound per test, in every file that uses it.
     */
    page: async ({ page, request }, use) => {
        // One stub backend serves the whole run and its state is mutable, so each test
        // starts from the seeded fixtures.
        await request.delete(`${API_URL}/__test__/state`);

        await page.route("**/thai-province-data/**", (route) => {
            const body = route.request().url().endsWith("province.json") ? PROVINCES : [];
            return route.fulfill({ json: body });
        });

        await use(page);
    },
});

/** Signs in through the real login form and waits for the app to settle on `landsOn`. */
export async function signIn(page: Page, landsOn: string | RegExp = "/"): Promise<void> {
    await page.goto("/login");
    await page.getByPlaceholder("Email").fill(USER.email);
    await page.getByPlaceholder("Password").fill(USER.password);
    await page.getByRole("button", { name: "Log in" }).click();
    await page.waitForURL(landsOn);
}

/**
 * A navigation row by label. Both the mobile navbar drawer and the desktop sidebar can
 * hold a row with the same text, so this keeps only the one actually on screen.
 */
export function navItem(page: Page, label: string) {
    return page.locator(`text="${label}"`).filter({ visible: true }).first();
}
