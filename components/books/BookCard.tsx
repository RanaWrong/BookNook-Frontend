"use client";

import React from "react";
import Link from "next/link";
import { Book } from "@/lib/api";
import { ArrowRight, BookOpen, User } from "lucide-react";

interface BookCardProps {
  book: Book;
}

const categoryColors: Record<string, string> = {
  Fiction: "bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800",
  Science: "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  History: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  Kids: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  Others: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
};

export function BookCard({ book }: BookCardProps) {
  const isAvailable = (book.availableCopies ?? 1) > 0;

  return (
    <div className="group flex flex-col h-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Book Cover Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={book.image}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Category Pill Tag */}
        <div className="absolute top-3 left-3">
          <span
            className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full border shadow-sm ${
              categoryColors[book.category] || categoryColors.Others
            }`}
          >
            {book.category}
          </span>
        </div>

        {/* Copies Availability Pill Tag */}
        <div className="absolute top-3 right-3">
          <span
            className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full shadow-sm ${
              isAvailable
                ? "bg-emerald-500 text-white"
                : "bg-rose-500 text-white"
            }`}
          >
            {isAvailable ? `${book.availableCopies} available` : "Out of stock"}
          </span>
        </div>
      </div>

      {/* Book Content / Metadata */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
          {book.title}
        </h3>

        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1 mb-3">
          <User className="w-3.5 h-3.5 mr-1.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span className="truncate">{book.author}</span>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 flex-1">
          {book.description}
        </p>

        {/* View Details Button */}
        <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
          <Link
            href={`/books/${book._id}`}
            className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white transition-all duration-150"
          >
            <span>View Details</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
