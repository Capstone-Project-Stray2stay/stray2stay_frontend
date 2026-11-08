import { API_URL, expect, navItem, signIn, test, USER } from "./fixtures";

test.describe("authentication", () => {
    // ST-AUTH-01
    test("signs a known user in and swaps the nav over to the signed-in menu", async ({ page }) => {
        await page.goto("/login");

        await page.getByPlaceholder("Email").fill(USER.email);
        await page.getByPlaceholder("Password").fill(USER.password);
        await page.getByRole("button", { name: "Log in" }).click();

        await expect(page).toHaveURL("/");
        await expect(navItem(page, "Log Out")).toBeVisible();
        // Profile / Diary / Rehome are gated behind a session.
        await expect(navItem(page, "Profile")).toBeVisible();
        await expect(navItem(page, "Diary")).toBeVisible();
    });

    // ST-AUTH-01
    test("keeps the session across a full page reload", async ({ page }) => {
        await signIn(page);

        await page.reload();

        await expect(navItem(page, "Log Out")).toBeVisible();
    });

    // ST-AUTH-02
    test("rejects a wrong password without leaving the login page", async ({ page }) => {
        await page.goto("/login");

        await page.getByPlaceholder("Email").fill(USER.email);
        await page.getByPlaceholder("Password").fill("not-the-password");
        await page.getByRole("button", { name: "Log in" }).click();

        await expect(page.getByText("Invalid email or password")).toBeVisible();
        await expect(page).toHaveURL("/login");
    });

    // ST-AUTH-02
    test("catches an empty password before any request is sent", async ({ page }) => {
        const loginCalls: string[] = [];
        page.on("request", (request) => {
            if (request.url().includes("/user/login")) loginCalls.push(request.url());
        });

        await page.goto("/login");
        await page.getByPlaceholder("Email").fill(USER.email);
        await page.getByRole("button", { name: "Log in" }).click();

        await expect(page.getByText("Password is required")).toBeVisible();
        expect(loginCalls).toHaveLength(0);
    });

    // ST-AUTH-03
    test("signs out and hides the authenticated nav items again", async ({ page }) => {
        await signIn(page);

        await navItem(page, "Log Out").click();

        await expect(navItem(page, "Log In")).toBeVisible();
        await expect(page.locator('text="Profile"')).toHaveCount(0);
        // The cookie is gone, so a direct hit on a guarded page bounces.
        await page.goto("/profile");
        await expect(page).toHaveURL("/login");
    });

    // ST-AUTH-04
    test("sends a signed-out visitor from a guarded page to login and back again", async ({ page }) => {
        await page.goto("/diary");
        await expect(page).toHaveURL("/login");

        await page.getByPlaceholder("Email").fill(USER.email);
        await page.getByPlaceholder("Password").fill(USER.password);
        await page.getByRole("button", { name: "Log in" }).click();

        // The guard stashed the original destination, so login returns the user there.
        await expect(page).toHaveURL("/diary");
    });

    // ST-AUTH-05
    test("registers a new account and signs in with it", async ({ page }) => {
        await page.goto("/register");

        await page.getByPlaceholder("First name").fill("Grace");
        await page.getByPlaceholder("Last name").fill("Hopper");
        await page.getByPlaceholder("Email").fill("grace@example.com");
        await page.getByPlaceholder("Password", { exact: true }).fill("compiler1");
        await page.getByPlaceholder("Confirm password").fill("compiler1");
        await page.getByRole("button", { name: "Sign up" }).click();

        await expect(page).toHaveURL("/login");

        await page.getByPlaceholder("Email").fill("grace@example.com");
        await page.getByPlaceholder("Password").fill("compiler1");
        await page.getByRole("button", { name: "Log in" }).click();

        await expect(page).toHaveURL("/");
        await expect(navItem(page, "Log Out")).toBeVisible();
    });

    // ST-AUTH-06
    test("refuses to register an email that already exists", async ({ page, request }) => {
        await page.goto("/register");

        await page.getByPlaceholder("First name").fill("Ada");
        await page.getByPlaceholder("Last name").fill("Lovelace");
        await page.getByPlaceholder("Email").fill(USER.email);
        await page.getByPlaceholder("Password", { exact: true }).fill("password123");
        await page.getByPlaceholder("Confirm password").fill("password123");
        await page.getByRole("button", { name: "Sign up" }).click();

        await expect(page.getByText(/status code 409/i)).toBeVisible();
        await expect(page).toHaveURL("/register");

        // The duplicate must not have overwritten the original account.
        const login = await request.post(`${API_URL}/user/login`, {
            data: { email: USER.email, password: USER.password },
        });
        expect(login.status()).toBe(200);
    });

    // ST-AUTH-06
    test("stops a signup whose passwords disagree", async ({ page }) => {
        await page.goto("/register");

        await page.getByPlaceholder("First name").fill("Grace");
        await page.getByPlaceholder("Last name").fill("Hopper");
        await page.getByPlaceholder("Email").fill("mismatch@example.com");
        await page.getByPlaceholder("Password", { exact: true }).fill("compiler1");
        await page.getByPlaceholder("Confirm password").fill("compiler2");
        await page.getByRole("button", { name: "Sign up" }).click();

        await expect(page.getByText("Passwords do not match")).toBeVisible();
        await expect(page).toHaveURL("/register");
    });
});
