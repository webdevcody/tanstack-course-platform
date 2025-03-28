import { useState } from "react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <section className="bg-black py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-theme-400 to-theme-500 bg-clip-text text-transparent">
            /subscribe
          </h2>
          <p className="text-gray-400 text-xl mb-8 max-w-2xl mx-auto">
            React Mastery is a comprehensive video course by WebDevCody. Learn
            everything you need to confidently build modern React applications.
          </p>

          <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="flex-1 px-6 py-4 rounded-lg bg-gray-900 text-white border border-gray-800 focus:outline-none focus:border-theme-500"
                required
              />
              <button
                type="submit"
                className="px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Request access
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
