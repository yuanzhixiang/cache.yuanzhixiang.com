import {
  boolean,
  date,
  index,
  integer,
  bigint,
  jsonb,
  pgSchema,
  text,
  timestamp,
  uuid,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { DB_SCHEMA } from "../lib/env/env-db";

const schema = pgSchema(DB_SCHEMA);

export const agents = schema.table(
  "agents",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),

    name: varchar("name", { length: 64 }).notNull(),
  },
  (table) => ({
    nameIndex: index("agents_name_idx").on(table.name),
  }),
);

export const domainProfiles = schema.table(
  "domain_profiles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),

    domain: varchar("domain", { length: 255 }).notNull(),
    apexDomain: varchar("apex_domain", { length: 255 }).notNull(),

    registrationDate: date("registration_date"),
    registrationPrefix: varchar("registration_prefix", { length: 8 }),
    registrationSource: varchar("registration_source", { length: 32 }),
    registrationFetchedAt: timestamp("registration_fetched_at", { withTimezone: true }),

    trafficSource: varchar("traffic_source", { length: 32 }),
    trafficFetchedAt: timestamp("traffic_fetched_at", { withTimezone: true }),

    negativeCacheUntil: timestamp("negative_cache_until", { withTimezone: true }),
    lastErrorCode: varchar("last_error_code", { length: 64 }),
    lastErrorMessage: text("last_error_message"),

    rawAitdk: jsonb("raw_aitdk"),
    rawWhois: jsonb("raw_whois"),
  },
  (table) => ({
    domainUniqueIndex: uniqueIndex("domain_profiles_domain_uidx").on(table.domain),
    apexDomainIndex: index("domain_profiles_apex_domain_idx").on(table.apexDomain),
    negativeCacheUntilIndex: index("domain_profiles_negative_cache_until_idx").on(
      table.negativeCacheUntil,
    ),
    updatedAtIndex: index("domain_profiles_updated_at_idx").on(table.updatedAt),
  }),
);

export const domainTrafficMonthly = schema.table(
  "domain_traffic_monthly",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),

    domainId: uuid("domain_id")
      .notNull()
      .references(() => domainProfiles.id, { onDelete: "cascade" }),
    metricMonth: date("metric_month").notNull(),
    visits: bigint("visits", { mode: "number" }).notNull(),
    source: varchar("source", { length: 32 }).notNull().default("aitdk"),
    fetchedAt: timestamp("fetched_at", { withTimezone: true }).notNull().defaultNow(),
    rawPayload: jsonb("raw_payload"),
  },
  (table) => ({
    monthUniqueIndex: uniqueIndex("domain_traffic_monthly_domain_month_source_uidx").on(
      table.domainId,
      table.metricMonth,
      table.source,
    ),
    domainMonthIndex: index("domain_traffic_monthly_domain_month_idx").on(
      table.domainId,
      table.metricMonth,
    ),
    fetchedAtIndex: index("domain_traffic_monthly_fetched_at_idx").on(table.fetchedAt),
  }),
);

export const domainSyncLogs = schema.table(
  "domain_sync_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),

    domainId: uuid("domain_id").references(() => domainProfiles.id, {
      onDelete: "set null",
    }),
    domain: varchar("domain", { length: 255 }).notNull(),
    provider: varchar("provider", { length: 32 }).notNull(),
    success: boolean("success").notNull(),
    httpStatus: integer("http_status"),
    errorCode: varchar("error_code", { length: 64 }),
    errorMessage: text("error_message"),
    responseExcerpt: text("response_excerpt"),
  },
  (table) => ({
    domainCreatedAtIndex: index("domain_sync_logs_domain_created_at_idx").on(
      table.domain,
      table.createdAt,
    ),
    providerCreatedAtIndex: index("domain_sync_logs_provider_created_at_idx").on(
      table.provider,
      table.createdAt,
    ),
  }),
);
