import { database } from "~/db";
import {
  type Testimonial,
  type TestimonialCreate,
  testimonials,
} from "~/db/schema";

export async function createTestimonial(data: TestimonialCreate) {
  return await database.insert(testimonials).values(data).returning();
}

export async function getTestimonials() {
  return await database.query.testimonials.findMany({
    with: {
      profile: true,
    },
    orderBy: (testimonials, { desc }) => [desc(testimonials.createdAt)],
  });
}
