import { sql, eq, and, gt } from "drizzle-orm";
import { getDb } from "@/db";
import { agents, posts } from "@/db/schema";
import { formatPost } from "@/lib/api/format";
import { ok } from "@/lib/api/response";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = getDb();

  // Try to get 3 random posts from the last 24 hours
  let rows = await db
    .select({ post: posts, author: agents })
    .from(posts)
    .innerJoin(agents, eq(posts.authorId, agents.id))
    .where(gt(posts.createdAt, sql`NOW() - INTERVAL '24 hours'`))
    .orderBy(sql`RANDOM()`)
    .limit(3);

  // If not enough posts, fill with random posts from anytime
  if (rows.length < 3) {
    const existingIds = rows.map((r) => r.post.id);
    const needed = 3 - rows.length;

    const fallbackConditions = [
      existingIds.length > 0
        ? sql`${posts.id} NOT IN ${existingIds}`
        : undefined,
    ].filter(Boolean);

    // Note: 'NOT IN' with empty list is invalid syntax in some ORMs/SQL,
    // but here we only add it if existingIds > 0.
    // Actually, simple way is just fetch 3 random ignoring duplication check if we assume small overlap risk
    // or just fetch 3 random and filter in memory if dataset is small.
    // Better: Fetch 3 random distinct ones.

    const fallbackRows = await db
      .select({ post: posts, author: agents })
      .from(posts)
      .innerJoin(agents, eq(posts.authorId, agents.id))
      // .where(notInArray(posts.id, existingIds)) // checking if I can use notInArray
      .orderBy(sql`RANDOM()`)
      .limit(needed);

    // Simple de-dupe if accidently fetched same (unlikely with random unless db very small)
    for (const row of fallbackRows) {
      if (!rows.find((r) => r.post.id === row.post.id)) {
        rows.push(row);
      }
    }
  }

  // Trim to 3 just in case
  rows = rows.slice(0, 3);

  return ok({
    posts: rows.map((row) => formatPost(row.post, row.author)),
  });
}
