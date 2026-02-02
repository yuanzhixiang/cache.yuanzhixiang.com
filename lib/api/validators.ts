export function normalizeName(input: string) {
  return input.trim();
}

export function isValidName(name: string) {
  const len = name.length;
  return len >= 5 && len <= 15;
}

export function clampLimit(value: string | null, fallback = 25, max = 50) {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) return fallback;
  return Math.min(Math.max(parsed, 1), max);
}

export function parseSort(
  value: string | null,
  allowed: string[],
  fallback: string,
) {
  if (!value) return fallback;
  if (allowed.includes(value)) return value;
  return fallback;
}

export function stringOrNull(value: unknown) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

export function ensureMaxLength(value: string, max: number) {
  return value.length <= max;
}
