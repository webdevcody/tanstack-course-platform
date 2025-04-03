CREATE TABLE "app_testimonial" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" serial NOT NULL,
	"content" text NOT NULL,
	"emojis" text NOT NULL,
	"displayName" text NOT NULL,
	"permissionGranted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "app_testimonial" ADD CONSTRAINT "app_testimonial_userId_app_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."app_user"("id") ON DELETE cascade ON UPDATE no action;