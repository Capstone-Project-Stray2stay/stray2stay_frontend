import { describe, expect, it } from "bun:test";
import { addMonths, buildMonthGrid, fromDateKey, toDateKey, visibleRange, weekOf } from "../src/utils/dateUtils";

describe("diary date utilities", () => {
    it("parses only real YYYY-MM-DD calendar dates, including leap day", () => {
        expect(toDateKey(fromDateKey("2024-02-29")!)).toBe("2024-02-29");
        expect(fromDateKey("2023-02-29")).toBeNull();
        expect(fromDateKey("2024-02-30")).toBeNull();
        expect(fromDateKey("2024-2-09")).toBeNull();
        expect(fromDateKey("2024-02-09T00:00:00")).toBeNull();
    });

    it("builds a Sunday-to-Saturday week across month boundaries", () => {
        const week = weekOf(new Date(2024, 2, 1));
        expect(week.map(toDateKey)).toEqual([
            "2024-02-25", "2024-02-26", "2024-02-27", "2024-02-28",
            "2024-02-29", "2024-03-01", "2024-03-02",
        ]);
    });

    it("pads leap-year February into complete seven-day calendar rows", () => {
        const grid = buildMonthGrid(2024, 1);
        expect(grid).toHaveLength(5);
        expect(grid.every((row) => row.length === 7)).toBe(true);
        const dates = grid.flat().filter((day): day is Date => day !== null);
        expect(dates).toHaveLength(29);
        expect(toDateKey(dates[0]!)).toBe("2024-02-01");
        expect(toDateKey(dates[28]!)).toBe("2024-02-29");
        expect(grid[0]!.slice(0, 4)).toEqual([null, null, null, null]);
        expect(grid[4]!.slice(5)).toEqual([null, null]);
    });

    it("pins month navigation to day one instead of overflowing month ends", () => {
        expect(toDateKey(addMonths(new Date(2024, 0, 31), 1))).toBe("2024-02-01");
        expect(toDateKey(addMonths(new Date(2024, 2, 31), -1))).toBe("2024-02-01");
    });

    it("fetches both the displayed month and the selected week's overhanging days", () => {
        const march = new Date(2024, 2, 15);
        expect(visibleRange(march, new Date(2024, 2, 31))).toEqual(["2024-03-01", "2024-04-06"]);
        expect(visibleRange(march, new Date(2024, 1, 25))).toEqual(["2024-02-25", "2024-03-31"]);
    });
});
