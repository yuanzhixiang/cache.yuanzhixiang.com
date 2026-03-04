import crypto from "node:crypto";
import { formatDatePrefix, parseDomainForWhois, toMetricMonthDate } from "./utils";
import type { AitdkFetchResult, TrafficMonthlyPoint, WhoisFetchResult } from "./types";

const AITDK_BASE_URL = "https://wapi.aitdk.com";
const AITDK_PATH = "/api/v1/serp";
const AITDK_SIGNATURE_KEY = "541737bb-02ce-4fb6-8157-3c7166873777";
const AITDK_CLIENT_VERSION = "1.0.0";
const WHOIS_BASE_URL = "https://whois.freeaiapi.xyz/";

function sha256Hex(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function createNonce(length = 16): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let nonce = "";
  for (let index = 0; index < length; index += 1) {
    nonce += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return nonce;
}

function normalizeQueryString(queryString: string): string {
  if (!queryString) {
    return "";
  }

  const source = new URLSearchParams(queryString);
  const normalized = new URLSearchParams();
  const keys = [...new Set(source.keys())].sort();

  for (const key of keys) {
    const values = source.getAll(key).sort();
    for (const value of values) {
      normalized.append(key, value);
    }
  }

  return normalized.toString();
}

function createAitdkSignature(input: {
  method: string;
  path: string;
  query: string;
  timestamp: string;
  nonce: string;
  secretKey: string;
}): string {
  const { method, path, query, timestamp, nonce, secretKey } = input;
  const parts = [method.toUpperCase(), path, normalizeQueryString(query), timestamp, nonce];
  const source = `${parts.join("\n")}\n${secretKey}`;
  return sha256Hex(source);
}

function extractMonthFromRecord(record: Record<string, unknown>): string | null {
  const yearCandidates = [record.year, record.y, record.trafficYear, record.Year];
  const monthCandidates = [record.month, record.m, record.trafficMonth, record.Month];

  for (const yearCandidate of yearCandidates) {
    const year = Number(yearCandidate);
    if (!Number.isFinite(year)) {
      continue;
    }

    for (const monthCandidate of monthCandidates) {
      const month = Number(monthCandidate);
      const metricMonth = toMetricMonthDate(year, month);
      if (metricMonth) {
        return metricMonth;
      }
    }
  }

  const dateCandidates = [record.date, record.time, record.label, record.monthKey];
  for (const candidate of dateCandidates) {
    const value = String(candidate ?? "");
    const match = /(\d{4})[-/](\d{1,2})/.exec(value);
    if (!match) {
      continue;
    }

    const metricMonth = toMetricMonthDate(Number(match[1]), Number(match[2]));
    if (metricMonth) {
      return metricMonth;
    }
  }

  return null;
}

function extractVisitsFromRecord(record: Record<string, unknown>): number | null {
  const candidates = [record.visits, record.value, record.traffic, record.monthlyVisits];
  for (const candidate of candidates) {
    const value = Number(candidate);
    if (Number.isFinite(value) && value >= 0) {
      return Math.round(value);
    }
  }

  return null;
}

function extractMonthlyTraffic(data: Record<string, unknown>): TrafficMonthlyPoint[] {
  const monthToVisits = new Map<string, number>();

  const addPoint = (metricMonth: string | null, visits: number | null) => {
    if (!metricMonth || visits === null) {
      return;
    }
    monthToVisits.set(metricMonth, visits);
  };

  const overview = (data.overview ?? null) as Record<string, unknown> | null;
  if (overview) {
    const metricMonth = toMetricMonthDate(Number(overview.year), Number(overview.month));
    const visits = Number(overview.visits);
    addPoint(metricMonth, Number.isFinite(visits) && visits >= 0 ? Math.round(visits) : null);
  }

  const arrayCandidates = [
    data.visitsOverTime,
    data.visits_over_time,
    data.trend,
    data.chart,
    data.chartData,
    overview?.visitsOverTime,
    overview?.trend,
  ];

  for (const candidate of arrayCandidates) {
    if (!Array.isArray(candidate)) {
      continue;
    }

    for (const item of candidate) {
      if (!item || typeof item !== "object") {
        continue;
      }

      const record = item as Record<string, unknown>;
      addPoint(extractMonthFromRecord(record), extractVisitsFromRecord(record));
    }
  }

  return [...monthToVisits.entries()]
    .map(([metricMonth, visits]) => ({ metricMonth, visits }))
    .sort((left, right) => right.metricMonth.localeCompare(left.metricMonth));
}

export async function fetchAitdkData(domain: string): Promise<AitdkFetchResult> {
  const timestamp = String(Math.floor(Date.now() / 1000));
  const nonce = createNonce();
  const baseParams = new URLSearchParams({
    domain,
    version: AITDK_CLIENT_VERSION,
  });

  const signature = createAitdkSignature({
    method: "GET",
    path: AITDK_PATH,
    query: baseParams.toString(),
    timestamp,
    nonce,
    secretKey: AITDK_SIGNATURE_KEY,
  });

  const params = new URLSearchParams(baseParams.toString());
  params.set("timestamp", timestamp);
  params.set("nonce", nonce);
  params.set("signature", signature);

  const url = `${AITDK_BASE_URL}${AITDK_PATH}?${params.toString()}`;

  try {
    const response = await fetch(url);
    const payloadText = await response.text();

    if (!response.ok) {
      return {
        success: false,
        httpStatus: response.status,
        errorCode: `aitdk_http_${response.status}`,
        errorMessage: `AITDK request failed with status ${response.status}`,
        rawPayload: payloadText,
        registrationDate: null,
        registrationPrefix: null,
        monthlyTraffic: [],
      };
    }

    const lines = payloadText.split(/\r?\n/);
    let currentEvent = "";
    let registrationDate: string | null = null;
    const monthToVisits = new Map<string, number>();

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) {
        continue;
      }

      if (line.startsWith("event:")) {
        currentEvent = line.slice(6).trim();
        continue;
      }

      if (!line.startsWith("data:")) {
        continue;
      }

      const jsonText = line.slice(5).trim();
      if (!jsonText) {
        continue;
      }

      try {
        const packet = JSON.parse(jsonText) as {
          domain?: string;
          data?: Record<string, unknown>;
        };

        if (packet.domain !== domain) {
          continue;
        }

        if (currentEvent === "whois") {
          const events = Array.isArray(packet.data?.events)
            ? (packet.data?.events as Array<{ eventAction?: string; eventDate?: string }>)
            : [];

          const creationEvent = events.find((event) => {
            const action = String(event.eventAction ?? "").toLowerCase();
            return action.includes("registration") || action.includes("creation");
          });

          if (creationEvent?.eventDate) {
            registrationDate = creationEvent.eventDate;
          }
          continue;
        }

        if (currentEvent !== "traffic") {
          continue;
        }

        const trafficPoints = extractMonthlyTraffic(packet.data ?? {});
        for (const point of trafficPoints) {
          monthToVisits.set(point.metricMonth, point.visits);
        }
      } catch {
        // ignore malformed packets
      }
    }

    const monthlyTraffic = [...monthToVisits.entries()]
      .map(([metricMonth, visits]) => ({ metricMonth, visits }))
      .sort((left, right) => right.metricMonth.localeCompare(left.metricMonth));

    return {
      success: true,
      httpStatus: response.status,
      errorCode: null,
      errorMessage: null,
      rawPayload: payloadText,
      registrationDate,
      registrationPrefix: formatDatePrefix(registrationDate),
      monthlyTraffic,
    };
  } catch (error) {
    return {
      success: false,
      httpStatus: null,
      errorCode: "aitdk_network_error",
      errorMessage: error instanceof Error ? error.message : String(error),
      rawPayload: null,
      registrationDate: null,
      registrationPrefix: null,
      monthlyTraffic: [],
    };
  }
}

export async function fetchWhoisDate(domain: string): Promise<WhoisFetchResult> {
  const parsed = parseDomainForWhois(domain);
  if (!parsed) {
    return {
      success: false,
      httpStatus: null,
      errorCode: "whois_invalid_domain",
      errorMessage: "Invalid domain for whois lookup",
      rawPayload: null,
      registrationDate: null,
      registrationPrefix: null,
    };
  }

  const params = new URLSearchParams({
    name: parsed.name,
    suffix: parsed.suffix,
    c: "1",
  });

  try {
    const response = await fetch(`${WHOIS_BASE_URL}?${params.toString()}`);
    const text = await response.text();

    let payload: { status?: string; creation_datetime?: string; msg?: string } | null = null;
    try {
      payload = JSON.parse(text) as { status?: string; creation_datetime?: string; msg?: string };
    } catch {
      payload = null;
    }

    if (!response.ok) {
      return {
        success: false,
        httpStatus: response.status,
        errorCode: `whois_http_${response.status}`,
        errorMessage: payload?.msg ?? `Whois request failed with status ${response.status}`,
        rawPayload: payload ?? text,
        registrationDate: null,
        registrationPrefix: null,
      };
    }

    if (!payload || payload.status !== "ok") {
      return {
        success: false,
        httpStatus: response.status,
        errorCode: "whois_not_ok",
        errorMessage: payload?.msg ?? payload?.status ?? "whois response is not ok",
        rawPayload: payload ?? text,
        registrationDate: null,
        registrationPrefix: null,
      };
    }

    return {
      success: true,
      httpStatus: response.status,
      errorCode: null,
      errorMessage: null,
      rawPayload: payload,
      registrationDate: payload.creation_datetime ?? null,
      registrationPrefix: formatDatePrefix(payload.creation_datetime),
    };
  } catch (error) {
    return {
      success: false,
      httpStatus: null,
      errorCode: "whois_network_error",
      errorMessage: error instanceof Error ? error.message : String(error),
      rawPayload: null,
      registrationDate: null,
      registrationPrefix: null,
    };
  }
}
