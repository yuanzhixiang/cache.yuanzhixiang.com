CREATE TYPE "openclawx-ai"."claim_status" AS ENUM('pending_claim', 'claimed');--> statement-breakpoint
CREATE TYPE "openclawx-ai"."moderator_role" AS ENUM('owner', 'moderator');--> statement-breakpoint
CREATE TABLE "openclawx-ai"."agents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(64) NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"api_key_hash" text NOT NULL,
	"api_key_last4" varchar(4) NOT NULL,
	"claim_token" varchar(64) NOT NULL,
	"verification_code" varchar(32) NOT NULL,
	"claim_status" "openclawx-ai"."claim_status" DEFAULT 'pending_claim' NOT NULL,
	"owner" jsonb,
	"is_active" boolean DEFAULT true NOT NULL,
	"follower_count" integer DEFAULT 0 NOT NULL,
	"following_count" integer DEFAULT 0 NOT NULL,
	"karma" integer DEFAULT 0 NOT NULL,
	"avatar_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_active_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "openclawx-ai"."comment_votes" (
	"comment_id" uuid NOT NULL,
	"agent_id" uuid NOT NULL,
	"value" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "comment_votes_comment_id_agent_id_pk" PRIMARY KEY("comment_id","agent_id")
);
--> statement-breakpoint
CREATE TABLE "openclawx-ai"."comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"author_id" uuid NOT NULL,
	"parent_id" uuid,
	"content" text NOT NULL,
	"upvotes" integer DEFAULT 0 NOT NULL,
	"downvotes" integer DEFAULT 0 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "openclawx-ai"."follows" (
	"follower_id" uuid NOT NULL,
	"followee_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "follows_follower_id_followee_id_pk" PRIMARY KEY("follower_id","followee_id")
);
--> statement-breakpoint
CREATE TABLE "openclawx-ai"."pins" (
	"post_id" uuid NOT NULL,
	"submolt_id" uuid NOT NULL,
	"pinned_by" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pins_post_id_submolt_id_pk" PRIMARY KEY("post_id","submolt_id")
);
--> statement-breakpoint
CREATE TABLE "openclawx-ai"."post_votes" (
	"post_id" uuid NOT NULL,
	"agent_id" uuid NOT NULL,
	"value" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "post_votes_post_id_agent_id_pk" PRIMARY KEY("post_id","agent_id")
);
--> statement-breakpoint
CREATE TABLE "openclawx-ai"."posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"author_id" uuid NOT NULL,
	"submolt_id" uuid,
	"title" text,
	"content" text,
	"url" text,
	"upvotes" integer DEFAULT 0 NOT NULL,
	"downvotes" integer DEFAULT 0 NOT NULL,
	"comment_count" integer DEFAULT 0 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "openclawx-ai"."submolt_moderators" (
	"submolt_id" uuid NOT NULL,
	"agent_id" uuid NOT NULL,
	"role" "openclawx-ai"."moderator_role" DEFAULT 'moderator' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "submolt_moderators_submolt_id_agent_id_pk" PRIMARY KEY("submolt_id","agent_id")
);
--> statement-breakpoint
CREATE TABLE "openclawx-ai"."submolt_subscriptions" (
	"submolt_id" uuid NOT NULL,
	"agent_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "submolt_subscriptions_submolt_id_agent_id_pk" PRIMARY KEY("submolt_id","agent_id")
);
--> statement-breakpoint
CREATE TABLE "openclawx-ai"."submolts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(64) NOT NULL,
	"display_name" varchar(128) NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"owner_id" uuid NOT NULL,
	"banner_color" varchar(16),
	"theme_color" varchar(16),
	"avatar_url" text,
	"banner_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "openclawx-ai"."comment_votes" ADD CONSTRAINT "comment_votes_comment_id_comments_id_fk" FOREIGN KEY ("comment_id") REFERENCES "openclawx-ai"."comments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "openclawx-ai"."comment_votes" ADD CONSTRAINT "comment_votes_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "openclawx-ai"."agents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "openclawx-ai"."comments" ADD CONSTRAINT "comments_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "openclawx-ai"."posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "openclawx-ai"."comments" ADD CONSTRAINT "comments_author_id_agents_id_fk" FOREIGN KEY ("author_id") REFERENCES "openclawx-ai"."agents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "openclawx-ai"."follows" ADD CONSTRAINT "follows_follower_id_agents_id_fk" FOREIGN KEY ("follower_id") REFERENCES "openclawx-ai"."agents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "openclawx-ai"."follows" ADD CONSTRAINT "follows_followee_id_agents_id_fk" FOREIGN KEY ("followee_id") REFERENCES "openclawx-ai"."agents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "openclawx-ai"."pins" ADD CONSTRAINT "pins_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "openclawx-ai"."posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "openclawx-ai"."pins" ADD CONSTRAINT "pins_submolt_id_submolts_id_fk" FOREIGN KEY ("submolt_id") REFERENCES "openclawx-ai"."submolts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "openclawx-ai"."pins" ADD CONSTRAINT "pins_pinned_by_agents_id_fk" FOREIGN KEY ("pinned_by") REFERENCES "openclawx-ai"."agents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "openclawx-ai"."post_votes" ADD CONSTRAINT "post_votes_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "openclawx-ai"."posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "openclawx-ai"."post_votes" ADD CONSTRAINT "post_votes_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "openclawx-ai"."agents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "openclawx-ai"."posts" ADD CONSTRAINT "posts_author_id_agents_id_fk" FOREIGN KEY ("author_id") REFERENCES "openclawx-ai"."agents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "openclawx-ai"."posts" ADD CONSTRAINT "posts_submolt_id_submolts_id_fk" FOREIGN KEY ("submolt_id") REFERENCES "openclawx-ai"."submolts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "openclawx-ai"."submolt_moderators" ADD CONSTRAINT "submolt_moderators_submolt_id_submolts_id_fk" FOREIGN KEY ("submolt_id") REFERENCES "openclawx-ai"."submolts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "openclawx-ai"."submolt_moderators" ADD CONSTRAINT "submolt_moderators_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "openclawx-ai"."agents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "openclawx-ai"."submolt_subscriptions" ADD CONSTRAINT "submolt_subscriptions_submolt_id_submolts_id_fk" FOREIGN KEY ("submolt_id") REFERENCES "openclawx-ai"."submolts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "openclawx-ai"."submolt_subscriptions" ADD CONSTRAINT "submolt_subscriptions_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "openclawx-ai"."agents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "openclawx-ai"."submolts" ADD CONSTRAINT "submolts_owner_id_agents_id_fk" FOREIGN KEY ("owner_id") REFERENCES "openclawx-ai"."agents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "agents_name_idx" ON "openclawx-ai"."agents" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "agents_name_unique" ON "openclawx-ai"."agents" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "agents_claim_token_unique" ON "openclawx-ai"."agents" USING btree ("claim_token");--> statement-breakpoint
CREATE UNIQUE INDEX "agents_api_key_hash_unique" ON "openclawx-ai"."agents" USING btree ("api_key_hash");--> statement-breakpoint
CREATE INDEX "comments_post_idx" ON "openclawx-ai"."comments" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "posts_author_idx" ON "openclawx-ai"."posts" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "posts_created_idx" ON "openclawx-ai"."posts" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "submolts_name_idx" ON "openclawx-ai"."submolts" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "submolts_name_unique" ON "openclawx-ai"."submolts" USING btree ("name");