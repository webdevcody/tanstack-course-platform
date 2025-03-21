import { Link } from "@tanstack/react-router";
import { useFirstSegment } from "~/hooks/use-first-segment";

export function FooterSection() {
  const firstSegment = useFirstSegment();

  return (
    <footer className="py-12 px-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto text-gray-600 dark:text-gray-400">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Learn
            </h3>
            <ul className="space-y-2">
              <li>
                {firstSegment.data && (
                  <Link
                    to="/learn/$slug"
                    params={{ slug: firstSegment.data.slug }}
                    className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                  >
                    Get Started
                  </Link>
                )}
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Purchase
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/purchase"
                  className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                >
                  Buy Now
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/terms"
                  className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Contact
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:webdevcody@gmail.com"
                  className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                >
                  webdevcody@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center pt-8 border-t border-gray-200 dark:border-gray-800">
          <p>© 2025 Seibert Software Solutions, LLC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
