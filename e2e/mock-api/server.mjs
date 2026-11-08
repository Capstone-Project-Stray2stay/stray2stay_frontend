/**
 * Stub backend for the Playwright suite.
 *
 * The e2e specs drive the real built frontend in a real browser, so something has to
 * answer the XHRs. Running the Go service would drag MySQL, MongoDB, Cloudinary and the
 * AI service into every test run; this stands in for it with the same URLs, the same
 * response envelopes and a real session cookie, and nothing else. Swap it out by pointing
 * `VITE_API_URL` at a live backend — no spec changes needed beyond the seeded data.
 */
import { createServer } from "node:http";

import { ADOPTED_PID, BREEDS, NOTIFICATIONS, PETS, USER, petDetail } from "./data.mjs";

const PORT = Number(process.env.MOCK_API_PORT ?? 3100);
const ORIGIN = process.env.MOCK_API_ORIGIN ?? "http://127.0.0.1:5173";
const SESSION_COOKIE = "s2s_e2e_session";

/** Reset between specs via DELETE /__test__/state so one run can't bleed into the next. */
let notifications = NOTIFICATIONS.map((n) => ({ ...n }));
let registeredUsers = [{ ...USER }];
let newUserEmails = new Set();

function cors(res) {
    // Credentials mode forbids the `*` wildcard, and the app sets withCredentials.
    res.setHeader("Access-Control-Allow-Origin", ORIGIN);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
}

function send(res, status, body, headers = {}) {
    cors(res);
    for (const [key, value] of Object.entries(headers)) res.setHeader(key, value);
    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(JSON.stringify(body ?? {}));
}

function hasSession(req) {
    return (req.headers.cookie ?? "").split(";").some((c) => c.trim().startsWith(`${SESSION_COOKIE}=`));
}

function sessionEmail(req) {
    const cookie = (req.headers.cookie ?? "")
        .split(";")
        .map((c) => c.trim())
        .find((c) => c.startsWith(`${SESSION_COOKIE}=`));
    return cookie ? decodeURIComponent(cookie.slice(SESSION_COOKIE.length + 1)) : undefined;
}

function setSession(email) {
    // SameSite=Lax is enough: the app and this server share the 127.0.0.1 site.
    return { "Set-Cookie": `${SESSION_COOKIE}=${encodeURIComponent(email)}; Path=/; HttpOnly; SameSite=Lax` };
}

function clearSession() {
    return { "Set-Cookie": `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0` };
}

function unauthorized(res) {
    send(res, 401, { message: "Unauthorized" });
}

function searchPets(query) {
    const page = Number(query.get("page") ?? 1);
    const pageSize = Number(query.get("pageSize") ?? 16);
    const keyword = (query.get("keyword") ?? "").toLowerCase();

    const filtered = PETS.filter((pet) => {
        if (query.get("petType") && pet.petType !== query.get("petType")) return false;
        if (query.get("petBreed") && pet.petBreed !== query.get("petBreed")) return false;
        if (query.get("petColor") && pet.petColor !== query.get("petColor")) return false;
        if (query.get("petGender") && pet.petGender !== query.get("petGender")) return false;
        if (query.get("petAgeGroup") && pet.petAgeGroup !== query.get("petAgeGroup")) return false;
        if (query.get("petLocation") && !pet.petAddress.includes(query.get("petLocation"))) return false;
        if (keyword) {
            const haystack = `${pet.petName} ${pet.petBreed} ${pet.petColor} ${pet.petAddress}`.toLowerCase();
            if (!haystack.includes(keyword)) return false;
        }
        return true;
    });

    return {
        petsInfo: filtered.slice((page - 1) * pageSize, page * pageSize),
        totalCount: filtered.length,
        totalPages: Math.max(1, Math.ceil(filtered.length / pageSize)),
    };
}

function handle(req, res, url, body) {
    const path = url.pathname.replace(/^\/api/, "");
    const method = req.method ?? "GET";
    const route = `${method} ${path}`;

    // --- test-only control plane -------------------------------------------------
    // MOCK_API_DEBUG=1 prints a request trace — the quickest way to tell a UI bug from
    // a test that leaked state into the next one.
    if (process.env.MOCK_API_DEBUG) console.log("[api]", new Date().toISOString(), route);
    if (route === "DELETE /__test__/state") {
        notifications = NOTIFICATIONS.map((n) => ({ ...n }));
        registeredUsers = [{ ...USER }];
        newUserEmails = new Set();
        return send(res, 200, { reset: true });
    }
    if (route === "POST /__test__/new-user") {
        newUserEmails.add(body?.email);
        return send(res, 200, { ok: true });
    }

    // --- auth --------------------------------------------------------------------
    if (route === "POST /user/login") {
        const match = registeredUsers.find(
            (u) => u.email === body?.email && u.password === body?.password,
        );
        if (!match) return send(res, 401, { error: "Invalid credentials" });
        return send(res, 200, { message: "Login successful" }, setSession(match.email));
    }

    if (route === "POST /user/register") {
        if (registeredUsers.some((u) => u.email === body?.email)) {
            return send(res, 409, { error: "Email already registered" });
        }
        registeredUsers.push({
            email: body.email,
            password: body.password,
            firstname: body.firstname,
            lastname: body.lastname,
        });
        return send(res, 200, { message: "Registered" });
    }

    if (route === "POST /user/logout") {
        return send(res, 200, { message: "Logged out" }, clearSession());
    }

    if (route === "GET /user/authorize") {
        if (!hasSession(req)) return unauthorized(res);
        const user = registeredUsers.find((u) => u.email === sessionEmail(req));
        return send(res, 200, {
            authorized: true,
            userFirstname: user?.firstname ?? "Ada",
            userCoverImage: "/favicon.png",
        });
    }

    if (route === "GET /user/status") {
        if (!hasSession(req)) return unauthorized(res);
        return send(res, 200, { userData: newUserEmails.has(sessionEmail(req)) });
    }

    if (route === "GET /user/info") {
        if (!hasSession(req)) return unauthorized(res);
        const user = registeredUsers.find((u) => u.email === sessionEmail(req));
        return send(res, 200, {
            userData: {
                Firstname: user?.firstname ?? "Ada",
                Lastname: user?.lastname ?? "Lovelace",
                Phone: "0812345678",
                Address: "12 Soi 3, Bang Mod, Thung Khru, Bangkok",
                CoverImage: "/favicon.png",
                Preferences: null,
            },
        });
    }

    if (route === "PUT /user/status") {
        if (!hasSession(req)) return unauthorized(res);
        newUserEmails.delete(sessionEmail(req));
        return send(res, 200, { message: "Updated" });
    }

    // --- notifications -----------------------------------------------------------
    if (route === "GET /notifications") {
        if (!hasSession(req)) return unauthorized(res);
        return send(res, 200, {
            notifications,
            unreadCount: notifications.filter((n) => !n.isRead).length,
        });
    }

    if (method === "PUT" && /^\/notifications\/\d+\/read$/.test(path)) {
        if (!hasSession(req)) return unauthorized(res);
        const id = Number(path.split("/")[2]);
        notifications = notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
        return send(res, 200, { message: "Marked" });
    }

    if (route === "PUT /notifications/read-all") {
        if (!hasSession(req)) return unauthorized(res);
        notifications = notifications.map((n) => ({ ...n, isRead: true }));
        return send(res, 200, { message: "Marked" });
    }

    // --- pets --------------------------------------------------------------------
    if (route === "GET /pets/random") {
        return send(res, 200, { petsInfo: PETS.slice(0, 8) });
    }

    if (route === "GET /pets/breeds") {
        return send(res, 200, { breedData: BREEDS[url.searchParams.get("petType")] ?? [] });
    }

    if (route === "GET /pets/breeds/images") {
        const breeds = BREEDS[url.searchParams.get("petType")] ?? [];
        return send(res, 200, {
            imageData: breeds.map((breed) => ({ breed, image: "/favicon.png" })),
        });
    }

    if (route === "GET /pets/breed/color") {
        // Capitalised keys: domain.PetColorResponse declares bson tags only, so Fiber
        // marshals the Go field names and the frontend reads `Color` / `Image`.
        return send(res, 200, {
            colorData: [
                { Color: "Cream", Image: "/favicon.png" },
                { Color: "Black", Image: "/favicon.png" },
            ],
        });
    }

    if (route === "GET /pets") {
        return send(res, 200, searchPets(url.searchParams));
    }

    if (route === "GET /pets/mine") {
        if (!hasSession(req)) return unauthorized(res);
        return send(res, 200, { petsInfo: [] });
    }

    if (route === "GET /pets/mine/adoptors") {
        if (!hasSession(req)) return unauthorized(res);
        return send(res, 200, { adoptors: [] });
    }

    if (route === "GET /pets/mine/adoptions") {
        if (!hasSession(req)) return unauthorized(res);
        return send(res, 200, { adoptionRequests: [] });
    }

    if (method === "GET" && /^\/pets\/\d+$/.test(path)) {
        const pid = Number(path.split("/")[2]);
        const pet = petDetail(pid);
        if (!pet) return send(res, 404, { error: "pet not found" });
        return send(res, 200, {
            petsInfo: pet,
            // pid 1 belongs to the signed-in user so owner-only UI is reachable.
            isOwner: hasSession(req) && pid === 1,
            adoptionStatus: pid === 2 ? "PENDING" : "",
        });
    }

    if (method === "GET" && /^\/pets\/\d+\/screening-questions$/.test(path)) {
        return send(res, 200, { questions: [], locked: false });
    }

    if (method === "POST" && /^\/pets\/\d+\/adopt$/.test(path)) {
        if (!hasSession(req)) return unauthorized(res);
        const pid = Number(path.split("/")[2]);
        if (pid === ADOPTED_PID) return send(res, 409, { error: "pet already adopted" });
        return send(res, 200, { message: "Adoption request submitted" });
    }

    return send(res, 404, { error: `No stub route for ${route}` });
}

const server = createServer((req, res) => {
    if (req.method === "OPTIONS") {
        cors(res);
        res.writeHead(204);
        return res.end();
    }

    let raw = "";
    req.setEncoding("utf8");
    req.on("data", (chunk) => {
        raw += chunk;
    });
    req.on("end", () => {
        let body;
        try {
            body = raw ? JSON.parse(raw) : undefined;
        } catch {
            body = raw;
        }
        const url = new URL(req.url ?? "/", `http://127.0.0.1:${PORT}`);
        try {
            handle(req, res, url, body);
        } catch (err) {
            send(res, 500, { error: String(err) });
        }
    });
});

server.listen(PORT, "127.0.0.1", () => {
    console.log(`[mock-api] listening on http://127.0.0.1:${PORT}/api (origin ${ORIGIN})`);
});
