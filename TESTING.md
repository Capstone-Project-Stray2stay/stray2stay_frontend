# Frontend tests

Three layers, three commands.

| Layer | Runner | Lives in | What it proves |
| --- | --- | --- | --- |
| Unit | Vitest (node) | `tests/*.validator.test.ts`, `tests/dateUtils.test.ts` | Pure logic: Zod schemas, date helpers |
| Integration | Vitest (jsdom) | `tests/*.integration.test.tsx` | A page/component + react-query + the api modules + axios, against a real HTTP stub |
| End-to-end | Playwright (Chromium) | `e2e/*.spec.ts` | The built app in a real browser, real cookies, real navigation |

```bash
bun run test          # unit + integration
bun run test:e2e      # end-to-end (starts its own servers)
bun run test:all      # both
bun run test:e2e:ui   # Playwright's watch/inspector UI
```

## Integration layer

`tests/helpers/mockApi.ts` starts a throwaway `node:http` server on a random port and
points the app's axios instance at it with Node's HTTP adapter. Nothing is mocked above
that line — the component tree, the react-query hooks, the `services/apis/*` modules and
the axios instance all run unchanged, and requests really leave the process. So an
assertion about a query string or a payload is an assertion about what the Go backend
would receive.

Declare only the endpoints a test cares about; `sessionRoutes()` covers the calls the
shared chrome makes on every page (`/user/authorize`, `/user/status`, `/notifications`).

```ts
const api = await startMockApi({
  ...sessionRoutes({ authorized: true }),
  "GET /pets": { body: { petsInfo: [...], totalPages: 2 } },
  "PUT /notifications/:id/read": { body: {} },
});
// ...drive the UI...
expect(api.lastRequest("GET /pets")?.query).toEqual({ page: "2", pageSize: "16" });
```

Always `await api.close()` in `afterEach` — it shuts the server down and restores the
axios defaults.

Two things are stubbed at the module level rather than over HTTP, because they are not
ours: the Thai province dataset (a ~2MB file on raw.githubusercontent.com) and nothing
else.

## End-to-end layer

`playwright.config.ts` boots two servers before the specs run:

1. `e2e/mock-api/server.mjs` — a stub backend on `127.0.0.1:3100` speaking the same URLs
   and response envelopes as the Go service, with a real `HttpOnly` session cookie and
   CORS configured for the dev origin.
2. Vite on `127.0.0.1:5173`, with `VITE_API_URL` pointed at that stub. Inline `VITE_*`
   vars beat `.env`, so a developer's local backend is never touched.

State in the stub (sessions, notifications, registered emails) is mutable and shared, so
the suite runs with `workers: 1` and each test resets it through
`DELETE /api/__test__/state` (wired up in `e2e/fixtures.ts`).

Seeded data lives in `e2e/mock-api/data.mjs`: 20 pets (15 dogs / 5 cats, so the 16-per-page
grid spills onto a second page), pid 1 owned by the signed-in user, pid 2 already has a
pending request, pid 20 is adopted.

To run the specs against the real stack instead, start the Go backend and set
`E2E_API_PORT`/`VITE_API_URL` accordingly — the specs only assume the seeded data.

### Why not run the real backend in CI?

It would pull MySQL, MongoDB, Cloudinary and the AI service into every run. The stub keeps
e2e fast and deterministic while still exercising the parts e2e is for: routing, guards,
cookies, and the browser's own behaviour. Contract drift between the stub and the Go
service is caught by the backend's own tests plus the integration layer's envelope
assertions.

### Debugging a failing spec

```bash
MOCK_API_DEBUG=1 node e2e/mock-api/server.mjs   # request trace in one terminal
bunx playwright test e2e/notifications.spec.ts  # reuses the running server
bun run test:e2e:report                         # traces, screenshots, video of failures
```

Two traps worth knowing:

- The stub server is reused between local runs (`reuseExistingServer`). After editing
  `e2e/mock-api/data.mjs`, kill it — otherwise the next run still serves the old fixtures.
- Put per-test setup in a **fixture**, not a `test.beforeEach` in `e2e/fixtures.ts`. A
  module-level hook binds to whichever spec file loaded the module first, so every other
  file runs without it and fails in the full suite while passing on its own.

## Traceability to the test case register

Every test here carries the identifier of the documented case it belongs to, as a comment
directly above it:

```ts
// IT-FE-ADOPT-01
it("asks the backend for the first page and renders the returned pets", async () => {
```

Identifiers read `<level>-<component>-<module>-<nn>`: `UT` unit, `IT` integration, `ST`
system; `FE` frontend, `BE` Go backend. A case may be established by more than one test,
so the same identifier can appear above several `it(...)` blocks — the register's Coverage
column names the file.

The cases themselves live in `Stray2Stay_Test_Cases.xlsx` and
`Stray2Stay_Test_Design_Specification.docx` in the repository root. When you add, remove or
rename a test, update the matching case there so the two stay in step.
