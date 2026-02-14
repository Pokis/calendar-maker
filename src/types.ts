export type Language = 'en' | 'lt';

export interface CalendarProject {
  year: number;
  language: Language;
  monthImages: Record<number, string>; // month (0-11) -> base64 data URL
}

export interface MonthData {
  monthIndex: number; // 0-11
  name: string;
  year: number;
  weeks: (number | null)[][]; // rows of 7 days (Mon-Sun), null = empty cell
  dayNames: string[];
}
