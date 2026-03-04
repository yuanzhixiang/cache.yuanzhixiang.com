import {
  getDomainSnapshot,
  insertSyncLog,
  upsertDomainProfile,
  upsertTrafficSeries,
} from "./repository";
import { fetchAitdkData, fetchWhoisDate } from "./providers";
import type {
  DomainProfileOutput,
  ProviderStatus,
  RegistrationSource,
  ResolveDomainOptions,
  TrafficSource,
} from "./types";
import {
  dateToMonthKey,
  getApexDomain,
  isFresh,
  normalizeHost,
  parseTtlMillis,
} from "./utils";

const DEFAULT_TRAFFIC_TTL_MS = 24 * 60 * 60 * 1000;
const DEFAULT_REGISTRATION_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const DEFAULT_NEGATIVE_TTL_MS = 60 * 60 * 1000;

const TRAFFIC_TTL_MS = parseTtlMillis(process.env.DOMAIN_TRAFFIC_TTL_MS, DEFAULT_TRAFFIC_TTL_MS);
const REGISTRATION_TTL_MS = parseTtlMillis(
  process.env.DOMAIN_REGISTRATION_TTL_MS,
  DEFAULT_REGISTRATION_TTL_MS,
);
const NEGATIVE_TTL_MS = parseTtlMillis(
  process.env.DOMAIN_NEGATIVE_TTL_MS,
  DEFAULT_NEGATIVE_TTL_MS,
);

function trimExcerpt(value: string | null | undefined, limit = 1200): string | null {
  if (!value) {
    return null;
  }
  return value.length > limit ? `${value.slice(0, limit)}...` : value;
}

function toDateOnly(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function buildProviderStatus(provider: ProviderStatus["provider"]): ProviderStatus {
  return {
    provider,
    success: true,
    httpStatus: null,
    errorCode: null,
    errorMessage: null,
  };
}

function mapOutput(input: {
  domain: string;
  apexDomain: string;
  snapshot: Awaited<ReturnType<typeof getDomainSnapshot>>;
  cacheHit: boolean;
  stale: boolean;
  negative: boolean;
  refreshed: boolean;
  aitdkStatus: ProviderStatus;
  whoisStatus: ProviderStatus;
}): DomainProfileOutput {
  const { domain, apexDomain, snapshot } = input;
  const profile = snapshot.profile;
  const trafficSeries = snapshot.traffic.map((row) => ({
    metricMonth: dateToMonthKey(String(row.metricMonth)),
    visits: Number(row.visits),
    source: row.source as TrafficSource,
    fetchedAt: row.fetchedAt.toISOString(),
  }));

  return {
    domain,
    apexDomain,
    registrationDate: profile?.registrationDate ? String(profile.registrationDate) : null,
    registrationPrefix: profile?.registrationPrefix ?? null,
    registrationSource: (profile?.registrationSource as RegistrationSource | null) ?? null,
    trafficLastMonth: trafficSeries[0]?.visits ?? null,
    trafficSeries,
    cache: {
      hit: input.cacheHit,
      stale: input.stale,
      negative: input.negative,
      refreshed: input.refreshed,
    },
    providers: {
      aitdk: input.aitdkStatus,
      whois: input.whoisStatus,
    },
    updatedAt: profile?.updatedAt?.toISOString() ?? null,
  };
}

export class DomainResolutionError extends Error {
  public readonly status: number;

  public constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

export async function resolveDomainProfile(
  domainInput: string,
  options: ResolveDomainOptions = {},
): Promise<DomainProfileOutput> {
  const forceRefresh = Boolean(options.forceRefresh);
  const normalizedDomain = normalizeHost(domainInput);

  if (!normalizedDomain) {
    throw new DomainResolutionError("Invalid domain", 400);
  }

  const apexDomain = getApexDomain(normalizedDomain);
  const initialSnapshot = await getDomainSnapshot(normalizedDomain);
  const profile = initialSnapshot.profile;

  const registrationFresh = isFresh(profile?.registrationFetchedAt ?? null, REGISTRATION_TTL_MS);
  const trafficFresh = isFresh(profile?.trafficFetchedAt ?? null, TRAFFIC_TTL_MS);
  const negativeActive =
    profile?.negativeCacheUntil instanceof Date
      ? profile.negativeCacheUntil.getTime() > Date.now()
      : false;

  const needsRefresh = forceRefresh || !registrationFresh || !trafficFresh;

  const aitdkStatus = buildProviderStatus("aitdk");
  const whoisStatus = buildProviderStatus("whois_freeaiapi");

  if (profile && !needsRefresh) {
    return mapOutput({
      domain: normalizedDomain,
      apexDomain,
      snapshot: initialSnapshot,
      cacheHit: true,
      stale: false,
      negative: false,
      refreshed: false,
      aitdkStatus,
      whoisStatus,
    });
  }

  if (profile && negativeActive && !forceRefresh) {
    return mapOutput({
      domain: normalizedDomain,
      apexDomain,
      snapshot: initialSnapshot,
      cacheHit: true,
      stale: true,
      negative: true,
      refreshed: false,
      aitdkStatus,
      whoisStatus,
    });
  }

  const now = new Date();

  let registrationDate = profile?.registrationDate ? String(profile.registrationDate) : null;
  let registrationPrefix = profile?.registrationPrefix ?? null;
  let registrationSource = profile?.registrationSource ?? null;
  let registrationFetchedAt = profile?.registrationFetchedAt ?? null;
  let trafficFetchedAt = profile?.trafficFetchedAt ?? null;
  let trafficSource = profile?.trafficSource ?? null;
  let negativeCacheUntil: Date | null = null;
  let lastErrorCode: string | null = null;
  let lastErrorMessage: string | null = null;
  let rawAitdk: string | null | undefined;
  let rawWhois: unknown;

  const aitdkResult = await fetchAitdkData(normalizedDomain);
  aitdkStatus.success = aitdkResult.success;
  aitdkStatus.httpStatus = aitdkResult.httpStatus;
  aitdkStatus.errorCode = aitdkResult.errorCode;
  aitdkStatus.errorMessage = aitdkResult.errorMessage;
  rawAitdk = aitdkResult.rawPayload;

  await insertSyncLog({
    domain: normalizedDomain,
    domainId: profile?.id,
    provider: "aitdk",
    success: aitdkResult.success,
    httpStatus: aitdkResult.httpStatus,
    errorCode: aitdkResult.errorCode,
    errorMessage: aitdkResult.errorMessage,
    responseExcerpt: trimExcerpt(aitdkResult.rawPayload),
  });

  const domainProfile = await upsertDomainProfile({
    domain: normalizedDomain,
    apexDomain,
  });

  if (aitdkResult.success) {
    if (aitdkResult.monthlyTraffic.length > 0) {
      await upsertTrafficSeries({
        domainId: domainProfile.id,
        source: "aitdk",
        points: aitdkResult.monthlyTraffic,
        rawPayload: aitdkResult.rawPayload,
        fetchedAt: now,
      });
      trafficFetchedAt = now;
      trafficSource = "aitdk";
    }

    if (!registrationPrefix || !registrationFresh || forceRefresh) {
      if (aitdkResult.registrationPrefix) {
        registrationDate = toDateOnly(aitdkResult.registrationDate);
        registrationPrefix = aitdkResult.registrationPrefix;
        registrationSource = "aitdk_whois";
        registrationFetchedAt = now;
      }
    }
  }

  const shouldFetchWhois = !registrationPrefix || !registrationFresh || forceRefresh;
  if (shouldFetchWhois && !registrationPrefix) {
    const whoisResult = await fetchWhoisDate(apexDomain);
    whoisStatus.success = whoisResult.success;
    whoisStatus.httpStatus = whoisResult.httpStatus;
    whoisStatus.errorCode = whoisResult.errorCode;
    whoisStatus.errorMessage = whoisResult.errorMessage;
    rawWhois = whoisResult.rawPayload;

    await insertSyncLog({
      domain: normalizedDomain,
      domainId: domainProfile.id,
      provider: "whois_freeaiapi",
      success: whoisResult.success,
      httpStatus: whoisResult.httpStatus,
      errorCode: whoisResult.errorCode,
      errorMessage: whoisResult.errorMessage,
      responseExcerpt: trimExcerpt(
        typeof whoisResult.rawPayload === "string"
          ? whoisResult.rawPayload
          : JSON.stringify(whoisResult.rawPayload ?? null),
      ),
    });

    if (whoisResult.success && whoisResult.registrationPrefix) {
      registrationDate = toDateOnly(whoisResult.registrationDate);
      registrationPrefix = whoisResult.registrationPrefix;
      registrationSource = "whois_freeaiapi";
      registrationFetchedAt = now;
    }
  }

  if (!aitdkResult.success && !registrationPrefix) {
    negativeCacheUntil = new Date(Date.now() + NEGATIVE_TTL_MS);
    lastErrorCode = aitdkResult.errorCode;
    lastErrorMessage = aitdkResult.errorMessage;
  } else {
    negativeCacheUntil = null;
    lastErrorCode = null;
    lastErrorMessage = null;
  }

  await upsertDomainProfile({
    domain: normalizedDomain,
    apexDomain,
    registrationDate,
    registrationPrefix,
    registrationSource,
    registrationFetchedAt,
    trafficFetchedAt,
    trafficSource,
    negativeCacheUntil,
    lastErrorCode,
    lastErrorMessage,
    rawAitdk,
    rawWhois,
  });

  const latestSnapshot = await getDomainSnapshot(normalizedDomain);

  return mapOutput({
    domain: normalizedDomain,
    apexDomain,
    snapshot: latestSnapshot,
    cacheHit: Boolean(profile),
    stale: Boolean(profile) && needsRefresh,
    negative: Boolean(negativeCacheUntil),
    refreshed: true,
    aitdkStatus,
    whoisStatus,
  });
}
