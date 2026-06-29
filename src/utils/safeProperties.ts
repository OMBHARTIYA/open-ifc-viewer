import type { PropertyRecord } from "../types/viewer";

export function safeProperties(value: unknown): PropertyRecord {
  if (!value || typeof value !== "object") {
    return {};
  }

  return Object.entries(value as Record<string, unknown>).reduce<PropertyRecord>((acc, [key, entry]) => {
    if (entry === null || typeof entry === "string" || typeof entry === "number" || typeof entry === "boolean") {
      acc[key] = entry;
      return acc;
    }

    if (typeof entry === "object" && entry && "value" in entry) {
      const nested = (entry as { value?: unknown }).value;
      if (nested === null || typeof nested === "string" || typeof nested === "number" || typeof nested === "boolean") {
        acc[key] = nested;
        return acc;
      }
    }

    acc[key] = String(entry);
    return acc;
  }, {});
}
