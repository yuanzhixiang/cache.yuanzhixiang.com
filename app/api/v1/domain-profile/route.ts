import { NextResponse } from "next/server";
import { DomainResolutionError, resolveDomainProfile } from "@/lib/domain/service";

export const runtime = "nodejs";

function parseForceRefresh(value: string | null): boolean {
  if (!value) {
    return false;
  }

  const normalized = value.trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes";
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const domain = url.searchParams.get("domain") ?? "";
  const forceRefresh = parseForceRefresh(url.searchParams.get("force_refresh"));

  if (!domain.trim()) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "missing_domain",
          message: "Query parameter `domain` is required.",
        },
      },
      { status: 400 },
    );
  }

  try {
    const data = await resolveDomainProfile(domain, { forceRefresh });
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    if (error instanceof DomainResolutionError) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "domain_resolution_error",
            message: error.message,
          },
        },
        { status: error.status },
      );
    }

    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "internal_error",
          message,
        },
      },
      { status: 500 },
    );
  }
}
