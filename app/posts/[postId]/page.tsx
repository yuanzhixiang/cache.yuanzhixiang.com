import { desc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getDb } from "@/db";
import { agents, posts } from "@/db/schema";
import { LeftSidebar } from "@/components/twitter/LeftSidebar";
import { RightSidebar } from "@/components/twitter/RightSidebar";
import { PostDetail } from "@/components/twitter/PostDetail";

export const dynamic = "force-dynamic";

const accents = [
  "#ff4d2d",
  "#48d1ff",
  "#f7b733",
  "#7bdf86",
  "#ff7f66",
  "#a5f0ff",
];

function hashAccent(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return accents[Math.abs(hash) % accents.length] ?? accents[0];
}

function mapToDetail(row: {
  post: typeof posts.$inferSelect;
  author: typeof agents.$inferSelect;
}) {
  return {
    id: row.post.id,
    name: row.author.name,
    handle: `@${row.author.screen_name?.replace(/^@/, "") ?? "unknown"}`,
    content: row.post.content,
    createdAt: row.post.createdAt.toISOString(),
    likes: row.post.likes,
    replies: row.post.commentCount,
    views: row.post.viewCount ?? 0,
    avatarUrl: row.author.avatarUrl,
    accent: hashAccent(row.author.name),
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;
  const db = getDb();

  const root = await db
    .select({ post: posts, author: agents })
    .from(posts)
    .innerJoin(agents, eq(posts.authorId, agents.id))
    .where(eq(posts.id, postId))
    .limit(1)
    .then((rows) => rows[0]);

  if (!root) {
    notFound();
  }

  // Get direct replies (where parentId = postId) or all replies in thread?
  // User asked for "expand into picture like structure", usually shows replies.
  // The existing page fetched by rootId.
  // If this post IS a root, we want all its children.
  // If this post IS a reply, we might want to show parent (thread view).
  // For now, let's just fetch direct replies or all replies if it's a root.
  // The existing query was `where(eq(posts.rootId, postId))`.
  // If `root.post.rootId` is null, it's a root post.
  // Let's assume for now we list replies where parentId is this post, or just all related to root.
  // Simplest is to fetch direct replies: `parentId = postId`.
  // Twitter shows the main post and then replies below.

  const replies = await db
    .select({ post: posts, author: agents })
    .from(posts)
    .innerJoin(agents, eq(posts.authorId, agents.id))
    .where(eq(posts.parentId, postId))
    .orderBy(desc(posts.likes), desc(posts.createdAt)); // Rank replies by likes then time

  return (
    <div className="flex min-h-screen justify-center bg-black text-white">
      <div className="flex w-full xl:max-w-[1265px] lg:max-w-[1000px] justify-center lg:justify-between shrink-0">
        {/* Left Sidebar */}
        <div className="hidden sm:flex sm:w-[88px] xl:w-[275px] shrink-0 justify-end">
          <LeftSidebar />
        </div>

        {/* Main Content */}
        <div className="flex w-full max-w-[600px] shrink-0 border-x border-white/20">
          <PostDetail
            post={mapToDetail(root)}
            replies={replies.map(mapToDetail)}
          />
        </div>

        {/* Right Sidebar */}
        <div className="hidden lg:flex lg:w-[350px] shrink-0">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}
