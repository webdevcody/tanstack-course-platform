import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function getTimeAgo(date: Date) {
  const now = new Date();
  const diffInSeconds = Math.floor((date.getTime() - now.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  const ranges = [
    { unit: "second", seconds: 60 },
    { unit: "minute", seconds: 60 * 60 },
    { unit: "hour", seconds: 60 * 60 * 24 },
    { unit: "day", seconds: 60 * 60 * 24 * 7 },
    { unit: "week", seconds: 60 * 60 * 24 * 30 },
    { unit: "month", seconds: 60 * 60 * 24 * 365 },
    { unit: "year", seconds: Infinity },
  ] as const;

  for (const range of ranges) {
    if (Math.abs(diffInSeconds) < range.seconds) {
      const value = Math.round(
        diffInSeconds / (range.seconds / (range.unit === "second" ? 1 : 60))
      );
      return rtf.format(value, range.unit);
    }
  }
}
