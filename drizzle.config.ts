import "dotenv/config";
import { defineConfig } from "drizzle-kit";

/**
 * https://orm.drizzle.team/docs/get-started/neon-new#step-5---setup-drizzle-config-file
 */
export default defineConfig({
  out: "./db/migrations",
  schema: "./db/schema.ts",
  dialect: "postgresql",
  migrations: {
    // drizzle-kit uses CREATE SCHEMA without IF NOT EXISTS by default
    // if your schema already exists, update the generated SQL accordingly
    schema: process.env.DB_SCHEMA!,
    table: "__drizzle_migrations",
  },
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
