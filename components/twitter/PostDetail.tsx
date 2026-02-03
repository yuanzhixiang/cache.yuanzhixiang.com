"use client";

import { useRouter } from "next/navigation";
import {
  ReplyIcon,
  RepostIcon,
  LikeIcon,
  ViewIcon,
  BookmarkIcon,
  ShareIcon,
  MoreIcon,
} from "./Icons";
import { useState } from "react";

type DetailPost = {
  id: string;
  name: string;
  handle: string;
  content: string;
  createdAt: string;
  likes: number;
  replies: number;
  avatarUrl: string | null;
  accent: string;
};

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

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date
    .toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    .replace(",", " ·");
}

export function PostDetail({
  post,
  replies,
}: {
  post: DetailPost;
  replies: DetailPost[];
}) {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen text-white">
      {/* Header */}
      <div className="sticky top-0 z-20 flex h-[53px] items-center gap-6 bg-black/65 px-4 backdrop-blur-md">
        <button
          onClick={() => router.back()}
          className="rounded-full p-2 transition-colors hover:bg-white/10"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <span className="text-xl font-bold">Post</span>
      </div>

      <div className="px-4 pt-3">
        {/* Author Info */}
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            {post.avatarUrl ? (
              <img
                src={post.avatarUrl}
                alt={post.name}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-black"
                style={{ backgroundColor: post.accent }}
              >
                {post.name.slice(0, 1)}
              </div>
            )}
            <div className="flex flex-col">
              <div className="flex items-center gap-1 font-bold text-white">
                {post.name}
              </div>
              <div className="text-[15px] text-[#71767b]">{post.handle}</div>
            </div>
          </div>
        </div>

        {/* Post Content */}
        <div className="mt-3 text-[17px] leading-6 text-white whitespace-pre-wrap">
          {post.content}
        </div>

        {/* Date */}
        <div className="mt-4 border-b border-white/20 pb-3 text-[15px] text-[#71767b]">
          {formatDateTime(post.createdAt)}
        </div>

        {/* Stats (if available, e.g. views) can go here. For now just spacing. */}
        {/* Action Buttons */}
        <div className="flex justify-between border-b border-white/20 py-1 px-2">
          <button className="group flex items-center gap-2 p-2 rounded-full transition-colors hover:bg-[#1d9bf0]/10 text-[#71767b]">
            <ReplyIcon className="h-5 w-5 group-hover:text-[#1d9bf0]" />
            <span className="text-[13px] group-hover:text-[#1d9bf0]">
              {post.replies > 0 ? post.replies : ""}
            </span>
          </button>
          <button className="group flex items-center gap-2 p-2 rounded-full transition-colors hover:bg-[#00ba7c]/10 text-[#71767b]">
            <RepostIcon className="h-5 w-5 group-hover:text-[#00ba7c]" />
          </button>
          <button className="group flex items-center gap-2 p-2 rounded-full transition-colors hover:bg-[#f91880]/10 text-[#71767b]">
            <LikeIcon className="h-5 w-5 group-hover:text-[#f91880]" />
            <span className="text-[13px] group-hover:text-[#f91880]">
              {post.likes > 0 ? post.likes : ""}
            </span>
          </button>
          <button className="group flex items-center gap-2 p-2 rounded-full transition-colors hover:bg-[#1d9bf0]/10 text-[#71767b]">
            <BookmarkIcon className="h-5 w-5 group-hover:text-[#1d9bf0]" />
          </button>
        </div>

        {/* Replies List */}
        <div className="flex flex-col">
          {replies.map((reply) => (
            <article
              key={reply.id}
              onClick={() => router.push(`/posts/${reply.id}`)}
              className="cursor-pointer border-b border-white/20 px-4 py-3 transition-colors hover:bg-white/[0.03]"
            >
              {/* Simplified Reply View */}
              <div className="flex gap-3">
                {reply.avatarUrl ? (
                  <img
                    src={reply.avatarUrl}
                    alt={reply.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-black"
                    style={{ backgroundColor: reply.accent }}
                  >
                    {reply.name.slice(0, 1)}
                  </div>
                )}
                <div className="flex flex-col">
                  <div className="flex items-center gap-1 text-[15px] text-[#71767b]">
                    <span className="font-bold text-white">{reply.name}</span>
                    <span>{reply.handle}</span>
                    <span>·</span>
                    <span>{formatRelativeTime(reply.createdAt)}</span>
                  </div>
                  <div className="whitespace-pre-wrap text-[15px] text-white">
                    {reply.content}
                  </div>

                  {/* Actions */}
                  <div
                    className="mt-2 flex max-w-[425px] justify-between text-[#71767b]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Reply */}
                    <button className="group flex items-center gap-1.5 transition-colors hover:text-[#1d9bf0]">
                      <div className="rounded-full p-2 group-hover:bg-[#1d9bf0]/10">
                        <ReplyIcon className="h-[1.15rem] w-[1.15rem]" />
                      </div>
                      <span className="text-[13px] font-medium leading-4 group-hover:text-[#1d9bf0]">
                        {reply.replies > 0 && reply.replies}
                      </span>
                    </button>
                    {/* Repost */}
                    <button className="group flex items-center gap-1.5 transition-colors hover:text-[#00ba7c]">
                      <div className="rounded-full p-2 group-hover:bg-[#00ba7c]/10">
                        <RepostIcon className="h-[1.15rem] w-[1.15rem]" />
                      </div>
                    </button>
                    {/* Like */}
                    <button className="group flex items-center gap-1.5 transition-colors hover:text-[#f91880]">
                      <div className="rounded-full p-2 group-hover:bg-[#f91880]/10">
                        <LikeIcon className="h-[1.15rem] w-[1.15rem]" />
                      </div>
                      <span className="text-[13px] font-medium leading-4 group-hover:text-[#f91880]">
                        {reply.likes > 0 && reply.likes}
                      </span>
                    </button>
                    {/* View */}
                    <button className="group flex items-center gap-1.5 transition-colors hover:text-[#1d9bf0]">
                      <div className="rounded-full p-2 group-hover:bg-[#1d9bf0]/10">
                        <ViewIcon className="h-[1.15rem] w-[1.15rem]" />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
