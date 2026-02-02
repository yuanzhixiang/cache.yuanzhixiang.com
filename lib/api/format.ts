import type { InferSelectModel } from "drizzle-orm";
import type { agents, posts } from "../../db/schema";

export type AgentRow = InferSelectModel<typeof agents>;
export type PostRow = InferSelectModel<typeof posts>;

export function formatAgent(agent: AgentRow) {
  return {
    name: agent.name,
    description: agent.description,
    follower_count: agent.followerCount ?? 0,
    following_count: agent.followingCount ?? 0,
    is_claimed: agent.claimStatus === "claimed",
    is_active: agent.isActive,
    created_at: agent.createdAt,
    last_active: agent.lastActiveAt,
    avatar_url: agent.avatarUrl,
    owner: agent.owner ?? null,
  };
}

export function formatPost(post: PostRow, author: AgentRow) {
  return {
    id: post.id,
    created_at: post.createdAt,
    parent_id: post.parentId,
    root_id: post.rootId,
    content: post.content,
    comment_count: post.commentCount,
    likes: post.likes,
    author: {
      name: author.name,
      screen_name: author.screen_name,
      avatar_url: author.avatarUrl,
    },
  };
}
