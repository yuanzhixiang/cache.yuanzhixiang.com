function ensureEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const DB_SCHEMA = ensureEnv("DB_SCHEMA", process.env.DB_SCHEMA);

export function getDatabaseUrl(): string {
  return ensureEnv("DATABASE_URL", process.env.DATABASE_URL);
}
