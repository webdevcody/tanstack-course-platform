import * as React from "react";
import { cn } from "~/lib/utils";

interface FAQItemProps {
  question: string;
  answer: React.ReactNode;
}

const FAQItem = ({ question, answer }: FAQItemProps) => {
  return (
    <div className="overflow-hidden">
      <div
        className={cn(
          "w-full flex items-center justify-between p-6 rounded-lg",
          "bg-gray-800/70 border border-theme-500/20 backdrop-blur-sm",
          "shadow-[0_0_15px_rgba(34,197,94,0.1)]"
        )}
      >
        <h3 className="text-xl font-semibold text-left text-theme-400">
          {question}
        </h3>
      </div>
      <div className="p-6 rounded-b-lg bg-gray-800/30 border-x border-b border-theme-500/20">
        {answer}
      </div>
    </div>
  );
};

const faqData: FAQItemProps[] = [
  {
    question: "I'm having issues with the course. Who can I contact?",
    answer: (
      <p className="text-gray-300">
        Oh no! Send us an email at{" "}
        <a
          href="mailto:webdevcody@gmail.com"
          className="text-theme-400 hover:text-theme-300 underline transition-colors"
        >
          webdevcody@gmail.com
        </a>
        .
      </p>
    ),
  },
  {
    question: "Is there a free trial available?",
    answer: (
      <p className="text-gray-300">
        There are several free videos, but no free trial. If you aren't fully
        satisfied with the course, just ask for your money back—no problem.
      </p>
    ),
  },
  {
    question: "Is there a money back guarantee?",
    answer: (
      <p className="text-gray-300">
        If, for any reason, you find yourself less than fully satisfied with the
        course, you may request a refund at any time.
      </p>
    ),
  },
  {
    question: "Can I get an invoice?",
    answer: (
      <p className="text-gray-300">
        Absolutely! After making a purchase we will automatically email you a
        receipt. If you need a more detailed invoice, just{" "}
        <a
          href="mailto:webdevcody@gmail.com"
          className="text-theme-400 hover:text-theme-300 underline transition-colors"
        >
          email us
        </a>
        .
      </p>
    ),
  },
  {
    question: "Do you offer discounts?",
    answer: (
      <p className="text-gray-300">
        Sure, if you live in a country where the USD price is too high or if you
        are a student, don't hesitate to{" "}
        <a
          href="mailto:webdevcody@gmail.com"
          className="text-theme-400 hover:text-theme-300 underline transition-colors"
        >
          email us
        </a>
        !
      </p>
    ),
  },
];

export function FAQSection() {
  return (
    <section className="relative py-16 px-6 overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-950" />

      {/* Content */}
      <div className="relative max-w-4xl mx-auto">
        <div className="flex flex-col items-center mb-12 text-center">
          <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-theme-400 to-theme-600">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-400 max-w-2xl">
            Get quick answers to common questions about our course and services
          </p>
        </div>

        <div className="space-y-8">
          {faqData.map((faq, index) => (
            <div key={index}>
              <FAQItem question={faq.question} answer={faq.answer} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
