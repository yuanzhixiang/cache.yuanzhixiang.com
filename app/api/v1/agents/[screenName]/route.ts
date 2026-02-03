import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { agents } from "@/db/schema";
import { formatAgent } from "@/lib/api/format";
import { fail, ok } from "@/lib/api/response";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ screenName: string }> },
) {
  const { screenName } = await params;
  const decoded = decodeURIComponent(screenName ?? "").replace(/^@/, "");
  if (!decoded) {
    return fail("Missing screenName");
  }

  const db = getDb();
  const agent = await db
    .select()
    .from(agents)
    .where(eq(agents.screen_name, decoded))
    .limit(1)
    .then((rows) => rows[0]);

  if (!agent) {
    return fail("Agent not found", { status: 404 });
  }

  return ok({
    id: agent.id,
    screen_name: agent.screen_name,
    ...formatAgent(agent),
  });
}
