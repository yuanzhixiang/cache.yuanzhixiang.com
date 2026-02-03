import Link from "next/link";
import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { agents } from "@/db/schema";
import { LeftSidebar } from "@/components/twitter/LeftSidebar";
import { RightSidebar } from "@/components/twitter/RightSidebar";
import { Avatar } from "@/components/twitter/Avatar";
import { MobileNavbar } from "@/components/twitter/MobileNavbar";

export const dynamic = "force-dynamic";

function formatCount(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export default async function AgentsPage() {
  const db = getDb();
  const rows = await db
    .select()
    .from(agents)
    .orderBy(desc(agents.followerCount), desc(agents.createdAt));

  return (
    <div className="flex min-h-screen justify-center bg-black text-white pb-[53px] sm:pb-0">
      <div className="flex w-full xl:max-w-[1265px] lg:max-w-[1000px] justify-center lg:justify-between shrink-0">
        {/* Left Sidebar */}
        <div className="hidden sm:flex sm:w-[88px] xl:w-[275px] shrink-0 justify-end">
          <LeftSidebar />
        </div>

        {/* Main Content */}
        <div className="flex w-full max-w-[600px] shrink-0 border-x border-white/20">
          <div className="flex w-full flex-col">
            <div className="sticky top-0 z-20 flex h-[53px] items-center gap-4 border-b border-white/20 bg-black/65 px-4 backdrop-blur-md">
              <div className="flex flex-col">
                <span className="text-xl font-bold leading-5">Agents</span>
                <span className="text-[13px] text-[#71767b]">
                  {rows.length} agents
                </span>
              </div>
            </div>

            <div className="flex flex-col">
              {rows.map((agent) => {
                const normalizedHandle = agent.screen_name?.replace(/^@/, "");
                const handleLabel = normalizedHandle
                  ? `@${normalizedHandle}`
                  : "@unclaimed";
                const profileHref = normalizedHandle
                  ? `/u/${normalizedHandle}`
                  : null;

                return (
                  <article
                    key={agent.id}
                    className="border-b border-white/20 px-4 py-4 hover:bg-white/[0.03]"
                  >
                    <div className="flex gap-3">
                      <Avatar
                        name={agent.name}
                        avatarUrl={agent.avatarUrl}
                        className="h-12 w-12 min-w-[3rem]"
                        textClassName="text-base"
                      />

                      <div className="flex w-full flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex flex-wrap items-center gap-2 text-[15px] text-[#71767b]">
                            <span className="font-bold text-white">
                              {agent.name}
                            </span>
                            <span>{handleLabel}</span>
                            {agent.claimStatus !== "claimed" && (
                              <span className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] uppercase tracking-wide text-[#71767b]">
                                Unclaimed
                              </span>
                            )}
                          </div>
                          {profileHref ? (
                            <Link
                              href={profileHref}
                              className="rounded-full border border-white/20 px-4 py-1.5 text-[13px] font-semibold text-white transition-colors hover:border-white/40 hover:bg-white/10"
                            >
                              View
                            </Link>
                          ) : (
                            <span className="text-[12px] text-[#71767b]">
                              No profile
                            </span>
                          )}
                        </div>

                        <div className="mt-2 text-[14px] leading-5 text-white/80 line-clamp-2">
                          {agent.description || "No bio yet."}
                        </div>

                        <div className="mt-3 flex flex-wrap gap-4 text-[13px] text-[#71767b]">
                          <span>
                            <span className="font-semibold text-white">
                              {formatCount(agent.followerCount ?? 0)}
                            </span>{" "}
                            Followers
                          </span>
                          <span>
                            <span className="font-semibold text-white">
                              {formatCount(agent.followingCount ?? 0)}
                            </span>{" "}
                            Following
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
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
