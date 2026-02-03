import { desc, eq, and, isNull, isNotNull } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getDb } from "@/db";
import { agents, posts, pins } from "@/db/schema";
import { LeftSidebar } from "@/components/twitter/LeftSidebar";
import { RightSidebar } from "@/components/twitter/RightSidebar";
import { UserProfile } from "@/components/twitter/UserProfile";

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

// Since params.screenName might be url encoded or not, and usually screen_name in db has @ or not.
// In schema: `screen_name: varchar("screen_name", { length: 64 }).unique(),`
// Usually stores `@handle`.
// The URL param will just be `handle` (no @).
// So query needs to prepend @ or check both.

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ screenName: string }>;
}) {
  const { screenName } = await params;
  const decodedHandle = decodeURIComponent(screenName).replace(/^@/, "");
  const db = getDb();

  // Find agent by screen_name (try with @)
  const agent = await db
    .select()
    .from(agents)
    .where(
      eq(agents.screen_name, `@${decodedHandle}`),
      //   or(
      //     eq(agents.screen_name, `@${decodedHandle}`),
      //     eq(agents.screen_name, decodedHandle)
      //   )
    )
    .limit(1)
    .then((rows) => rows[0]);

  // Fallback: try querying without @ if not found, though schema says screen_name usually has @.
  // Actually, wait, let's just stick to `@${decodedHandle}` if that's the convention.
  // If not found, 404.

  if (!agent) {
    // Try without @ just in case of inconsistency
    const agentNoAt = await db
      .select()
      .from(agents)
      .where(eq(agents.screen_name, decodedHandle))
      .limit(1)
      .then((rows) => rows[0]);

    if (!agentNoAt) {
      notFound();
    }
  }

  const targetAgent =
    agent ||
    (await db
      .select()
      .from(agents)
      .where(eq(agents.screen_name, decodedHandle))
      .then((r) => r[0]));
  if (!targetAgent) {
    notFound();
  }

  // Fetch posts
  const agentPosts = await db
    .select({ post: posts })
    .from(posts)
    .where(and(eq(posts.authorId, targetAgent.id), isNull(posts.parentId)))
    .orderBy(desc(posts.createdAt))
    .limit(50);

  const agentReplies = await db
    .select({ post: posts })
    .from(posts)
    .where(and(eq(posts.authorId, targetAgent.id), isNotNull(posts.parentId)))
    .orderBy(desc(posts.createdAt))
    .limit(50);

  // Check for pinned post
  // `pins` table: postId, pinnedBy.
  // We want to know if any of these posts are pinned by THIS agent.
  // Actually, usually a profile shows pinned post at top.
  // Let's fetch the pinned post for this agent if exists.
  const pinned = await db
    .select({ postId: pins.postId })
    .from(pins)
    .where(eq(pins.pinnedBy, targetAgent.id))
    .limit(1)
    .then((rows) => rows[0]);

  const pinnedPostId = pinned?.postId;

  // Prepare Data
  const profileUser = {
    id: targetAgent.id,
    name: targetAgent.name,
    handle: `@${decodedHandle}`,
    description: targetAgent.description ?? "",
    location: "Internet", // Mocking as not in DB
    website: `https://openclawx.ai/u/${decodedHandle}`, // Mocking or using profile link
    joinedAt: targetAgent.createdAt.toISOString(),
    following: targetAgent.followingCount ?? 0,
    followers: targetAgent.followerCount ?? 0,
    avatarUrl: targetAgent.avatarUrl,
    bannerUrl: null, // Mocking
    accent: hashAccent(targetAgent.name),
    postsCount: agentPosts.length + agentReplies.length, // Approximate
  };

  const profilePosts = agentPosts.map((r) => ({
    id: r.post.id,
    content: r.post.content,
    replies: r.post.commentCount ?? 0,
    likes: r.post.likes ?? 0,
    createdAt: r.post.createdAt.toISOString(),
    views: r.post.viewCount ?? 0,
    isPinned: r.post.id === pinnedPostId,
  }));

  const profileReplies = agentReplies.map((r) => ({
    id: r.post.id,
    content: r.post.content,
    replies: r.post.commentCount ?? 0,
    likes: r.post.likes ?? 0,
    createdAt: r.post.createdAt.toISOString(),
    views: r.post.viewCount ?? 0,
  }));

  // Re-order if pinned exists (move to top)
  if (pinnedPostId) {
    const pIndex = profilePosts.findIndex((p) => p.id === pinnedPostId);
    if (pIndex > -1) {
      const [p] = profilePosts.splice(pIndex, 1);
      p.isPinned = true;
      profilePosts.unshift(p);
    }
  }

  return (
    <div className="flex min-h-screen justify-center bg-black text-white">
      <div className="flex w-full xl:max-w-[1265px] lg:max-w-[1000px] justify-center lg:justify-between shrink-0">
        {/* Left Sidebar */}
        <div className="hidden sm:flex sm:w-[88px] xl:w-[275px] shrink-0 justify-end">
          <LeftSidebar />
        </div>

        {/* Main Content */}
        <div className="flex w-full max-w-[600px] shrink-0 border-x border-white/20">
          <UserProfile
            user={profileUser}
            posts={profilePosts}
            replies={profileReplies}
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
