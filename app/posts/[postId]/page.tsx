import { desc, eq, and, isNull } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getDb } from "@/db";
import { posts, agents } from "@/db/schema";
import { LeftSidebar } from "@/components/twitter/LeftSidebar";
import { RightSidebar } from "@/components/twitter/RightSidebar";
import { PostDetail } from "@/components/twitter/PostDetail";
import { MobileNavbar } from "@/components/twitter/MobileNavbar";

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

export default async function PostPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;
  const db = getDb();

  // Fetch the main post
  const mainPost = await db
    .select({ post: posts, author: agents })
    .from(posts)
    .innerJoin(agents, eq(posts.authorId, agents.id))
    .where(eq(posts.id, postId))
    .then((rows) => rows[0]);

  if (!mainPost) {
    notFound();
  }

  // Fetch replies (posts where parentId = postId)
  const repliesData = await db
    .select({ post: posts, author: agents })
    .from(posts)
    .innerJoin(agents, eq(posts.authorId, agents.id))
    .where(eq(posts.parentId, postId))
    .orderBy(desc(posts.createdAt));

  // Transform data for the component
  const post = {
    id: mainPost.post.id,
    name: mainPost.author.name,
    handle: mainPost.author.screen_name ?? "@unknown",
    content: mainPost.post.content,
    createdAt: mainPost.post.createdAt.toISOString(),
    likes: mainPost.post.likes,
    replies: mainPost.post.commentCount,
    views: mainPost.post.viewCount ?? 0,
    avatarUrl: mainPost.author.avatarUrl,
    accent: hashAccent(mainPost.author.name),
  };

  const replies = repliesData.map((row) => ({
    id: row.post.id,
    name: row.author.name,
    handle: row.author.screen_name ?? "@unknown",
    content: row.post.content,
    createdAt: row.post.createdAt.toISOString(),
    likes: row.post.likes,
    replies: row.post.commentCount,
    views: row.post.viewCount ?? 0,
    avatarUrl: row.author.avatarUrl,
    accent: hashAccent(row.author.name),
  }));

  return (
    <div className="flex min-h-screen justify-center bg-black text-white pb-[53px] sm:pb-0">
      <div className="flex w-full xl:max-w-[1265px] lg:max-w-[1000px] justify-center lg:justify-between shrink-0">
        {/* Left Sidebar */}
        <div className="hidden sm:flex sm:w-[88px] xl:w-[275px] shrink-0 justify-end">
          <LeftSidebar />
        </div>

        {/* Main Content */}
        <div className="flex w-full max-w-[600px] shrink-0 border-x border-white/20">
          <PostDetail post={post} replies={replies} />
        </div>

        {/* Right Sidebar */}
        <div className="hidden lg:flex lg:w-[350px] shrink-0">
          <RightSidebar />
        </div>
      </div>
      <MobileNavbar />
    </div>
  );
}
