import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { domainProfiles, domainSyncLogs, domainTrafficMonthly } from "@/db/schema";
import type { TrafficMonthlyPoint } from "./types";

export type DomainProfileRow = typeof domainProfiles.$inferSelect;
export type DomainTrafficMonthlyRow = typeof domainTrafficMonthly.$inferSelect;

interface UpsertDomainProfileInput {
  domain: string;
  apexDomain: string;
  registrationDate?: string | null;
  registrationPrefix?: string | null;
  registrationSource?: string | null;
  registrationFetchedAt?: Date | null;
  trafficSource?: string | null;
  trafficFetchedAt?: Date | null;
  negativeCacheUntil?: Date | null;
  lastErrorCode?: string | null;
  lastErrorMessage?: string | null;
  rawAitdk?: unknown;
  rawWhois?: unknown;
}

function compactObject<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, entryValue]) => entryValue !== undefined),
  ) as T;
}

export async function getDomainProfileByDomain(domain: string): Promise<DomainProfileRow | null> {
  const db = getDb();
  const rows = await db
    .select()
    .from(domainProfiles)
    .where(eq(domainProfiles.domain, domain))
    .limit(1);

  return rows[0] ?? null;
}

export async function getTrafficSeriesByDomainId(
  domainId: string,
  limit = 3,
): Promise<DomainTrafficMonthlyRow[]> {
  const db = getDb();
  return db
    .select()
    .from(domainTrafficMonthly)
    .where(eq(domainTrafficMonthly.domainId, domainId))
    .orderBy(desc(domainTrafficMonthly.metricMonth))
    .limit(limit);
}

export async function upsertDomainProfile(input: UpsertDomainProfileInput): Promise<DomainProfileRow> {
  const db = getDb();
  const now = new Date();

  const insertPayload = compactObject({
    domain: input.domain,
    apexDomain: input.apexDomain,
    registrationDate: input.registrationDate,
    registrationPrefix: input.registrationPrefix,
    registrationSource: input.registrationSource,
    registrationFetchedAt: input.registrationFetchedAt,
    trafficSource: input.trafficSource,
    trafficFetchedAt: input.trafficFetchedAt,
    negativeCacheUntil: input.negativeCacheUntil,
    lastErrorCode: input.lastErrorCode,
    lastErrorMessage: input.lastErrorMessage,
    rawAitdk: input.rawAitdk,
    rawWhois: input.rawWhois,
    updatedAt: now,
  });

  const [row] = await db
    .insert(domainProfiles)
    .values(insertPayload)
    .onConflictDoUpdate({
      target: domainProfiles.domain,
      set: insertPayload,
    })
    .returning();

  return row;
}

export async function upsertTrafficSeries(input: {
  domainId: string;
  source: string;
  points: TrafficMonthlyPoint[];
  rawPayload?: unknown;
  fetchedAt?: Date;
}): Promise<void> {
  const db = getDb();
  const fetchedAt = input.fetchedAt ?? new Date();

  for (const point of input.points) {
    await db
      .insert(domainTrafficMonthly)
      .values({
        domainId: input.domainId,
        metricMonth: point.metricMonth,
        visits: point.visits,
        source: input.source,
        fetchedAt,
        rawPayload: input.rawPayload,
        updatedAt: fetchedAt,
      })
      .onConflictDoUpdate({
        target: [
          domainTrafficMonthly.domainId,
          domainTrafficMonthly.metricMonth,
          domainTrafficMonthly.source,
        ],
        set: {
          visits: point.visits,
          fetchedAt,
          rawPayload: input.rawPayload,
          updatedAt: fetchedAt,
        },
      });
  }
}

export async function insertSyncLog(input: {
  domain: string;
  domainId?: string | null;
  provider: string;
  success: boolean;
  httpStatus?: number | null;
  errorCode?: string | null;
  errorMessage?: string | null;
  responseExcerpt?: string | null;
}): Promise<void> {
  const db = getDb();

  await db.insert(domainSyncLogs).values({
    domain: input.domain,
    domainId: input.domainId ?? null,
    provider: input.provider,
    success: input.success,
    httpStatus: input.httpStatus ?? null,
    errorCode: input.errorCode ?? null,
    errorMessage: input.errorMessage ?? null,
    responseExcerpt: input.responseExcerpt ?? null,
  });
}

export async function getDomainSnapshot(domain: string): Promise<{
  profile: DomainProfileRow | null;
  traffic: DomainTrafficMonthlyRow[];
}> {
  const profile = await getDomainProfileByDomain(domain);
  if (!profile) {
    return { profile: null, traffic: [] };
  }

  const traffic = await getTrafficSeriesByDomainId(profile.id, 3);
  return { profile, traffic };
}
