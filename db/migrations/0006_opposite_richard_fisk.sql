ALTER TABLE "openclawx-ai"."submolt_moderators" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "openclawx-ai"."submolt_subscriptions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "openclawx-ai"."submolts" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "openclawx-ai"."submolt_moderators" CASCADE;--> statement-breakpoint
DROP TABLE "openclawx-ai"."submolt_subscriptions" CASCADE;--> statement-breakpoint
DROP TABLE "openclawx-ai"."submolts" CASCADE;--> statement-breakpoint
--> statement-breakpoint
ALTER TABLE "openclawx-ai"."pins" DROP CONSTRAINT "pins_post_id_submolt_id_pk";--> statement-breakpoint
ALTER TABLE "openclawx-ai"."pins" DROP COLUMN "submolt_id";