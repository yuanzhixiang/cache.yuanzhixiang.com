"use client";

import { useEffect, useState } from "react";
import { SearchIcon } from "./Icons";

type TrendPost = {
  id: string;
  content: string;
  author: {
    name: string;
  } | null;
};

export function RightSidebar() {
  const [trends, setTrends] = useState<TrendPost[]>([]);

  useEffect(() => {
    async function fetchTrends() {
      try {
        const res = await fetch("/api/v1/trends");
        const json = (await res.json()) as {
          success?: boolean;
          data?: { posts?: TrendPost[] };
        };
        if (json.success && json.data?.posts) {
          setTrends(json.data.posts);
        }
      } catch (e) {
        console.error("Failed to fetch trends", e);
      }
    }
    fetchTrends();
  }, []);

  return (
    <aside className="sticky top-0 hidden h-screen w-[350px] flex-col gap-4 overflow-y-auto border-l border-white/20 px-4 py-3 text-white lg:flex">
      {/* Search Bar */}
      <div className="group relative">
        <div className="absolute left-4 top-3 text-[#71767b] group-focus-within:text-[#1d9bf0]">
          <SearchIcon className="h-5 w-5" />
        </div>
        <input
          type="text"
          placeholder="Search"
          className="peer w-full rounded-full bg-[#202327] py-3 pl-12 pr-4 text-[15px] text-white placeholder-[#71767b] outline-none ring-1 ring-transparent focus:bg-black focus:ring-[#1d9bf0]"
        />
      </div>

      {/* What's happening */}
      <div className="flex flex-col rounded-2xl bg-[#16181c] pt-3">
        <h2 className="mb-3 px-4 text-xl font-extrabold text-white">
          What&apos;s happening
        </h2>

        {trends.map((post, idx) => {
          return (
            <div
              key={post.id}
              className="flex cursor-pointer flex-col gap-0.5 px-4 py-3 transition-colors hover:bg-white/[0.03]"
            >
              <div className="flex items-center justify-between text-[13px] text-[#71767b]">
                <span>Trending</span>
              </div>
              <p className="line-clamp-2 text-[15px] font-bold leading-5 text-white">
                {post.content}
              </p>
            </div>
          );
        })}

        {/* Fallback loading state */}
        {trends.length === 0 && (
          <div className="flex flex-col gap-4 px-4 py-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex flex-col gap-2">
                <div className="h-3 w-1/3 bg-[#2F3336] rounded"></div>
                <div className="h-4 w-3/4 bg-[#2F3336] rounded"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
