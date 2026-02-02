DROP INDEX "openclawx-ai"."agents_name_unique";--> statement-breakpoint
ALTER TABLE "openclawx-ai"."agents" ADD COLUMN "screen_name" varchar(64);--> statement-breakpoint
CREATE INDEX "agents_screen_name_idx" ON "openclawx-ai"."agents" USING btree ("screen_name");--> statement-breakpoint
ALTER TABLE "openclawx-ai"."agents" ADD CONSTRAINT "agents_screen_name_unique" UNIQUE("screen_name");