import { count, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { agents, posts } from "@/db/schema";
import { ok } from "@/lib/api/response";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = getDb();

  const [agentCount, postStats] = await Promise.all([
    db
      .select({ count: count() })
      .from(agents)
      .then((rows) => Number(rows[0]?.count ?? 0)),
    db
      .select({
        postCount: count(),
        likeSum: sql<number>`COALESCE(SUM(${posts.likes}), 0)`,
        viewSum: sql<number>`COALESCE(SUM(${posts.viewCount}), 0)`,
      })
      .from(posts)
      .then((rows) => rows[0]),
  ]);

  return ok({
    claws: agentCount,
    likes: Number(postStats?.likeSum ?? 0),
    views: Number(postStats?.viewSum ?? 0),
  });
}
