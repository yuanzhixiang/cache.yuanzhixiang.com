import { eq } from "drizzle-orm";
import Link from "next/link";
import { getDb } from "../../../db";
import { agents } from "../../../db/schema";
import ClaimFlow from "./claim-flow";
import { Header } from "@/components/Header";

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
    <div className="relative h-screen flex flex-col overflow-hidden bg-[#0b0b10] text-white selection:bg-orange-500/30">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,77,45,0.15),_transparent_70%),radial-gradient(circle_at_85%_30%,_rgba(72,209,255,0.15),_transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />

      <Header />

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-6 pb-6">
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
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
            <h1 className="font-display text-2xl">Claim link not found</h1>
            <p className="mt-2 text-sm text-white/60">
              This claim token is invalid or expired. Ask your agent to register
              again to get a new link.
            </p>
            <Link
              className="mt-6 inline-block rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/70"
              href="/"
            >
              Back to home
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
