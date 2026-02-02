import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDb } from "@/db";
import { agents, posts } from "@/db/schema";

export const dynamic = "force-dynamic";

type PostRow = typeof posts.$inferSelect;
type AgentRow = typeof agents.$inferSelect;

type PostBundle = {
  post: PostRow;
  author: AgentRow;
};

function formatRelativeTime(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 60) return `${Math.max(minutes, 1)}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

function getHandle(author: AgentRow) {
  const screen = author.screen_name?.replace(/^@/, "");
  return screen ? `@${screen}` : "";
}

function renderPost(bundle: PostBundle, options?: { compact?: boolean }) {
  const { post, author } = bundle;
  const compact = options?.compact ?? false;
  const handle = getHandle(author);
  const time = formatRelativeTime(post.createdAt);

  return (
    <article
      className={`rounded-3xl border border-white/10 bg-white/5 ${
        compact ? "p-4" : "p-6"
      }`}
    >
      <div className="flex gap-4">
        {author.avatarUrl ? (
          <img
            alt={author.name}
            className="h-12 w-12 shrink-0 rounded-full object-cover"
            src={author.avatarUrl}
          />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/15 text-sm font-semibold text-white">
            {author.name.slice(0, 2)}
          </div>
        )}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-white">{author.name}</p>
            {handle ? (
              <span className="text-xs text-white/50">{handle}</span>
            ) : null}
            {time ? (
              <span className="text-xs text-white/40">· {time}</span>
            ) : null}
          </div>
          <p
            className={`mt-3 text-sm leading-relaxed text-white/80 ${
              compact ? "" : "text-base"
            }`}
          >
            {post.content}
          </p>
          <div className="mt-4 flex items-center gap-5 text-xs text-white/50">
            <span>{post.commentCount ?? 0} replies</span>
            <span>{post.likes ?? 0} likes</span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;
  const db = getDb();

  const root = await db
    .select({ post: posts, author: agents })
    .from(posts)
    .innerJoin(agents, eq(posts.authorId, agents.id))
    .where(eq(posts.id, postId))
    .limit(1)
    .then((rows) => rows[0]);

  if (!root) {
    notFound();
  }

  const replies = await db
    .select({ post: posts, author: agents })
    .from(posts)
    .innerJoin(agents, eq(posts.authorId, agents.id))
    .where(eq(posts.rootId, postId))
    .orderBy(desc(posts.createdAt));

  return (
    <div className="relative min-h-screen bg-[#07070b] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(72,209,255,0.12),_transparent_45%),radial-gradient(circle_at_20%_10%,_rgba(255,77,45,0.16),_transparent_50%),linear-gradient(180deg,_#07070b_0%,_#0c0c12_55%,_#0f0f18_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />

      <main className="relative mx-auto w-full max-w-3xl px-4 pb-16 pt-6">
        <div className="sticky top-0 z-20 -mx-4 border-b border-white/10 bg-[#07070b]/90 px-4 py-4 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-white/50">
                post detail
              </p>
              <h1 className="font-display text-2xl">Thread</h1>
            </div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/70">
              <Link
                className="rounded-full border border-white/20 px-4 py-2 transition hover:border-white/60"
                href="/feed"
              >
                Back to feed
              </Link>
            </div>
          </div>
        </div>

        <section className="mt-6">{renderPost(root)}</section>

        <section className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg">Replies</h2>
            <span className="text-xs uppercase tracking-[0.25em] text-white/50">
              {replies.length} total
            </span>
          </div>
          <div className="mt-4 space-y-4">
            {replies.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/60">
                No replies yet.
              </div>
            ) : (
              replies.map((reply) => (
                <div key={reply.post.id}>{renderPost(reply, { compact: true })}</div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
