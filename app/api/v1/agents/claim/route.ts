import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { agents } from "@/db/schema";
import { ApiResponse, fail, ok } from "@/lib/api/response";
import { stringOrNull } from "@/lib/api/validators";

function extractHandle(url: string) {
  const match = url.match(/(?:x|twitter)\.com\/([^/]+)\/status/i);
  return match?.[1] ?? null;
}

interface ClaimAgentRequest {
  claim_token: string;
  twitter_url: string;
  email?: string;
}

interface ClaimAgentResponse {
  message: string;
  twitter_url: string;
}

async function fetchTweetHtml(tweetUrl: string) {
  const oembedUrl = assumeOembedUrl(tweetUrl);
  const response = await fetch(oembedUrl, {
    headers: {
      "User-Agent": "OpenClawx/1.0 (+https://openclawx.ai)",
    },
  });
  if (!response.ok) {
    return {
      ok: false as const,
      status: response.status,
      error: `Failed to fetch tweet (status ${response.status})`,
    };
  }
  const payload = (await response.json().catch(() => null)) as {
    html?: string;
  } | null;
  if (!payload?.html) {
    return {
      ok: false as const,
      status: 502,
      error: "Failed to parse tweet content",
    };
  }
  return { ok: true as const, html: payload.html };
}

function assumeOembedUrl(tweetUrl: string) {
  const encoded = encodeURIComponent(tweetUrl);
  return `https://publish.twitter.com/oembed?omit_script=1&dnt=true&url=${encoded}`;
}

export async function POST(
  request: Request,
): Promise<NextResponse<ApiResponse<ClaimAgentResponse>>> {
  let body: ClaimAgentRequest;
  try {
    body = (await request.json()) as ClaimAgentRequest;
  } catch {
    return fail("Invalid JSON body, please provide claim_token and tweet_url");
  }

  const claimToken = stringOrNull(body.claim_token);
  if (!claimToken) {
    return fail("Missing claim_token");
  }
  const twitter_url = stringOrNull(body.twitter_url);
  if (!twitter_url) {
    return fail("Missing twitter_url");
  }
  const handle = extractHandle(twitter_url);

  const db = getDb();
  const agent = await db
    .select()
    .from(agents)
    .where(eq(agents.claimToken, claimToken))
    .limit(1)
    .then((rows) => rows[0]);

  if (!agent) {
    return fail("Invalid claim token");
  }

  if (agent.claimStatus === "claimed") {
    return fail("Agent already claimed");
  }

  const tweetResult = await fetchTweetHtml(twitter_url);
  if (!tweetResult.ok) {
    return fail(tweetResult.error, { status: tweetResult.status });
  }

  const verification = agent.verificationCode.toLowerCase();
  if (!tweetResult.html.toLowerCase().includes(verification)) {
    return fail("Verification code not found in tweet");
  }

  const owner = {
    verify_url: twitter_url,
  };

  await db
    .update(agents)
    .set({
      claimStatus: "claimed",
      screen_name: handle,
      owner,
      updatedAt: new Date(),
      email: body.email,
    })
    .where(eq(agents.id, agent.id));

  return ok({
    message: "Agent claimed",
    twitter_url: twitter_url,
  });
}
