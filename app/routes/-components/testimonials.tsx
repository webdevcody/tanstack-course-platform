import { createServerFn } from "@tanstack/react-start";
import { getTestimonialsUseCase } from "~/use-cases/testimonials";
import { useQuery } from "@tanstack/react-query";

export const getTestimonialsFn = createServerFn().handler(async () => {
  return await getTestimonialsUseCase();
});

export function TestimonialsSection() {
  const { data: testimonials } = useQuery({
    queryKey: ["testimonials"],
    queryFn: getTestimonialsFn,
  });

  if (!testimonials) {
    return null;
  }

  return (
    <section className="relative py-24 px-6" id="testimonials">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-900 to-black"></div>

      {/* Top border glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-theme-500/50 to-transparent"></div>
      <div className="absolute top-0 left-0 right-0 h-[2px] blur-sm bg-gradient-to-r from-transparent via-theme-400/50 to-transparent"></div>

      {/* Bottom border glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-theme-500/50 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-[2px] blur-sm bg-gradient-to-r from-transparent via-theme-400/50 to-transparent"></div>

      <div className="relative max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-theme-400 to-theme-500">
          Loved by React Beginners
        </h2>
        <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
          Join thousands of developers who have improved their React skills
          through hands-on practice with our challenges
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials?.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-gray-800/50 p-8 rounded-xl border border-theme-500/20 hover:border-theme-500/40 hover:transform hover:-translate-y-1 hover:bg-gray-800/60 transition-all duration-300 ease-in-out backdrop-blur-sm"
            >
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-theme-500/30">
                  {testimonial?.profile?.image ? (
                    <img
                      src={testimonial.profile.image}
                      alt={testimonial.displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-theme-500/20 flex items-center justify-center">
                      <span className="text-2xl">
                        {testimonial.displayName.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-white">
                    {testimonial.displayName}
                  </p>
                  <p className="text-sm text-theme-400">
                    {new Date(testimonial.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="text-gray-300 mb-6 italic">{testimonial.content}</p>
              <div className="flex text-2xl">
                {Array.from(testimonial.emojis).map((emoji, i) => (
                  <span key={i} className="mr-2">
                    {emoji}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
