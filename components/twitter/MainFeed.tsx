"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { useCallback, useEffect, useState, useRef } from "react";
import {
  MediaIcon,
  GifIcon,
  PollIcon,
  EmojiIcon,
  ScheduleIcon,
  LocationIcon,
  ReplyIcon,
  RepostIcon,
  LikeIcon,
  ViewIcon,
  BookmarkIcon,
  ShareIcon,
} from "./Icons";

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

export function MainFeed() {
  const [items, setItems] = useState<FeedPost[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [activeTab, setActiveTab] = useState<"For you" | "Following">(
    "For you",
  );
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
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
      console.error(err);
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

  return (
    <main className="flex min-h-screen w-full max-w-[600px] flex-col border-x border-white/20 text-white">
      {/* Sticky Header with Tabs */}
      <div className="sticky top-0 z-20 w-full bg-black/65 backdrop-blur-md">
        <div className="flex w-full border-b border-white/20">
          <button
            onClick={() => setActiveTab("For you")}
            className="relative flex h-[53px] flex-1 items-center justify-center transition-colors hover:bg-white/10"
          >
            <span
              className={`text-[15px] font-bold ${activeTab === "For you" ? "text-white" : "text-[#71767b]"}`}
            >
              For you
            </span>
            {activeTab === "For you" && (
              <div className="absolute bottom-0 h-[4px] w-[56px] rounded-full bg-[#1d9bf0]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("Following")}
            className="relative flex h-[53px] flex-1 items-center justify-center transition-colors hover:bg-white/10"
          >
            <span
              className={`text-[15px] font-bold ${activeTab === "Following" ? "text-white" : "text-[#71767b]"}`}
            >
              Following
            </span>
            {activeTab === "Following" && (
              <div className="absolute bottom-0 h-[4px] w-[70px] rounded-full bg-[#1d9bf0]" />
            )}
          </button>
        </div>
      </div>

      {/* Post Composer */}
      <div className="flex border-b border-white/20 px-4 py-3">
        <div className="mr-3 h-10 w-10 shrink-0">
          <img
            src="https://media.theresanaiforthat.com/featured-on-taaft.png?width=100"
            alt="User"
            className="h-full w-full rounded-full object-cover bg-neutral-800"
          />
        </div>
        <div className="flex flex-1 flex-col pt-2">
          <textarea
            placeholder="What is happening?!"
            className="mb-3 w-full resize-none bg-transparent text-xl text-white placeholder-[#71767b] outline-none"
            rows={2}
          />
          <div className="flex items-center justify-between border-t border-white/20 pt-3">
            <div className="flex items-center gap-1 text-[#1d9bf0]">
              <div className="rounded-full p-2 transition-colors hover:bg-[#1d9bf0]/10 cursor-pointer">
                <MediaIcon className="h-5 w-5" />
              </div>
              <div className="rounded-full p-2 transition-colors hover:bg-[#1d9bf0]/10 cursor-pointer">
                <GifIcon className="h-5 w-5" />
              </div>
              <div className="rounded-full p-2 transition-colors hover:bg-[#1d9bf0]/10 cursor-pointer hidden sm:block">
                <PollIcon className="h-5 w-5" />
              </div>
              <div className="rounded-full p-2 transition-colors hover:bg-[#1d9bf0]/10 cursor-pointer">
                <EmojiIcon className="h-5 w-5" />
              </div>
              <div className="rounded-full p-2 transition-colors hover:bg-[#1d9bf0]/10 cursor-pointer hidden sm:block">
                <ScheduleIcon className="h-5 w-5" />
              </div>
              <div className="rounded-full p-2 transition-colors hover:bg-[#1d9bf0]/10 cursor-pointer opacity-50">
                <LocationIcon className="h-5 w-5" />
              </div>
            </div>
            <button className="rounded-full bg-[#1d9bf0] px-4 py-1.5 text-[15px] font-bold text-white transition-opacity hover:bg-[#1a8cd8] disabled:opacity-50">
              Post
            </button>
          </div>
        </div>
      </div>

      {/* Feed Items */}
      <div className="flex flex-col">
        {items.map((post) => (
          <Tweet key={post.id} post={post} />
        ))}
        {/* Helper for infinite scroll */}
        <div ref={sentinelRef} className="h-20 w-full" />
      </div>
    </main>
  );
}

function Tweet({ post }: { post: FeedPost }) {
  return (
    <article className="cursor-pointer border-b border-white/20 px-4 py-3 transition-colors hover:bg-white/[0.03]">
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="shrink-0">
          {post.avatarUrl ? (
            <img
              src={post.avatarUrl}
              alt={post.name}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-black"
              style={{ backgroundColor: post.accent }}
            >
              {post.name.slice(0, 1)}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-[15px] leading-5">
              <span className="font-bold text-white hover:underline">
                {post.name}
              </span>
              <span className="text-[#71767b]">{post.handle}</span>
              <span className="text-[#71767b]">·</span>
              <span className="text-[#71767b] hover:underline">
                {post.time}
              </span>
            </div>
            <div className="text-[#71767b] hover:bg-[#1d9bf0]/10 p-1 rounded-full bg-transparent transition-colors">
              <span className="font-bold">···</span>
            </div>
          </div>

          {/* Post Text */}
          <div className="mt-0.5 text-[15px] leading-5 text-white whitespace-pre-wrap">
            {post.content} <span className="text-[#1d9bf0]">{post.tag}</span>
          </div>

          {/* Actions */}
          <div className="mt-3 flex max-w-[425px] justify-between text-[#71767b]">
            {/* Reply */}
            <div className="group flex items-center gap-2 transition-colors hover:text-[#1d9bf0]">
              <div className="rounded-full p-2 group-hover:bg-[#1d9bf0]/10">
                <ReplyIcon className="h-[1.15rem] w-[1.15rem]" />
              </div>
              <span className="text-[13px] group-hover:text-[#1d9bf0]">
                {post.replies || ""}
              </span>
            </div>
            {/* Repost */}
            <div className="group flex items-center gap-2 transition-colors hover:text-[#00ba7c]">
              <div className="rounded-full p-2 group-hover:bg-[#00ba7c]/10">
                <RepostIcon className="h-[1.15rem] w-[1.15rem]" />
              </div>
            </div>
            {/* Like */}
            <div className="group flex items-center gap-2 transition-colors hover:text-[#f91880]">
              <div className="rounded-full p-2 group-hover:bg-[#f91880]/10">
                <LikeIcon className="h-[1.15rem] w-[1.15rem]" />
              </div>
              <span className="text-[13px] group-hover:text-[#f91880]">
                {post.likes || ""}
              </span>
            </div>
            {/* View */}
            <div className="group flex items-center gap-2 transition-colors hover:text-[#1d9bf0]">
              <div className="rounded-full p-2 group-hover:bg-[#1d9bf0]/10">
                <ViewIcon className="h-[1.15rem] w-[1.15rem]" />
              </div>
            </div>
            {/* Share */}
            <div className="group flex items-center gap-2 transition-colors hover:text-[#1d9bf0]">
              <div className="rounded-full p-2 group-hover:bg-[#1d9bf0]/10">
                <ShareIcon className="h-[1.15rem] w-[1.15rem]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
