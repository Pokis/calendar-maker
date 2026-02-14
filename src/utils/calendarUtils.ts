import type { Language, MonthData } from '../types';
import { t } from '../translations';

/**
 * Get the day of week for a given date (0=Mon, 6=Sun)
 */
function getDayOfWeekMon(date: Date): number {
    const day = date.getDay(); // 0=Sun, 1=Mon...6=Sat
    return day === 0 ? 6 : day - 1;
}

/**
 * Get the number of days in a month
 */
function getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
}

/**
 * Build the weeks grid for a month.
 * Each week is an array of 7 elements (Mon-Sun).
 * null means an empty cell.
 */
function buildWeeks(year: number, month: number): (number | null)[][] {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getDayOfWeekMon(new Date(year, month, 1));

    const weeks: (number | null)[][] = [];
    let currentWeek: (number | null)[] = new Array(7).fill(null);
    let dayCounter = 1;

    // Fill first week
    for (let i = firstDay; i < 7 && dayCounter <= daysInMonth; i++) {
        currentWeek[i] = dayCounter++;
    }
    weeks.push(currentWeek);

    // Fill remaining weeks
    while (dayCounter <= daysInMonth) {
        currentWeek = new Array(7).fill(null);
        for (let i = 0; i < 7 && dayCounter <= daysInMonth; i++) {
            currentWeek[i] = dayCounter++;
        }
        weeks.push(currentWeek);
    }
    // Pad to exactly 6 rows so all months have the same grid height
    while (weeks.length < 6) {
        weeks.push(new Array(7).fill(null));
    }

    return weeks;
}

/**
 * Get all data needed to render a single month.
 */
export function getMonthData(year: number, monthIndex: number, language: Language): MonthData {
    const trans = t(language);
    return {
        monthIndex,
        name: trans.months[monthIndex],
        year,
        weeks: buildWeeks(year, monthIndex),
        dayNames: trans.daysShort,
    };
}

/**
 * Get all 12 months data for a year.
 */
export function getYearData(year: number, language: Language): MonthData[] {
    return Array.from({ length: 12 }, (_, i) => getMonthData(year, i, language));
}
