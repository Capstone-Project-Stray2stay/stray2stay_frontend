export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const MONTHS_SHORT = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export const MONTHS_LONG = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

export function toDateKey(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${date.getFullYear()}-${month}-${day}`;
}

export function isSameDay(a: Date, b: Date): boolean {
    return toDateKey(a) === toDateKey(b);
}

/** The Sunday-to-Saturday week containing `date`. */
export function weekOf(date: Date): Date[] {
    const sunday = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay());
    return Array.from(
        { length: 7 },
        (_, i) => new Date(sunday.getFullYear(), sunday.getMonth(), sunday.getDate() + i),
    );
}

/**
 * The month laid out as whole Sun-Sat rows, with nulls padding the days before
 * the 1st and after the last. Rows rather than a flat list so the calendar can
 * paint a highlight band behind the selected week.
 */
export function buildMonthGrid(year: number, month: number): (Date | null)[][] {
    const leading = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: (Date | null)[] = [
        ...Array.from({ length: leading }, () => null),
        ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
    ];
    while (cells.length % 7 !== 0) cells.push(null);

    return Array.from({ length: cells.length / 7 }, (_, i) => cells.slice(i * 7, i * 7 + 7));
}

/** Same month, shifted by `delta`. Day is pinned to 1 so month-ends don't skip. */
export function addMonths(date: Date, delta: number): Date {
    return new Date(date.getFullYear(), date.getMonth() + delta, 1);
}

/** Midnight today, for comparing calendar days without the clock getting in. */
export function today(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

/** Parses a YYYY-MM-DD key back into a local Date. Invalid input gives null. */
export function fromDateKey(key: string): Date | null {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key);
    if (!match) return null;

    const [, year, month, day] = match;
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    // Rejects keys like 2026-02-31, which Date would silently roll forward.
    return toDateKey(date) === key ? date : null;
}

/**
 * The span of days the page can currently show, as [from, to] date keys. The
 * week strip can reach into the neighbouring month, so the range has to cover
 * the visible month *and* the selected week — fetching only the month would
 * leave the strip's overhanging days looking empty.
 */
export function visibleRange(viewMonth: Date, selectedDate: Date): [string, string] {
    const week = weekOf(selectedDate);
    const times = [
        new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1),
        new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0),
        week[0],
        week[6],
    ].map((date) => date.getTime());

    return [
        toDateKey(new Date(Math.min(...times))),
        toDateKey(new Date(Math.max(...times))),
    ];
}
