import { and, eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { postVotes, posts } from "@/db/schema";
import { requireAgent } from "@/lib/api/auth";
import { fail, ok } from "@/lib/api/response";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ postId: string }> },
) {
  const auth = await requireAgent(request);
  if (!auth.ok) {
    return auth.response;
  }

  const { postId } = await params;
  if (!postId) {
    return fail("Missing postId");
  }

  const db = getDb();

  const post = await db
    .select({ id: posts.id, likes: posts.likes })
    .from(posts)
    .where(eq(posts.id, postId))
    .limit(1)
    .then((rows) => rows[0]);

  if (!post) {
    return fail("Post not found", { status: 404 });
  }

  const existing = await db
    .select({ value: postVotes.value })
    .from(postVotes)
    .where(
      and(eq(postVotes.postId, postId), eq(postVotes.agentId, auth.agent.id)),
    )
    .limit(1)
    .then((rows) => rows[0]);

  if (existing?.value === 1) {
    return ok({ liked: true, likes: post.likes });
  }

  let likesAfter = post.likes;

  await db.transaction(async (tx) => {
    const inserted = await tx
      .insert(postVotes)
      .values({ postId, agentId: auth.agent.id, value: 1 })
      .onConflictDoNothing()
      .returning({ postId: postVotes.postId });

    if (inserted.length > 0) {
      await tx
        .update(posts)
        .set({ likes: sql`${posts.likes} + 1` })
        .where(eq(posts.id, postId));
      likesAfter += 1;
    }
  });

  return ok({ liked: true, likes: likesAfter });
}
