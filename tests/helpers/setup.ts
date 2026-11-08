/**
 * Loaded by vitest before every test file (see `vite.config.ts`).
 *
 * jsdom ships none of the layout APIs Chakra's responsive helpers reach for, so without
 * these a `useBreakpointValue` call or any component using Chakra's positioning engine
 * throws before the test gets to assert anything. Node-environment tests (the validator
 * suites) skip the whole block.
 */
if (typeof window !== "undefined") {
    if (!window.matchMedia) {
        window.matchMedia = (query: string) =>
            ({
                matches: false,
                media: query,
                onchange: null,
                addListener: () => {},
                removeListener: () => {},
                addEventListener: () => {},
                removeEventListener: () => {},
                dispatchEvent: () => false,
            }) as MediaQueryList;
    }

    if (!window.ResizeObserver) {
        window.ResizeObserver = class {
            observe() {}
            unobserve() {}
            disconnect() {}
        } as unknown as typeof ResizeObserver;
    }

    if (!window.scrollTo) {
        window.scrollTo = () => {};
    }
}
