import { createFileRoute } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { getCurrentUser } from "~/utils/session";

const getUserInfoFn = createServerFn().handler(async () => {
  const user = await getCurrentUser();
  return { user };
});

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const userInfo = useSuspenseQuery({
    queryKey: ["user-info"],
    queryFn: () => getUserInfoFn(),
  });

  return (
    <div className="min-h-screen dark:bg-gray-950">
      {/* Hero Section */}
      <section className="p-8 max-w-6xl mx-auto text-center">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Learn and Teach from Anywhere
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Join our global community of students and teachers in an interactive
          online learning experience that transforms the way you learn.
        </p>

        {userInfo.data.user ? (
          <Link to="/courses">
            <Button size="lg" className="text-lg px-8">
              View Courses
            </Button>
          </Link>
        ) : (
          <a href="/api/login/google">
            <Button size="lg" className="text-lg px-8">
              Get Started Now
            </Button>
          </a>
        )}
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 dark:bg-gray-900 py-16">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">
            Why Choose Our Platform?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm dark:shadow-gray-800">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-purple-600 dark:text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">
                Interactive Learning
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Engage with content through interactive exercises and real-time
                feedback
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm dark:shadow-gray-800">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">
                Expert Instructors
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Learn from industry professionals and experienced educators
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm dark:shadow-gray-800">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">
                Learn at Your Pace
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Access content anytime, anywhere, and progress at your own speed
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">
            What Our Students Say
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                "This platform has transformed the way I learn. The interactive
                content and supportive community make learning enjoyable and
                effective."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="ml-4">
                  <p className="font-semibold dark:text-white">Sarah Johnson</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Web Development Student
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                "As an instructor, I've found this platform incredibly
                intuitive. It provides all the tools I need to create engaging
                content for my students."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="ml-4">
                  <p className="font-semibold dark:text-white">Michael Chen</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Senior Instructor
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-700 dark:to-blue-700 py-16 text-white">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl mb-8">
            Join thousands of students already learning on our platform
          </p>
          {!userInfo.data.user && (
            <a href="/api/login/google">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8 bg-white text-purple-700 hover:bg-gray-100 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
              >
                Get Started Now
              </Button>
            </a>
          )}
        </div>
      </section>
    </div>
  );
}
