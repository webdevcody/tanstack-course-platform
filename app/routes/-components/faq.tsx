export function FAQSection() {
  return (
    <section className="py-16 px-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-2">
              I'm having issues with the course. Who can I contact?
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Oh no! Send us an email at{" "}
              <a
                href="mailto:support@aaronfrancis.com"
                className="text-blue-600 dark:text-blue-400 underline"
              >
                support@aaronfrancis.com
              </a>
              .
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-2">
              Is there a free trial available?
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              There are several free videos, but no free trial. If you aren't
              fully satisfied with the course, just ask for your money back—no
              problem.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-2">
              Is there a money back guarantee?
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              If, for any reason, you find yourself less than fully satisfied
              with the course, you may request a refund at any time.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-2">
              Can I get an invoice?
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Absolutely! After making a purchase we will automatically email
              you a receipt. If you need a more detailed invoice, just{" "}
              <a
                href="mailto:support@aaronfrancis.com"
                className="text-blue-600 dark:text-blue-400 underline"
              >
                email us
              </a>
              .
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-2">
              Do you offer discounts?
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Sure, if you live in a country where the USD price is too high or
              if you are a student, don't hesitate to{" "}
              <a
                href="mailto:support@aaronfrancis.com"
                className="text-blue-600 dark:text-blue-400 underline"
              >
                email us
              </a>
              !
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
