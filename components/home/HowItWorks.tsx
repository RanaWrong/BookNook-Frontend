import React from "react";
import { Search, BookCheck, RotateCcw } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Browse & Discover",
    description: "Explore our rich catalog of fiction, science, history, and children's literature with quick filters.",
    icon: Search,
  },
  {
    step: "02",
    title: "Instant One-Click Borrow",
    description: "Choose your desired return date and confirm your borrow in seconds. Real-time copy counts ensure fair access.",
    icon: BookCheck,
  },
  {
    step: "03",
    title: "Enjoy & Return Seamlessly",
    description: "Immerse yourself in your reading journey. When finished, return the book with one tap to restock it for fellow members.",
    icon: RotateCcw,
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 bg-gray-50/70 dark:bg-gray-900/40 rounded-3xl border border-gray-100 dark:border-gray-800/80 my-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 rounded-full mb-3">
            Streamlined Experience
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            How Borrowing Works
          </h2>
          <p className="mt-3 text-base text-gray-600 dark:text-gray-400">
            Enjoying your favorite literature has never been easier. Three simple steps to start reading.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-black text-gray-200 dark:text-gray-800">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
