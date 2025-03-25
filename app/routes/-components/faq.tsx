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
    question: "How can I get help if I'm stuck on a section?",
    answer: (
      <p className="text-gray-300">
        You can reach out in our Discord community or email me directly at{" "}
        <a
          href="mailto:webdevcody@gmail.com"
          className="text-theme-400 hover:text-theme-300 underline transition-colors"
        >
          webdevcody@gmail.com
        </a>
        . I typically respond within 24 hours.
      </p>
    ),
  },
  {
    question: "What technologies will I learn in this course?",
    answer: (
      <p className="text-gray-300">
        This course covers the complete TanStack ecosystem including React
        Query, React Router, React Table, and more. You'll learn how to build
        modern, type-safe applications with these powerful tools.
      </p>
    ),
  },
  {
    question: "What skill level is required for this course?",
    answer: (
      <p className="text-gray-300">
        You should have a basic understanding of React and TypeScript. While
        we'll cover advanced concepts, we'll break them down in a way that's
        approachable for intermediate developers.
      </p>
    ),
  },
  {
    question: "Do I get lifetime access to the course materials?",
    answer: (
      <p className="text-gray-300">
        Yes! Once you purchase the course, you'll have permanent access to all
        current content and future updates. If you ever need to download your
        invoice, just{" "}
        <a
          href="mailto:webdevcody@gmail.com"
          className="text-theme-400 hover:text-theme-300 underline transition-colors"
        >
          email me
        </a>
        .
      </p>
    ),
  },
  {
    question: "Are there any prerequisites?",
    answer: (
      <p className="text-gray-300">
        You should be comfortable with React fundamentals and have some
        experience with TypeScript. If you need to brush up on these topics,
        check out my{" "}
        <a
          href="https://youtube.com/@WebDevCody"
          className="text-theme-400 hover:text-theme-300 underline transition-colors"
        >
          YouTube channel
        </a>{" "}
        for free resources!
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
