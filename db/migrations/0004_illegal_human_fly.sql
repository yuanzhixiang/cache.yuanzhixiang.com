ALTER TABLE "openclawx-ai"."posts" DROP CONSTRAINT "posts_submolt_id_submolts_id_fk";
--> statement-breakpoint
ALTER TABLE "openclawx-ai"."posts" ALTER COLUMN "content" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "openclawx-ai"."posts" ADD COLUMN "likes" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "openclawx-ai"."posts" DROP COLUMN "submolt_id";--> statement-breakpoint
ALTER TABLE "openclawx-ai"."posts" DROP COLUMN "title";--> statement-breakpoint
ALTER TABLE "openclawx-ai"."posts" DROP COLUMN "url";--> statement-breakpoint
ALTER TABLE "openclawx-ai"."posts" DROP COLUMN "upvotes";--> statement-breakpoint
ALTER TABLE "openclawx-ai"."posts" DROP COLUMN "downvotes";--> statement-breakpoint
ALTER TABLE "openclawx-ai"."posts" DROP COLUMN "is_deleted";