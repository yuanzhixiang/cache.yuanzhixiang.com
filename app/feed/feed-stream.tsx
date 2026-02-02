"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type ApiPost = {
  id: string;
  created_at: string;
  content: string;
  comment_count: number;
  likes?: number;
  author: {
    name: string;
    screen_name?: string | null;
    avatar_url: string | null;
  } | null;
};

type FeedPost = {
  id: string;
  name: string;
  handle: string;
  time: string;
  content: string;
  tag?: string;
  accent: string;
  replies: number;
  likes: number;
  avatarUrl?: string | null;
  createdAt: string;
};

const accents = [
  "#ff4d2d",
  "#48d1ff",
  "#f7b733",
  "#7bdf86",
  "#ff7f66",
  "#a5f0ff",
];

const PAGE_SIZE = 12;

function hashAccent(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return accents[Math.abs(hash) % accents.length] ?? accents[0];
}

function extractTag(content: string) {
  const match = content.match(/#[\w-]+/);
  return match?.[0];
}

function formatRelativeTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 60) return `${Math.max(minutes, 1)}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

function mapPost(post: ApiPost): FeedPost {
  const name = post.author?.name ?? "Unknown";
  const screenName = post.author?.screen_name;
  return {
    id: post.id,
    name,
    handle: `@${screenName?.replace(/^@/, "")}`,
    time: formatRelativeTime(post.created_at),
    content: post.content,
    tag: extractTag(post.content),
    accent: hashAccent(name),
    replies: post.comment_count ?? 0,
    likes: post.likes ?? 0,
    avatarUrl: post.author?.avatar_url ?? null,
    createdAt: post.created_at,
  };
}

function MessageIcon() {
  return (
    <svg
      aria-hidden
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg
      aria-hidden
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6-5.4-2.9-5.4 2.9 1-6-4.4-4.3 6.1-.9z" />
    </svg>
  );
}

export default function FeedStream() {
  const [items, setItems] = useState<FeedPost[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        sort: "new",
        limit: String(PAGE_SIZE),
      });
      if (cursor) params.set("cursor", cursor);
      const response = await fetch(`/api/v1/posts?${params.toString()}`);
      const payload = (await response.json().catch(() => null)) as {
        success?: boolean;
        data?: { posts?: ApiPost[] };
        error?: { message?: string };
      } | null;

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error?.message || "Failed to load feed.");
      }

      const nextPosts = (payload.data?.posts ?? []).map(mapPost);
      setItems((prev) => [...prev, ...nextPosts]);
      const nextCursor =
        nextPosts.length > 0
          ? (nextPosts[nextPosts.length - 1]?.createdAt ?? null)
          : null;
      setCursor(nextCursor);
      if (nextPosts.length < PAGE_SIZE) {
        setHasMore(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load feed.");
    } finally {
      setLoading(false);
    }
  }, [cursor, hasMore, loading]);

  useEffect(() => {
    loadMore();
  }, [loadMore]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "240px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMore]);

  const actionItems = useMemo(
    () => [
      { label: "Replies", icon: <MessageIcon /> },
      { label: "Likes", icon: <StarIcon /> },
    ],
    [],
  );

  return (
    <div className="space-y-4 pb-10">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/65">
        Read-only preview. This stream refreshes continuously and does not
        require login.
      </div>

      {error && (
        <div className="rounded-2xl border border-white/10 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {items.map((post, index) => (
          <Link key={post.id} href={`/posts/${post.id}`} className="block">
            <article
              className="feed-card group rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur transition-all hover:border-white/20 hover:bg-white/10"
              style={
                { "--delay": `${Math.min(index, 6) * 0.06}s` } as CSSProperties
              }
            >
              <div className="flex gap-4">
                {post.avatarUrl ? (
                  <img
                    alt={post.name}
                    className="h-12 w-12 shrink-0 rounded-full object-cover"
                    src={post.avatarUrl}
                  />
                ) : (
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-black"
                    style={{ backgroundColor: post.accent }}
                  >
                    {post.name.slice(0, 2)}
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-white">
                      {post.name}
                    </p>
                    <span className="text-xs text-white/50">{post.handle}</span>
                    {post.time ? (
                      <span className="text-xs text-white/40">
                        · {post.time}
                      </span>
                    ) : null}
                    {post.tag ? (
                      <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-white/50">
                        {post.tag}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-white/80">
                    {post.content}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-6 text-xs text-white/40">
                    <div className="flex items-center gap-1.5 transition-colors group-hover:text-white/60">
                      {actionItems[0]?.icon}
                      <span>{post.replies}</span>
                    </div>
                    <div className="flex items-center gap-1.5 transition-colors group-hover:text-white/60">
                      {actionItems[1]?.icon}
                      <span>{post.likes}</span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>

      <div ref={sentinelRef} className="flex flex-col items-center gap-3 py-6">
        <div className="text-xs uppercase tracking-[0.3em] text-white/40">
          {loading
            ? "Loading more"
            : hasMore
              ? "Scroll for more"
              : "You are all caught up"}
        </div>
        <button
          className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/70 transition hover:border-white/60 disabled:opacity-50"
          disabled={loading || !hasMore}
          onClick={loadMore}
          type="button"
        >
          {loading ? "Loading..." : hasMore ? "Load more" : "No more posts"}
        </button>
      </div>
    </div>
  );
}
