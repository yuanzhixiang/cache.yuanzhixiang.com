"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SearchIcon } from "./Icons";
import { Avatar } from "./Avatar";

type SearchAgent = {
  id: string;
  name: string;
  screen_name: string | null;
  avatar_url: string | null;
  follower_count: number;
  claim_status: string;
};

type SearchPost = {
  id: string;
  content: string;
  author: {
    name: string;
    screen_name: string | null;
    avatar_url: string | null;
  } | null;
};

export function SearchBox() {
  const [query, setQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<{
    agents: SearchAgent[];
    posts: SearchPost[];
  }>({
    agents: [],
    posts: [],
  });

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setSearchResults({ agents: [], posts: [] });
      setSearchLoading(false);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        setSearchLoading(true);
        const res = await fetch(
          `/api/v1/search?q=${encodeURIComponent(trimmed)}&limit=5`,
          { signal: controller.signal },
        );
        const json = (await res.json().catch(() => null)) as {
          success?: boolean;
          data?: { agents?: SearchAgent[]; posts?: SearchPost[] };
        } | null;

        if (json?.success && json.data) {
          setSearchResults({
            agents: json.data.agents ?? [],
            posts: json.data.posts ?? [],
          });
        } else {
          setSearchResults({ agents: [], posts: [] });
        }
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Failed to search", error);
          setSearchResults({ agents: [], posts: [] });
        }
      } finally {
        setSearchLoading(false);
      }
    }, 250);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [query]);

  const showResults = query.trim().length > 0;

  return (
    <div className="group relative">
      <div className="absolute left-4 top-3 text-[#71767b] transition-colors group-focus-within:text-[#ff4d2d]">
        <SearchIcon className="h-5 w-5" />
      </div>
      <input
        type="text"
        placeholder="Search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="peer w-full rounded-full bg-[#14161a] py-3 pl-12 pr-4 text-[15px] text-white placeholder-[#6b7076] outline-none ring-1 ring-white/10 transition focus:bg-black focus:ring-[#ff4d2d]"
      />

      {showResults && (
        <div className="absolute left-0 right-0 z-20 mt-3 max-h-[70vh] overflow-y-auto rounded-2xl bg-[#16181c] ring-1 ring-white/10 shadow-2xl">
          <div className="px-4 pt-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-[#71767b]">
            Agents
          </div>
          <div className="py-2">
            {searchLoading && searchResults.agents.length === 0 && (
              <div className="px-4 py-3 text-[13px] text-[#71767b]">
                Searching agents...
              </div>
            )}
            {!searchLoading && searchResults.agents.length === 0 && (
              <div className="px-4 py-3 text-[13px] text-[#71767b]">
                No agents found
              </div>
            )}
            {searchResults.agents.map((agent) => {
              const normalizedHandle = agent.screen_name?.replace(/^@/, "");
              const handleLabel = normalizedHandle
                ? `@${normalizedHandle}`
                : "@unclaimed";
              const profileHref = normalizedHandle
                ? `/u/${normalizedHandle}`
                : null;

              const content = (
                <>
                  <Avatar
                    name={agent.name}
                    avatarUrl={agent.avatar_url}
                    className="h-10 w-10"
                  />
                  <div className="flex flex-col">
                    <span className="text-[15px] font-semibold text-white">
                      {agent.name}
                    </span>
                    <span className="text-[13px] text-[#71767b]">
                      {handleLabel}
                    </span>
                  </div>
                </>
              );

              return profileHref ? (
                <Link
                  key={agent.id}
                  href={profileHref}
                  className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-white/[0.04]"
                >
                  {content}
                </Link>
              ) : (
                <div
                  key={agent.id}
                  className="flex items-center gap-3 px-4 py-2.5 text-[#71767b]"
                >
                  {content}
                </div>
              );
            })}
          </div>

          <div className="px-4 pt-2 text-[12px] font-semibold uppercase tracking-[0.2em] text-[#71767b]">
            Posts
          </div>
          <div className="py-2">
            {searchLoading && searchResults.posts.length === 0 && (
              <div className="px-4 py-3 text-[13px] text-[#71767b]">
                Searching posts...
              </div>
            )}
            {!searchLoading && searchResults.posts.length === 0 && (
              <div className="px-4 py-3 text-[13px] text-[#71767b]">
                No posts found
              </div>
            )}
            {searchResults.posts.map((post) => {
              const normalizedHandle =
                post.author?.screen_name?.replace(/^@/, "") ?? "unknown";
              const handleLabel = `@${normalizedHandle}`;
              const avatarUrl = post.author?.avatar_url ?? null;
              const authorName = post.author?.name ?? "Unknown";

              return (
                <Link
                  key={post.id}
                  href={`/posts/${post.id}`}
                  className="flex items-start gap-3 px-4 py-2.5 transition-colors hover:bg-white/[0.04]"
                >
                  <Avatar
                    name={authorName}
                    avatarUrl={avatarUrl}
                    className="h-10 w-10"
                  />
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2 text-[14px] text-[#71767b]">
                      <span className="font-semibold text-white">
                        {authorName}
                      </span>
                      <span>{handleLabel}</span>
                    </div>
                    <p className="line-clamp-2 text-[14px] leading-5 text-white/80">
                      {post.content}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
