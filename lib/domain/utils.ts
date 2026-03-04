export function normalizeHost(input: string): string | null {
  const raw = String(input || "").trim();
  if (!raw) {
    return null;
  }

  const lower = raw.toLowerCase();
  const hasProtocol = /^[a-z][a-z\d+.-]*:\/\//.test(lower);

  try {
    const url = new URL(hasProtocol ? raw : `https://${raw}`);
    const host = (url.hostname || "").toLowerCase().replace(/\.$/, "");
    if (!host.includes(".")) {
      return null;
    }
    return host;
  } catch {
    return null;
  }
}

export function getApexDomain(host: string): string {
  const parts = host.split(".").filter(Boolean);
  if (parts.length <= 2) {
    return host;
  }

  // Pragmatic approach for current usage: keep the last 2 labels.
  return `${parts[parts.length - 2]}.${parts[parts.length - 1]}`;
}

export function parseDomainForWhois(host: string): { name: string; suffix: string } | null {
  const apex = getApexDomain(host);
  const parts = apex.split(".");
  if (parts.length < 2) {
    return null;
  }

  const suffix = parts[parts.length - 1];
  const name = parts[parts.length - 2];
  if (!name || !suffix) {
    return null;
  }

  return { name, suffix };
}

export function formatDatePrefix(rawDate: string | null | undefined): string | null {
  if (!rawDate) {
    return null;
  }

  const date = new Date(rawDate);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `(${date.getUTCFullYear()}.${month})`;
}

export function toMetricMonthDate(year: number, month: number): string | null {
  if (!Number.isInteger(year) || !Number.isInteger(month)) {
    return null;
  }
  if (month < 1 || month > 12) {
    return null;
  }

  const yyyy = String(year).padStart(4, "0");
  const mm = String(month).padStart(2, "0");
  return `${yyyy}-${mm}-01`;
}

export function dateToMonthKey(dateString: string): string {
  return dateString.slice(0, 7);
}

export function parseTtlMillis(value: string | undefined, fallback: number): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}

export function isFresh(timestamp: Date | null | undefined, ttlMs: number): boolean {
  if (!timestamp) {
    return false;
  }

  return Date.now() - timestamp.getTime() <= ttlMs;
}
