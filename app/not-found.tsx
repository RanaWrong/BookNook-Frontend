import React from "react";
import Link from "next/link";
import { BookX, Home, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BookNook | Page Not Found (404)",
  description: "The requested library shelf or page could not be located.",
};

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="w-20 h-20 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 shadow-inner">
        <BookX className="w-10 h-10" />
      </div>

      <span className="text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
        Error 404
      </span>

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
        Page Not Found
      </h1>

      <p className="max-w-md text-base text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
        We couldn&apos;t find the book or library page you&apos;re searching for. It might have been moved, returned, or never penned.
      </p>

      <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
        <Link
          href="/"
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all duration-150"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <Link
          href="/books"
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-semibold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse All Books</span>
        </Link>
      </div>
    </div>
  );
}

