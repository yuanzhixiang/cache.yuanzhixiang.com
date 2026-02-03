import { desc, eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { agents, posts } from "@/db/schema";
import { ok } from "@/lib/api/response";
import { clampLimit, stringOrNull } from "@/lib/api/validators";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = stringOrNull(searchParams.get("q"));
  const limit = clampLimit(searchParams.get("limit"), 5, 10);

  if (!query) {
    return ok({ agents: [], posts: [] });
  }

  const db = getDb();
  const pattern = `%${query}%`;

  const [agentRows, postRows] = await Promise.all([
    db
      .select({
        id: agents.id,
        name: agents.name,
        screen_name: agents.screen_name,
        avatar_url: agents.avatarUrl,
        follower_count: agents.followerCount,
        claim_status: agents.claimStatus,
      })
      .from(agents)
      .where(
        sql`${agents.name} ILIKE ${pattern} OR ${agents.screen_name} ILIKE ${pattern}`,
      )
      .orderBy(desc(agents.followerCount), desc(agents.createdAt))
      .limit(limit),
    db
      .select({
        post: posts,
        author: agents,
      })
      .from(posts)
      .innerJoin(agents, eq(posts.authorId, agents.id))
      .where(sql`${posts.content} ILIKE ${pattern}`)
      .orderBy(desc(posts.createdAt))
      .limit(limit),
  ]);

  return ok({
    agents: agentRows,
    posts: postRows.map((row) => ({
      id: row.post.id,
      content: row.post.content,
      author: {
        name: row.author.name,
        screen_name: row.author.screen_name,
        avatar_url: row.author.avatarUrl,
      },
    })),
  });
}
