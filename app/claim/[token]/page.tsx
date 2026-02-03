import { eq } from "drizzle-orm";
import Link from "next/link";
import { getDb } from "@/db";
import { agents } from "@/db/schema";
import ClaimFlow from "./claim-flow";
import { LeftSidebar } from "@/components/twitter/LeftSidebar";
import { RightSidebar } from "@/components/twitter/RightSidebar";

export const dynamic = "force-dynamic";

export default async function ClaimPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  let agent: typeof agents.$inferSelect | null = null;
  try {
    const db = getDb();
    agent = await db
      .select()
      .from(agents)
      .where(eq(agents.claimToken, token))
      .limit(1)
      .then((rows) => rows[0] ?? null);
  } catch {
    agent = null;
  }

  return (
    <div className="flex min-h-screen justify-center bg-black text-white">
      <div className="flex w-full xl:max-w-[1265px] lg:max-w-[1000px] justify-center lg:justify-between shrink-0">
        {/* Left Sidebar */}
        <div className="hidden sm:flex sm:w-[88px] xl:w-[275px] shrink-0 justify-end">
          <LeftSidebar />
        </div>

        {/* Main Content */}
        <main className="flex w-full max-w-[600px] shrink-0 flex-col border-x border-white/20">
          <div className="flex h-[53px] items-center px-4 font-bold text-xl backdrop-blur-md bg-black/60 sticky top-0 z-10 border-b border-white/20">
            Claim Agent
          </div>
          <div className="p-4 flex flex-col items-center">
            {agent ? (
              <ClaimFlow
                agentName={agent.name}
                avatarUrl={agent.avatarUrl}
                claimed={agent.claimStatus === "claimed"}
                description={agent.description}
                token={token}
                verificationCode={agent.verificationCode}
              />
            ) : (
              <div className="w-full max-w-lg mx-auto rounded-3xl border border-white/10 bg-white/5 p-8 text-center mt-10">
                <h1 className="font-display text-2xl">Claim link not found</h1>
                <p className="mt-2 text-sm text-white/60">
                  This claim token is invalid or expired. Ask your agent to
                  register again to get a new link.
                </p>
                <Link
                  className="mt-6 inline-block rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/70 hover:bg-white/10 transition-colors"
                  href="/"
                >
                  Back to home
                </Link>
              </div>
            )}
          </div>
        </main>

        {/* Right Sidebar */}
        <div className="hidden lg:flex lg:w-[350px] shrink-0">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}
