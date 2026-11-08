import { expect, test } from "./fixtures";

/** Every result card on the page, regardless of which grid rendered it. */
function cards(page: import("@playwright/test").Page) {
    return page.getByTestId("pet-card");
}

/** The Breed / Color / Gender comboboxes exist twice (desktop row + mobile drawer). */
function filterBox(page: import("@playwright/test").Page, placeholder: string) {
    return page.getByPlaceholder(placeholder).filter({ visible: true }).first();
}

test.describe("browsing and filtering pets", () => {
    // ST-ADOPT-01
    test("reaches the adopt page from the home hero and shows a full first page", async ({ page }) => {
        await page.goto("/");

        await page.getByRole("button", { name: "Adopt a Pet" }).click();

        await expect(page).toHaveURL("/adopt");
        await expect(page.getByRole("heading", { name: "Adopt a Pet" })).toBeVisible();
        // 20 seeded pets, 16 per page.
        await expect(cards(page)).toHaveCount(16);
    });

    // ST-ADOPT-02
    test("narrows results to one species when a category is chosen", async ({ page }) => {
        await page.goto("/adopt");
        await expect(cards(page)).toHaveCount(16);

        await page.getByText("Cat", { exact: true }).click();

        await expect(cards(page)).toHaveCount(5);
        // Dog breeds disappear from the results and from the breed options alike.
        await expect(page.locator('text="Shiba Inu"')).toHaveCount(0);

        await page.getByText("Dog", { exact: true }).click();
        await expect(cards(page)).toHaveCount(15);
    });

    // ST-ADOPT-03
    test("filters by breed through the combobox", async ({ page }) => {
        await page.goto("/adopt");
        await expect(cards(page)).toHaveCount(16);

        await filterBox(page, "Breed").fill("Corgi");
        await page.getByRole("option", { name: "Corgi" }).click();

        await expect(cards(page)).toHaveCount(3);
        await expect(page).toHaveURL("/adopt");
    });

    // ST-ADOPT-03
    test("searches by keyword and then restores everything with Clear", async ({ page }) => {
        await page.goto("/adopt");
        await expect(cards(page)).toHaveCount(16);

        await filterBox(page, "Search by keyword ( e.g. black, orange )").fill("Beagle");

        await expect(cards(page)).toHaveCount(3);

        await page.getByRole("button", { name: "Clear" }).click();

        await expect(cards(page)).toHaveCount(16);
    });

    // ST-ADOPT-04
    test("shows the empty state for a keyword nothing matches", async ({ page }) => {
        await page.goto("/adopt");
        await expect(cards(page)).toHaveCount(16);

        await filterBox(page, "Search by keyword ( e.g. black, orange )").fill("nonexistentbreed");

        await expect(page.getByText("No pets match these filters.")).toBeVisible();
        await expect(cards(page)).toHaveCount(0);
    });

    // ST-ADOPT-05
    test("pages through the results", async ({ page }) => {
        await page.goto("/adopt");
        await expect(cards(page)).toHaveCount(16);

        await page.getByRole("button", { name: "page 2" }).click();

        // 20 pets total, so the tail page holds the remaining 4.
        await expect(cards(page)).toHaveCount(4);

        await page.getByRole("button", { name: "page 1" }).click();
        await expect(cards(page)).toHaveCount(16);
    });

    // ST-ADOPT-05
    test("opens the pet profile for the card that was clicked", async ({ page }) => {
        await page.goto("/adopt");
        await expect(cards(page)).toHaveCount(16);

        await cards(page).nth(2).click();

        await expect(page).toHaveURL(/\/pet-profile\/\d+$/);
        await expect(page.getByRole("heading", { name: "Pet Profile" })).toBeVisible();
    });

    // ST-ADOPT-02
    test("resets the breed filter when the species changes", async ({ page }) => {
        await page.goto("/adopt");
        await filterBox(page, "Breed").fill("Corgi");
        await page.getByRole("option", { name: "Corgi" }).click();
        await expect(cards(page)).toHaveCount(3);

        await page.getByText("Cat", { exact: true }).click();

        // Switching species must drop a now-impossible dog breed, not return zero rows.
        await expect(cards(page)).toHaveCount(5);
        await expect(filterBox(page, "Breed")).toHaveValue("");
    });
});
