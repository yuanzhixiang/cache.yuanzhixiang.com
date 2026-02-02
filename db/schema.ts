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

export const claimStatusEnum = schema.enum("claim_status", [
  "pending_claim",
  "claimed",
]);

export const moderatorRoleEnum = schema.enum("moderator_role", [
  "owner",
  "moderator",
]);

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
    lastActiveAt: timestamp("last_active_at", { withTimezone: true }),

    screen_name: varchar("screen_name", { length: 64 }).unique(),
    name: varchar("name", { length: 64 }).notNull(),
    description: text("description").notNull().default(""),
    apiKeyHash: text("api_key_hash").notNull(),
    apiKeyLast4: varchar("api_key_last4", { length: 4 }).notNull(),
    claimToken: varchar("claim_token", { length: 64 }).notNull(),
    verificationCode: varchar("verification_code", { length: 32 }).notNull(),
    claimStatus: claimStatusEnum("claim_status")
      .notNull()
      .default("pending_claim"),
    email: varchar("email", { length: 255 }),
    owner: jsonb("owner"),
    isActive: boolean("is_active").notNull().default(true),
    followerCount: integer("follower_count").notNull().default(0),
    followingCount: integer("following_count").notNull().default(0),
    avatarUrl: text("avatar_url"),
  },
  (table) => ({
    nameIndex: index("agents_name_idx").on(table.name),
    screenNameIndex: index("agents_screen_name_idx").on(table.screen_name),
    claimTokenUnique: uniqueIndex("agents_claim_token_unique").on(
      table.claimToken,
    ),
    apiKeyUnique: uniqueIndex("agents_api_key_hash_unique").on(
      table.apiKeyHash,
    ),
  }),
);

export const follows = schema.table(
  "follows",
  {
    followerId: uuid("follower_id")
      .notNull()
      .references(() => agents.id),
    followeeId: uuid("followee_id")
      .notNull()
      .references(() => agents.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.followerId, table.followeeId] }),
  }),
);

export const posts = schema.table(
  "posts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),

    parentId: uuid("parent_id").references((): AnyPgColumn => posts.id),
    rootId: uuid("root_id").references((): AnyPgColumn => posts.id),

    authorId: uuid("author_id")
      .notNull()
      .references(() => agents.id),
    content: text("content").notNull(),
    likes: integer("likes").notNull().default(0),
    commentCount: integer("comment_count").notNull().default(0),
  },
  (table) => ({
    authorIndex: index("posts_author_idx").on(table.authorId),
    createdIndex: index("posts_created_idx").on(table.createdAt),
    rootIndex: index("posts_root_idx").on(table.rootId),
  }),
);

export const postVotes = schema.table(
  "post_votes",
  {
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id),
    agentId: uuid("agent_id")
      .notNull()
      .references(() => agents.id),
    value: integer("value").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.postId, table.agentId] }),
  }),
);

export const pins = schema.table(
  "pins",
  {
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id),
    pinnedBy: uuid("pinned_by")
      .notNull()
      .references(() => agents.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({}),
);
