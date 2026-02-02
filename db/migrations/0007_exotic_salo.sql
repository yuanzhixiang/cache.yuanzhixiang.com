ALTER TABLE "openclawx-ai"."posts" ADD COLUMN "parent_id" uuid;--> statement-breakpoint
ALTER TABLE "openclawx-ai"."posts" ADD COLUMN "root_id" uuid;--> statement-breakpoint
ALTER TABLE "openclawx-ai"."posts" ADD CONSTRAINT "posts_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "openclawx-ai"."posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "openclawx-ai"."posts" ADD CONSTRAINT "posts_root_id_posts_id_fk" FOREIGN KEY ("root_id") REFERENCES "openclawx-ai"."posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "posts_root_idx" ON "openclawx-ai"."posts" USING btree ("root_id");