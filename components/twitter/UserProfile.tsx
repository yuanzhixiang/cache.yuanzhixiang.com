"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ReplyIcon,
  RepostIcon,
  LikeIcon,
  ViewIcon,
  ShareIcon,
  MoreIcon,
  MailIcon,
  LocationIcon,
} from "./Icons";
import { Avatar } from "./Avatar";

// Calendar icon for joined date
const CalendarIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    fill="currentColor"
  >
    <g>
      <path d="M7 4V3h2v1h6V3h2v1h1.5C19.89 4 21 5.12 21 6.5v12c0 1.38-1.11 2.5-2.5 2.5h-13C4.12 21 3 19.88 3 18.5v-12C3 5.12 4.12 4 5.5 4H7zm0 2H5.5c-.27 0-.5.22-.5.5v12c0 .28.23.5.5.5h13c.28 0 .5-.22.5-.5v-12c0-.28-.22-.5-.5-.5H17v1h-2V6H9v1H7V6zm0 6h2v-2H7v2zm0 4h2v-2H7v2zm4-4h2v-2h-2v2zm0 4h2v-2h-2v2zm4-4h2v-2h-2v2z"></path>
    </g>
  </svg>
);

// Link icon
const LinkIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    fill="currentColor"
  >
    <g>
      <path d="M18.36 5.64c-1.95-1.96-5.11-1.96-7.07 0L9.88 7.05 8.46 5.64l1.42-1.42c2.73-2.73 7.16-2.73 9.9 0 2.73 2.74 2.73 7.17 0 9.9l-1.42 1.42-1.41-1.42 1.41-1.41c1.96-1.96 1.96-5.12 0-7.07zm-2.12 3.53l-7.07 7.07-1.41-1.41 7.07-7.07 1.41 1.41zm-12.02.71l1.42-1.42 1.41 1.42-1.41 1.41c-1.96 1.96-1.96 5.12 0 7.07 1.95 1.96 5.11 1.96 7.07 0l1.41-1.41 1.42 1.41-1.42 1.42c-2.73 2.73-7.16 2.73-9.9 0-2.73-2.74-2.73-7.17 0-9.9z"></path>
    </g>
  </svg>
);

// Back Arrow Icon
const ArrowLeftIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    fill="currentColor"
  >
    <g>
      <path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path>
    </g>
  </svg>
);

// Pinned Icon
const PinnedIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    fill="currentColor"
  >
    <g>
      <path d="M16 12c0 2.209-4.03 6-4 6s-4-3.791-4-6V7l-2-2h12l-2 2v5zm4 7H4v1.5h16V19z"></path>
    </g>
  </svg>
);

type ProfileUser = {
  id: string;
  name: string;
  handle: string;
  description: string;
  location?: string;
  website?: string;
  joinedAt: string;
  following: number;
  followers: number;
  avatarUrl: string | null;
  bannerUrl?: string | null;
  accent: string;
  postsCount: number;
};

type ProfilePost = {
  id: string;
  content: string;
  replies: number;
  likes: number;
  createdAt: string;
  views?: number;
  isPinned?: boolean;
};

function formatJoinDate(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();
  return `Joined ${month} ${year}`;
}

function formatRelativeTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const diffMs = Date.now() - date.getTime();
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  return `${days}d`;
}

function formatActionCount(value?: number) {
  if (!value) return "";
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function UserProfile({
  user,
  posts,
  replies,
}: {
  user: ProfileUser;
  posts: ProfilePost[];
  replies: ProfilePost[];
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"Posts" | "Replies">("Posts");
  const tabs = ["Posts", "Replies"] as const;
  const isPostsTab = activeTab === "Posts";
  const activePinnedPost =
    isPostsTab && posts.length > 0 && posts[0].isPinned ? posts[0] : null;
  const visiblePosts = isPostsTab
    ? posts.slice(activePinnedPost ? 1 : 0)
    : replies;

  return (
    <div className="flex flex-col min-h-screen text-white bg-black">
      {/* Sticky Header */}
      <div
        className="sticky top-0 z-20 flex h-[53px] items-center gap-6 bg-black/65 px-4 backdrop-blur-md cursor-pointer"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.back();
          }}
          className="rounded-full p-2 transition-colors hover:bg-white/10"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <div className="flex flex-col">
          <span className="text-xl font-bold leading-5">{user.name}</span>
          <span className="text-[13px] text-[#71767b]">
            {user.postsCount} posts
          </span>
        </div>
      </div>

      {/* Hero / Cover */}
      <div className="relative">
        {/* Banner */}
        <div
          className="h-[200px] w-full bg-[#1da1f2]"
          style={{
            backgroundImage: user.bannerUrl
              ? `url(${user.bannerUrl})`
              : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundColor: user.bannerUrl ? "transparent" : "#1da1f2", // Fallback color
          }}
        >
          {/* If no banner, maybe a default gradient or color */}
          {!user.bannerUrl && (
            <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-50"></div>
          )}
        </div>

        {/* Start of Profile Info Section - Overlapping Banner */}
        <div className="px-4 pb-3">
          <div className="flex justify-between items-end -mt-[75px] mb-3">
            {/* Avatar */}
            <div className="relative rounded-full border-4 border-black bg-black">
              <Avatar
                name={user.name}
                avatarUrl={user.avatarUrl}
                accent={user.accent}
                className="h-[134px] w-[134px]"
                textClassName="text-5xl"
              />
            </div>
          </div>

          {/* User Details */}
          <div className="mt-2">
            <div className="flex flex-col">
              <div className="flex items-center gap-1 text-[20px] font-extrabold leading-6 text-white">
                {user.name}
              </div>
              <div className="text-[15px] text-[#71767b]">{user.handle}</div>
            </div>

            {/* Bio */}
            <div className="mt-3 text-[15px] leading-5 text-white whitespace-pre-wrap">
              {user.description || "No bio yet."}
            </div>

            {/* Metadata Row */}
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[15px] text-[#71767b]">
              {user.website && (
                <div className="flex items-center gap-1">
                  <LinkIcon className="h-[18px] w-[18px]" />
                  <a
                    href={user.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1d9bf0] hover:underline truncate max-w-[200px]"
                  >
                    {user.website.replace(/^https?:\/\//, "")}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-1">
                <CalendarIcon className="h-[18px] w-[18px]" />
                <span>{formatJoinDate(user.joinedAt)}</span>
              </div>
            </div>

            {/* Follow Counts */}
            <div className="mt-3 flex gap-5 text-[15px]">
              <div className="flex items-center gap-1 hover:underline cursor-pointer">
                <span className="font-bold text-white">{user.following}</span>
                <span className="text-[#71767b]">Following</span>
              </div>
              <div className="flex items-center gap-1 hover:underline cursor-pointer">
                <span className="font-bold text-white">
                  {new Intl.NumberFormat("en-US", {
                    notation: "compact",
                    maximumFractionDigits: 1,
                  }).format(user.followers)}
                </span>
                <span className="text-[#71767b]">Followers</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-3 flex border-b border-white/20">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="relative flex h-[53px] flex-1 items-center justify-center hover:bg-white/10 transition-colors"
              >
                <span
                  className={`text-[15px] font-bold ${activeTab === tab ? "text-white" : "text-[#71767b]"}`}
                >
                  {tab}
                </span>
                {activeTab === tab && (
                  <div className="absolute bottom-0 h-[4px] w-[56px] rounded-full bg-[#1d9bf0]" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Feed Area */}
      <div>
        {/* Pinned Post (Mock if 1st post is pinned) */}
        {activePinnedPost && (
          <div
            className="border-b border-white/20 px-4 py-3 hover:bg-white/[0.03] cursor-pointer"
            onClick={() => router.push(`/posts/${activePinnedPost.id}`)}
          >
            <div className="mb-1 ml-4 flex items-center gap-2 text-[13px] font-bold text-[#71767b]">
              <PinnedIcon className="h-4 w-4 fill-[#71767b]" />
              <span>Pinned</span>
            </div>
            {/* Reuse Post rendering logic largely, but simplified here for compactness */}
            <div className="flex gap-3">
              <Avatar
                name={user.name}
                avatarUrl={user.avatarUrl}
                accent={user.accent}
                className="h-10 w-10 min-w-[2.5rem]"
              />
              <div className="flex flex-col w-full">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[15px] text-[#71767b]">
                    <span className="font-bold text-white">{user.name}</span>
                    <svg
                      viewBox="0 0 24 24"
                      aria-label="Verified account"
                      className="h-[16px] w-[16px] fill-[#f9bc06]"
                    >
                      <g>
                        <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.27 3.91.81c.67 1.31 1.92 2.19 3.35 2.19s2.68-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z"></path>
                      </g>
                    </svg>
                    <span>{user.handle}</span>
                    <span>·</span>
                    <span>
                      {formatRelativeTime(activePinnedPost.createdAt)}
                    </span>
                  </div>
                  <MoreIcon className="h-5 w-5 text-[#71767b]" />
                </div>
                <div className="text-[15px] leading-5 text-white whitespace-pre-wrap mt-1">
                  {activePinnedPost.content}
                </div>
                {/* Actions */}
                <div
                  className="mt-2 flex max-w-[425px] justify-between text-[#71767b]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button className="group flex items-center gap-1.5 hover:text-[#1d9bf0]">
                    <div className="p-2 rounded-full group-hover:bg-[#1d9bf0]/10">
                      <ReplyIcon className="h-4 w-4" />
                    </div>{" "}
                    <span className="text-[13px]">
                      {activePinnedPost.replies || ""}
                    </span>
                  </button>
                  <button className="group flex items-center gap-1.5 hover:text-[#00ba7c]">
                    <div className="p-2 rounded-full group-hover:bg-[#00ba7c]/10">
                      <RepostIcon className="h-4 w-4" />
                    </div>
                  </button>
                  <button className="group flex items-center gap-1.5 hover:text-[#f91880]">
                    <div className="p-2 rounded-full group-hover:bg-[#f91880]/10">
                      <LikeIcon className="h-4 w-4" />
                    </div>{" "}
                    <span className="text-[13px]">
                      {activePinnedPost.likes || ""}
                    </span>
                  </button>
                  <button className="group flex items-center gap-1.5 hover:text-[#1d9bf0]">
                    <div className="p-2 rounded-full group-hover:bg-[#1d9bf0]/10">
                      <ViewIcon className="h-4 w-4" />
                    </div>
                    <span className="text-[13px]">
                      {formatActionCount(activePinnedPost.views)}
                    </span>
                  </button>
                  <button className="group flex items-center gap-1.5 hover:text-[#1d9bf0]">
                    <div className="p-2 rounded-full group-hover:bg-[#1d9bf0]/10">
                      <ShareIcon className="h-4 w-4" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other Posts */}
        {visiblePosts.map((post) => (
          <div
            key={post.id}
            className="border-b border-white/20 px-4 py-3 hover:bg-white/[0.03] cursor-pointer"
            onClick={() => router.push(`/posts/${post.id}`)}
          >
            <div className="flex gap-3">
                <Avatar
                  name={user.name}
                  avatarUrl={user.avatarUrl}
                  accent={user.accent}
                  className="h-10 w-10 min-w-[2.5rem]"
                />
              <div className="flex flex-col w-full">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[15px] text-[#71767b]">
                    <span className="font-bold text-white">{user.name}</span>
                    <svg
                      viewBox="0 0 24 24"
                      aria-label="Verified account"
                      className="h-[16px] w-[16px] fill-[#f9bc06]"
                    >
                      <g>
                        <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.27 3.91.81c.67 1.31 1.92 2.19 3.35 2.19s2.68-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z"></path>
                      </g>
                    </svg>
                    <span>{user.handle}</span>
                    <span>·</span>
                    <span>{formatRelativeTime(post.createdAt)}</span>
                  </div>
                  <MoreIcon className="h-5 w-5 text-[#71767b]" />
                </div>
                <div className="text-[15px] leading-5 text-white whitespace-pre-wrap mt-1">
                  {post.content}
                </div>
                {/* Actions */}
                <div
                  className="mt-2 flex max-w-[425px] justify-between text-[#71767b]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button className="group flex items-center gap-1.5 hover:text-[#1d9bf0]">
                    <div className="p-2 rounded-full group-hover:bg-[#1d9bf0]/10">
                      <ReplyIcon className="h-4 w-4" />
                    </div>{" "}
                    <span className="text-[13px]">{post.replies || ""}</span>
                  </button>
                  <button className="group flex items-center gap-1.5 hover:text-[#00ba7c]">
                    <div className="p-2 rounded-full group-hover:bg-[#00ba7c]/10">
                      <RepostIcon className="h-4 w-4" />
                    </div>
                  </button>
                  <button className="group flex items-center gap-1.5 hover:text-[#f91880]">
                    <div className="p-2 rounded-full group-hover:bg-[#f91880]/10">
                      <LikeIcon className="h-4 w-4" />
                    </div>{" "}
                    <span className="text-[13px]">{post.likes || ""}</span>
                  </button>
                  <button className="group flex items-center gap-1.5 hover:text-[#1d9bf0]">
                    <div className="p-2 rounded-full group-hover:bg-[#1d9bf0]/10">
                      <ViewIcon className="h-4 w-4" />
                    </div>
                    <span className="text-[13px]">
                      {formatActionCount(post.views)}
                    </span>
                  </button>
                  <button className="group flex items-center gap-1.5 hover:text-[#1d9bf0]">
                    <div className="p-2 rounded-full group-hover:bg-[#1d9bf0]/10">
                      <ShareIcon className="h-4 w-4" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
