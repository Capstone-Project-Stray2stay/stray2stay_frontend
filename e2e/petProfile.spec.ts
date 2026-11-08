import { expect, signIn, test, USER } from "./fixtures";

// Seeded by the stub backend: pid 1 belongs to the signed-in user, pid 2 already has a
// pending request from them, and pid 20 has been adopted.
const OWNED_PID = 1;
const PENDING_PID = 2;
const ADOPTED_PID = 20;
const OPEN_PID = 3;

test.describe("pet profile", () => {
    // ST-PET-01
    test("renders the pet's details from the backend", async ({ page }) => {
        await page.goto(`/pet-profile/${OPEN_PID}`);

        await expect(page.getByRole("heading", { name: "Pet Profile" })).toBeVisible();
        await expect(page.getByText("Pet 3", { exact: true })).toBeVisible();
        await expect(page.getByText("Notes for Pet 3.")).toBeVisible();
    });

    // ST-PET-02
    test("sends an anonymous visitor to log in and returns them to the pet afterwards", async ({ page }) => {
        await page.goto(`/pet-profile/${OPEN_PID}`);

        await page.getByRole("button", { name: /Adopt this pet/ }).click();

        await expect(page).toHaveURL("/login");

        await page.getByPlaceholder("Email").fill(USER.email);
        await page.getByPlaceholder("Password").fill(USER.password);
        await page.getByRole("button", { name: "Log in" }).click();

        await expect(page).toHaveURL(`/pet-profile/${OPEN_PID}`);
        await expect(page.getByRole("button", { name: /Adopt this pet/ })).toBeVisible();
    });

    // ST-PET-03
    test("offers owner tools rather than an adopt button on the user's own pet", async ({ page }) => {
        await signIn(page);
        await page.goto(`/pet-profile/${OWNED_PID}`);

        await expect(page.getByRole("button", { name: /Edit Pet Profile/ })).toBeVisible();
        await expect(page.getByRole("button", { name: /Adopt this pet/ })).toHaveCount(0);

        await page.getByRole("button", { name: /Edit Pet Profile/ }).click();
        await expect(page).toHaveURL(`/rehome/${OWNED_PID}/edit`);
    });

    // ST-PET-04
    test("shows pending approval instead of letting the user apply twice", async ({ page }) => {
        await signIn(page);
        await page.goto(`/pet-profile/${PENDING_PID}`);

        await expect(page.getByRole("button", { name: /Pending Approval/ })).toBeVisible();
        await expect(page.getByRole("button", { name: /Adopt this pet/ })).toHaveCount(0);
    });

    // ST-PET-04
    test("closes off adoption once a pet is marked adopted", async ({ page }) => {
        await signIn(page);
        await page.goto(`/pet-profile/${ADOPTED_PID}`);

        await expect(page.getByText("This pet has already been adopted.")).toBeVisible();
        await expect(page.getByRole("button", { name: /Adopt this pet/ })).toHaveCount(0);
    });

    // ST-PET-06
    test("shows the not-found state for an unknown pet id", async ({ page }) => {
        await page.goto("/pet-profile/9999");

        await expect(page.getByText("Pet not found.")).toBeVisible();
    });

    // ST-PET-05
    test("opens the screening form when a signed-in user starts an adoption", async ({ page }) => {
        await signIn(page);
        await page.goto(`/pet-profile/${OPEN_PID}`);

        await page.getByRole("button", { name: /Adopt this pet/ }).click();

        // The multi-step screening dialog takes over rather than submitting immediately.
        await expect(page.getByRole("dialog")).toBeVisible();
    });

    // ST-PET-06
    test("renders the 404 page for an unknown route and walks back home", async ({ page }) => {
        await page.goto("/this-route-does-not-exist");

        await expect(page.getByRole("heading", { name: "404" })).toBeVisible();
        await expect(page.getByRole("heading", { name: "Page Not Found" })).toBeVisible();

        await page.getByRole("button", { name: "Go back home" }).click();
        await expect(page).toHaveURL("/");
    });
});
