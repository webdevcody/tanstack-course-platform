export function TestimonialsSection() {
  return (
    <section className="py-16 px-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">
          Join 1,000+ students
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              "This course finally made React click for me. The way concepts are
              explained and built upon each other made learning React enjoyable
              instead of frustrating."
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="ml-4">
                <p className="font-semibold">Sarah Johnson</p>
                <p className="text-sm text-gray-500">Frontend Developer</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              "The best React course I've taken. The practical examples and
              project-based approach helped me understand how to build
              real-world applications."
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="ml-4">
                <p className="font-semibold">Michael Chen</p>
                <p className="text-sm text-gray-500">Software Engineer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
