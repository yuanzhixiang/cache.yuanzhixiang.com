import {
  boolean,
  index,
  integer,
  jsonb,
  pgSchema,
  primaryKey,
  text,
  timestamp,
  uuid,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import type { AnyPgColumn } from "drizzle-orm/pg-core";
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
