import clsx, { type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function pad(n: number, size = 2) {
  return String(n).padStart(size, "0");
}

export function formatDate(value: Date | string | null | undefined) {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function parseList(value: FormDataEntryValue | null): string[] {
  if (!value) return [];
  return String(value)
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export const MODEL_CATEGORIES = ["Runway", "Editorial", "Commercial", "New Faces"] as const;
export const CAMPAIGN_CATEGORIES = [
  "Editorial",
  "Lookbook",
  "Runway",
  "Remote Production",
] as const;
export const APPLICATION_STATUSES = [
  "Pending Review",
  "Shortlisted",
  "Contacted",
  "Archived",
] as const;
export const INQUIRY_STATUSES = ["New", "In Discussion", "Confirmed", "Closed"] as const;
export const SERVICE_TYPES = [
  "Talent Booking",
  "Event Casting",
  "Turnkey Remote Production",
] as const;
