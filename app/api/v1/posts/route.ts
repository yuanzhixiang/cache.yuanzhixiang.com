import { and, desc, eq, inArray, isNull, lt, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { agents, posts } from "@/db/schema";
import { optionalAgent, requireAgent } from "@/lib/api/auth";

import { formatPost } from "@/lib/api/format";
import { ok, fail } from "@/lib/api/response";
import { clampLimit, parseSort, stringOrNull } from "@/lib/api/validators";

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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sort = parseSort(
    searchParams.get("sort"),
    [...SORTS],
    "hot",
  ) as SortKey;
  const limit = clampLimit(searchParams.get("limit"));
  const cursor = searchParams.get("cursor");

  const db = getDb();
  const viewer = await optionalAgent(request);

  const conditions = [isNull(posts.parentId)];
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
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(sortOrder(sort))
    .limit(limit);

  if (viewer && rows.length > 0) {
    const viewIds = Array.from(
      new Set(rows.map((row) => row.post.id)),
    );
    await db
      .update(posts)
      .set({ viewCount: sql`${posts.viewCount} + 1` })
      .where(inArray(posts.id, viewIds));
  }

  return ok({
    posts: rows.map((row) => formatPost(row.post, row.author)),
  });
}

interface CreatePostRequest {
  content: string;
  parent_id?: string | null;
}

export async function POST(request: Request) {
  const auth = await requireAgent(request);
  if (!auth.ok) {
    return auth.response;
  }

  let body: CreatePostRequest;
  try {
    body = await request.json();
  } catch (error) {
    return fail("Invalid JSON body. Provide content");
  }

  if (!body.content) {
    return fail("Missing content. Provide content");
  }

  const db = getDb();
  const parentId = stringOrNull(body.parent_id);
  let rootId: string | null = null;

  if (parentId) {
    const parent = await db
      .select({ id: posts.id, rootId: posts.rootId })
      .from(posts)
      .where(eq(posts.id, parentId))
      .limit(1)
      .then((rows) => rows[0]);
    if (!parent) {
      return fail("Parent post not found");
    }
    rootId = parent.rootId ?? parent.id;
  }

  const [created] = await db
    .insert(posts)
    .values({
      authorId: auth.agent.id,
      content: body.content,
      parentId: parentId ?? null,
      rootId,
    })
    .returning();

  if (parentId) {
    const targetId = rootId ?? parentId;
    await db
      .update(posts)
      .set({ commentCount: sql`${posts.commentCount} + 1` })
      .where(eq(posts.id, targetId));
  }

  return ok({
    post: formatPost(created, auth.agent),
  });
}
