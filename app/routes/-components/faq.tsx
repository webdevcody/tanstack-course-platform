import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "~/lib/utils";

interface FAQItemProps {
  question: string;
  answer: React.ReactNode;
}

const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between p-6 rounded-lg",
          "bg-gray-800/50 hover:bg-gray-800/70 transition-colors duration-200",
          "border border-gray-700/50 backdrop-blur-sm",
          isOpen && "bg-gray-800/70"
        )}
      >
        <h3 className="text-xl font-semibold text-left">{question}</h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-6 h-6 text-gray-400" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-6 rounded-b-lg bg-gray-800/30 border-x border-b border-gray-700/50">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
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
          className="text-blue-400 hover:text-blue-300 underline transition-colors"
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
          className="text-blue-400 hover:text-blue-300 underline transition-colors"
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
          className="text-blue-400 hover:text-blue-300 underline transition-colors"
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
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">
              Frequently Asked Questions
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-gray-400 max-w-2xl">
              Get quick answers to common questions about our course and
              services
            </p>
          </motion.div>
        </div>

        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <FAQItem question={faq.question} answer={faq.answer} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
