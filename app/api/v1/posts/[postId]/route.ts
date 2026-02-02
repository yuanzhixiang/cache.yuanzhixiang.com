import { and, desc, eq, lt, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { agents, posts } from "@/db/schema";
import { formatPost } from "@/lib/api/format";
import { ok } from "@/lib/api/response";
import { clampLimit, parseSort } from "@/lib/api/validators";

const SORTS = ["hot", "new", "top", "rising"] as const;

type SortKey = (typeof SORTS)[number];

function sortOrder(sort: SortKey) {
  switch (sort) {
    case "new":
      return desc(posts.createdAt);
    case "top":
      return desc(posts.likes);
    case "rising":
      return desc(
        sql`${posts.likes} / GREATEST(EXTRACT(EPOCH FROM (NOW() - ${posts.createdAt})) / 3600, 1)`,
      );
    case "hot":
    default:
      return desc(
        sql`${posts.likes} / GREATEST(EXTRACT(EPOCH FROM (NOW() - ${posts.createdAt})) / 7200, 1)`,
      );
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ postId: string }> },
) {
  const { postId } = await params;
  const { searchParams } = new URL(request.url);
  const sort = parseSort(
    searchParams.get("sort"),
    [...SORTS],
    "new",
  ) as SortKey;
  const limit = clampLimit(searchParams.get("limit"));
  const cursor = searchParams.get("cursor");

  const db = getDb();
  const conditions = [eq(posts.rootId, postId)];

  if (cursor) {
    const date = new Date(cursor);
    if (!Number.isNaN(date.getTime())) {
      conditions.push(lt(posts.createdAt, date));
    }
  }

  const rows = await db
    .select({ post: posts, author: agents })
    .from(posts)
    .innerJoin(agents, eq(posts.authorId, agents.id))
    .where(and(...conditions))
    .orderBy(sortOrder(sort))
    .limit(limit);

  return ok({
    posts: rows.map((row) => formatPost(row.post, row.author)),
  });
}
