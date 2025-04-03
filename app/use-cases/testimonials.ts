import { createTestimonial, getTestimonials } from "~/data-access/testimonials";
import { type TestimonialCreate } from "~/db/schema";

export async function createTestimonialUseCase(data: TestimonialCreate) {
  return await createTestimonial(data);
}

export async function getTestimonialsUseCase() {
  return await getTestimonials();
}
