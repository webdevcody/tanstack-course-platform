DROP INDEX "progress_user_id_segment_id_idx";--> statement-breakpoint
ALTER TABLE "app_progress" ADD CONSTRAINT "app_progress_segmentId_app_segment_id_fk" FOREIGN KEY ("segmentId") REFERENCES "public"."app_segment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "progress_user_segment_unique_idx" ON "app_progress" USING btree ("userId","segmentId");