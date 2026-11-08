import { expect, signIn, test } from "./fixtures";

const BELL = { name: "Notifications" };
const MARK_ALL = { name: "Mark all notifications as read" };

test.describe("notification centre", () => {
    // ST-NOTIF-01
    test("stays hidden for a signed-out visitor", async ({ page }) => {
        await page.goto("/adopt");

        await expect(page.getByRole("heading", { name: "Adopt a Pet" })).toBeVisible();
        await expect(page.getByRole("button", BELL)).toHaveCount(0);
    });

    // ST-NOTIF-02
    test("shows the signed-in user and their unread count", async ({ page }) => {
        await signIn(page);
        await page.goto("/adopt");

        await expect(page.getByText("Ada", { exact: true })).toBeVisible();
        // Two unread notifications are seeded.
        await expect(page.getByText("2", { exact: true }).first()).toBeVisible();
        await expect(page.getByRole("button", BELL)).toBeVisible();
    });

    // ST-NOTIF-02
    test("lists the notifications when the bell is opened", async ({ page }) => {
        await signIn(page);
        await page.goto("/adopt");

        await page.getByRole("button", BELL).click();

        await expect(page.getByText("New adoption request")).toBeVisible();
        await expect(page.getByText("You were selected")).toBeVisible();
    });

    // ST-NOTIF-03
    test("opens the rehoming tab for the pet a request came in on", async ({ page }) => {
        await signIn(page);
        await page.goto("/adopt");

        await page.getByRole("button", BELL).click();
        await page.getByText("New adoption request").click();

        await expect(page).toHaveURL("/profile?tab=rehoming&pet=1");
    });

    // ST-NOTIF-03
    test("opens the adoptions tab for an adopter-facing notification", async ({ page }) => {
        await signIn(page);
        await page.goto("/adopt");

        await page.getByRole("button", BELL).click();
        await page.getByText("You were selected").click();

        await expect(page).toHaveURL("/profile?tab=adoptions&pet=2");
    });

    // ST-NOTIF-04
    test("clears the badge after marking everything read", async ({ page }) => {
        await signIn(page);
        await page.goto("/adopt");

        await page.getByRole("button", BELL).click();
        await expect(page.getByRole("button", MARK_ALL)).toBeVisible();

        await page.getByRole("button", MARK_ALL).click();

        // The button only exists while something is unread, so its disappearance is the
        // refetched, server-confirmed state.
        await expect(page.getByRole("button", MARK_ALL)).toHaveCount(0);
    });

    // ST-NOTIF-04
    test("keeps an item read after a reload", async ({ page }) => {
        await signIn(page);
        await page.goto("/adopt");

        await page.getByRole("button", BELL).click();
        await page.getByText("New adoption request").click();
        await expect(page).toHaveURL(/\/profile\?/);

        await page.goto("/adopt");
        await page.getByRole("button", BELL).click();

        // One of the two was marked read, so the remaining unread count is 1.
        await expect(page.getByRole("button", MARK_ALL)).toBeVisible();
        await expect(page.getByText("1", { exact: true }).first()).toBeVisible();
    });
});
