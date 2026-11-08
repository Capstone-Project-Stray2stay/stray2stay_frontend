import { once } from "node:events";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import axios from "axios";

import axiosInstance from "../../src/services/axios/axiosInstance";

/**
 * A real HTTP server standing in for the Go backend.
 *
 * Integration tests here deliberately avoid mocking axios: the component tree, the
 * react-query layer, the api modules and the axios instance all run unchanged, and the
 * request really leaves the process over TCP. Only the server on the far end is ours,
 * so every assertion about a URL, a query string or a payload is an assertion about
 * what the backend would actually receive.
 */

export interface RecordedRequest {
    method: string;
    /** Path with the `/api` mount point stripped, e.g. `/user/login`. */
    path: string;
    /** Parsed query string of the request. */
    query: Record<string, string>;
    /** Parsed JSON body, the raw string when it isn't JSON, or undefined when empty. */
    body: unknown;
}

export interface RouteReply {
    status?: number;
    body?: unknown;
}

export type RouteHandler = RouteReply | ((request: RecordedRequest) => RouteReply);

/**
 * Keyed by `"<METHOD> <path>"`, where a path segment may be a `:placeholder`
 * (`"PUT /notifications/:id/read"`). Exact matches win over placeholder ones.
 */
export type RouteTable = Record<string, RouteHandler>;

export interface MockApi {
    /** Every request the app has made so far, in order. */
    requests: RecordedRequest[];
    /** Requests matching a `"<METHOD> <path>"` key, placeholders included. */
    requestsFor(key: string): RecordedRequest[];
    /** The most recent request matching a `"<METHOD> <path>"` key. */
    lastRequest(key: string): RecordedRequest | undefined;
    /** Swap in a new route table mid-test, e.g. to make a retried call succeed. */
    setRoutes(routes: RouteTable): void;
    /** Shuts the server down and restores the axios instance. */
    close(): Promise<void>;
}

const API_MOUNT = "/api";

function pathMatches(pattern: string, path: string): boolean {
    if (pattern === path) return true;
    const patternSegments = pattern.split("/");
    const pathSegments = path.split("/");
    if (patternSegments.length !== pathSegments.length) return false;
    return patternSegments.every(
        (segment, i) => segment.startsWith(":") || segment === pathSegments[i],
    );
}

function findHandler(routes: RouteTable, request: RecordedRequest): RouteHandler | undefined {
    const exactKey = `${request.method} ${request.path}`;
    if (routes[exactKey]) return routes[exactKey];

    for (const [key, handler] of Object.entries(routes)) {
        const separator = key.indexOf(" ");
        const method = key.slice(0, separator);
        const pattern = key.slice(separator + 1);
        if (method === request.method && pathMatches(pattern, request.path)) return handler;
    }
    return undefined;
}

function parseBody(raw: string): unknown {
    if (raw === "") return undefined;
    try {
        return JSON.parse(raw);
    } catch {
        return raw;
    }
}

/**
 * Starts the stub backend and points the app's axios instance at it.
 *
 * Always pair with `await api.close()` in `afterEach` — it restores `baseURL` and the
 * adapter, so a leaked server can't make the next test talk to the wrong port.
 */
export async function startMockApi(initialRoutes: RouteTable = {}): Promise<MockApi> {
    let routes = initialRoutes;
    const requests: RecordedRequest[] = [];

    const server: Server = createServer((req, res) => {
        let raw = "";
        req.setEncoding("utf8");
        req.on("data", (chunk: string) => {
            raw += chunk;
        });
        req.on("end", () => {
            const url = new URL(req.url ?? "/", "http://127.0.0.1");
            const path = url.pathname.startsWith(API_MOUNT)
                ? url.pathname.slice(API_MOUNT.length) || "/"
                : url.pathname;

            const recorded: RecordedRequest = {
                method: req.method ?? "GET",
                path,
                query: Object.fromEntries(url.searchParams),
                body: parseBody(raw),
            };
            requests.push(recorded);

            const handler = findHandler(routes, recorded);
            const reply: RouteReply = handler
                ? typeof handler === "function"
                    ? handler(recorded)
                    : handler
                : { status: 404, body: { message: `No stub for ${recorded.method} ${path}` } };

            res.writeHead(reply.status ?? 200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(reply.body ?? {}));
        });
    });

    const listening = once(server, "listening");
    server.listen(0, "127.0.0.1");
    await listening;

    const { port } = server.address() as AddressInfo;
    const originalBaseURL = axiosInstance.defaults.baseURL;
    const originalAdapter = axiosInstance.defaults.adapter;
    axiosInstance.defaults.baseURL = `http://127.0.0.1:${port}${API_MOUNT}`;
    // jsdom's XHR can't reach a real socket, so use Node's transport and cross a real one.
    axiosInstance.defaults.adapter = axios.getAdapter("http");

    const matching = (key: string) => {
        const separator = key.indexOf(" ");
        const method = key.slice(0, separator);
        const pattern = key.slice(separator + 1);
        return requests.filter((r) => r.method === method && pathMatches(pattern, r.path));
    };

    return {
        requests,
        requestsFor: matching,
        lastRequest: (key) => matching(key).at(-1),
        setRoutes: (next) => {
            routes = next;
        },
        async close() {
            axiosInstance.defaults.baseURL = originalBaseURL;
            axiosInstance.defaults.adapter = originalAdapter;
            if (server.listening) {
                const closed = once(server, "close");
                server.close();
                await closed;
            }
        },
    };
}

/**
 * Routes the shared chrome asks for on every authenticated page (`S2SAvatar`,
 * `S2SNotificationCenter`, `NewUserRedirect`). Spread these into a page's own table so a
 * test only has to declare the endpoints it actually cares about.
 */
export function sessionRoutes(
    options: {
        authorized?: boolean;
        firstname?: string;
        newUser?: boolean;
        notifications?: unknown[];
        unreadCount?: number;
    } = {},
): RouteTable {
    const {
        authorized = false,
        firstname = "Ada",
        newUser = false,
        notifications = [],
        unreadCount = 0,
    } = options;

    return {
        "GET /user/authorize": authorized
            ? {
                body: {
                    authorized: true,
                    userFirstname: firstname,
                    userCoverImage: "https://cdn.example.test/ada.png",
                },
            }
            : { status: 401, body: { message: "Unauthorized" } },
        "GET /user/status": { body: { userData: newUser } },
        "GET /notifications": { body: { notifications, unreadCount } },
    };
}
