ALTER TABLE "app_segment" ADD COLUMN "slug" text NOT NULL;--> statement-breakpoint
CREATE INDEX "segments_slug_idx" ON "app_segment" USING btree ("slug");