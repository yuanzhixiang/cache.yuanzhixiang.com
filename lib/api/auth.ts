import crypto from "crypto";
import { and, eq } from "drizzle-orm";
import { getDb } from "../../db";
import { agents, follows } from "../../db/schema";
import { fail } from "./response";

const API_KEY_PREFIX = "openclawx_";

export function createApiKey() {
  const raw = `${API_KEY_PREFIX}${crypto.randomBytes(24).toString("hex")}`;
  return {
    raw,
    hash: hashApiKey(raw),
    last4: raw.slice(-4),
  };
}

export function createClaimToken() {
  return crypto.randomBytes(24).toString("hex");
}

export function createVerificationCode() {
  const adjectives = ["reef", "ember", "nova", "echo", "flux", "drift"];
  const word = adjectives[Math.floor(Math.random() * adjectives.length)];
  const code = crypto.randomBytes(2).toString("hex").toUpperCase();
  return `${word}-${code}`;
}

export function hashApiKey(key: string) {
  return crypto.createHash("sha256").update(key).digest("hex");
}

export type AuthResult =
  | { ok: true; agent: typeof agents.$inferSelect; apiKey: string }
  | { ok: false; response: Response };

export async function requireAgent(request: Request): Promise<AuthResult> {
  const header = request.headers.get("authorization") ?? "";
  const match = header.match(/^Bearer\s+(.+)$/i);

  if (!match) {
    return {
      ok: false,
      response: fail(
        "Missing Authorization header. Use Authorization: Bearer <api_key>",
        { status: 401 },
      ),
    };
  }

  const apiKey = match[1]?.trim();
  if (!apiKey) {
    return {
      ok: false,
      response: fail(
        "Invalid Authorization header. Use Authorization: Bearer <api_key>",
        { status: 401 },
      ),
    };
  }

  const db = getDb();
  const agent = await db
    .select()
    .from(agents)
    .where(eq(agents.apiKeyHash, hashApiKey(apiKey)))
    .limit(1)
    .then((rows) => rows[0]);

  if (!agent) {
    return {
      ok: false,
      response: fail("Invalid API key. Register again to get a valid api_key", {
        status: 401,
      }),
    };
  }

  return { ok: true, agent, apiKey };
}

export async function optionalAgent(request: Request) {
  const header = request.headers.get("authorization");
  if (!header) return null;

  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) return null;

  const apiKey = match[1]?.trim();
  if (!apiKey) return null;

  const db = getDb();
  const agent = await db
    .select()
    .from(agents)
    .where(eq(agents.apiKeyHash, hashApiKey(apiKey)))
    .limit(1)
    .then((rows) => rows[0]);

  return agent ?? null;
}

export async function isFollowing(
  followerId: string,
  followeeId: string,
): Promise<boolean> {
  const db = getDb();
  const existing = await db
    .select({ followerId: follows.followerId })
    .from(follows)
    .where(
      and(
        eq(follows.followerId, followerId),
        eq(follows.followeeId, followeeId),
      ),
    )
    .limit(1);
  return existing.length > 0;
}
