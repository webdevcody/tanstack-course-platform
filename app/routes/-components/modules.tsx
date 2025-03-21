import { Link } from "@tanstack/react-router";

export function ModulesSection() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-12">
          {/* Module 8 */}
          <div>
            <div className="mb-4">
              <div className="text-gray-500 dark:text-gray-400">Module 8</div>
              <h2 className="text-3xl font-bold">Advanced JSON</h2>
            </div>

            <div className="grid gap-4">
              <Link
                to="/learn/$segmentId"
                params={{ segmentId: "1" }}
                className="bg-gray-900 hover:bg-gray-800 transition-colors p-4 rounded-lg flex justify-between items-center group"
              >
                <div>
                  <div className="text-gray-400 text-sm">Video 73</div>
                  <div className="text-white text-lg">Intro to JSON</div>
                </div>
                <div className="text-gray-400">3:40</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
