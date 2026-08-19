export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const MONTHS_SHORT = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export const MONTHS_LONG = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

/**
 * Stable per-day key. Built from the local getters rather than toISOString,
 * which converts to UTC first — at UTC+7 that lands the early hours of a day on
 * the previous date and files entries under the wrong day.
 */
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
