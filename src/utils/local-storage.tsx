const LAST_WATCHED_SEGMENT_KEY = "lastWatchedSegment";

export function setLastWatchedSegment(slug: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(LAST_WATCHED_SEGMENT_KEY, slug);
  }
}

export function getLastWatchedSegment(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(LAST_WATCHED_SEGMENT_KEY);
  }
  return null;
}
