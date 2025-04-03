import * as React from "react";
import { cn } from "~/lib/utils";

interface FAQItemProps {
  question: string;
  answer: React.ReactNode;
}

const FAQItem = ({ question, answer }: FAQItemProps) => {
  return (
    <div className="h-full flex flex-col overflow-hidden">
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
      <div className="p-6 rounded-b-lg bg-gray-800/30 border-x border-b border-theme-500/20 flex-1">
        {answer}
      </div>
    </div>
  );
};

const faqData: FAQItemProps[] = [
  {
    question: "What are the 20 React challenges?",
    answer: (
      <p className="text-gray-300">
        The challenges range from simple to complex, including building a
        Connect Four game, creating a Quote Generator, developing a Todo List,
        and more. Each challenge focuses on different React concepts and
        problem-solving skills.
      </p>
    ),
  },
  {
    question: "What skill level is required for these challenges?",
    answer: (
      <p className="text-gray-300">
        These challenges are perfect for beginners who have a basic
        understanding of React. Each challenge includes detailed explanations
        and step-by-step guidance to help you learn and grow.
      </p>
    ),
  },
  {
    question: "How do I get help if I'm stuck on a challenge?",
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
    question: "Do I get access to the solution code?",
    answer: (
      <p className="text-gray-300">
        Yes! Each challenge comes with a complete solution that you can
        reference. However, we encourage you to try solving the challenges
        yourself first to get the most out of the learning experience.
      </p>
    ),
  },
  {
    question: "Can I use these projects in my portfolio?",
    answer: (
      <p className="text-gray-300">
        Absolutely! Each challenge is a complete, portfolio-ready project. You
        can customize them further to showcase your skills to potential
        employers.
      </p>
    ),
  },
  {
    question: "How long does it take to complete all challenges?",
    answer: (
      <p className="text-gray-300">
        The time varies depending on your experience and how much time you
        dedicate. On average, each challenge should take a maximum time of an
        hour or two to solve yourself.
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

        <div className="grid grid-cols-1 gap-6">
          {faqData.map((faq, index) => (
            <div key={index} className="h-full flex">
              <FAQItem question={faq.question} answer={faq.answer} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
