export function TestimonialsSection() {
  return (
    <section className="relative py-24 px-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-900 to-black"></div>

      {/* Top border glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-theme-500/50 to-transparent"></div>
      <div className="absolute top-0 left-0 right-0 h-[2px] blur-sm bg-gradient-to-r from-transparent via-theme-400/50 to-transparent"></div>

      {/* Bottom border glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-theme-500/50 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-[2px] blur-sm bg-gradient-to-r from-transparent via-theme-400/50 to-transparent"></div>

      <div className="relative max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-theme-400 to-theme-500">
          Loved by Developers Worldwide
        </h2>
        <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
          Join thousands of developers who have transformed their careers with
          our comprehensive React courses
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-800/50 p-8 rounded-xl border border-theme-500/20 hover:border-theme-500/40 hover:transform hover:-translate-y-1 hover:bg-gray-800/60 transition-all duration-300 ease-in-out backdrop-blur-sm">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-theme-500/30">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
                  alt="Emma Thompson"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="ml-4">
                <p className="font-semibold text-white">Emma Thompson</p>
                <p className="text-sm text-theme-400">
                  Senior Frontend Engineer
                </p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 italic">
              "The course structure is brilliant. Each concept builds perfectly
              on the previous one, and the real-world projects are exactly what
              I needed to build my portfolio."
            </p>
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>

          <div className="bg-gray-800/50 p-8 rounded-xl border border-theme-500/20 hover:border-theme-500/40 hover:transform hover:-translate-y-1 hover:bg-gray-800/60 transition-all duration-300 ease-in-out backdrop-blur-sm">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-theme-500/30">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
                  alt="Alex Rivera"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="ml-4">
                <p className="font-semibold text-white">Alex Rivera</p>
                <p className="text-sm text-theme-400">Full Stack Developer</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 italic">
              "The advanced patterns and best practices covered in this course
              have completely transformed how I approach React development.
              Worth every penny!"
            </p>
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>

          <div className="bg-gray-800/50 p-8 rounded-xl border border-theme-500/20 hover:border-theme-500/40 hover:transform hover:-translate-y-1 hover:bg-gray-800/60 transition-all duration-300 ease-in-out backdrop-blur-sm">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-theme-500/30">
                <img
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop"
                  alt="Sophie Chen"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="ml-4">
                <p className="font-semibold text-white">Sophie Chen</p>
                <p className="text-sm text-theme-400">React Developer</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 italic">
              "The community support is incredible. Having access to the Discord
              server and getting help from both instructors and peers made
              learning so much easier."
            </p>
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
