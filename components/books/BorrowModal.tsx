"use client";

import React, { useState } from "react";
import { User, Calendar, BookOpen, AlertCircle, Loader2, X, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { borrowBook } from "@/lib/api";

interface BorrowModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookId: string;
  bookTitle: string;
  availableCopies: number;
  user: {
    name: string;
    email: string;
  };
  token: string;
  onSuccess: () => void;
}

export function BorrowModal({
  isOpen,
  onClose,
  bookId,
  bookTitle,
  availableCopies,
  user,
  token,
  onSuccess,
}: BorrowModalProps) {
  // Default return date to 7 days from today
  const defaultReturn = new Date();
  defaultReturn.setDate(defaultReturn.getDate() + 7);
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);

  const [returnDate, setReturnDate] = useState(defaultReturn.toISOString().split("T")[0]);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const isOutOfStock = availableCopies <= 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isOutOfStock) {
      toast.error("This book is currently out of stock.");
      return;
    }

    if (!returnDate) {
      toast.error("Please pick a return date.");
      return;
    }

    setSubmitting(true);
    try {
      await borrowBook({ bookId, returnDate }, token);
      toast.success(`Successfully borrowed "${bookTitle}"! Happy reading!`);
      onSuccess();
      onClose();
    } catch (err: any) {
      // Challenge 2: Double borrow error handling
      toast.error(err.message || "Failed to borrow book.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl p-6 sm:p-8 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Borrow Book
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
              {bookTitle}
            </p>
          </div>
        </div>

        {/* Out of Stock Warning */}
        {isOutOfStock ? (
          <div className="p-4 mb-6 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center space-x-3 text-rose-700 dark:text-rose-300 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-semibold">Not Available</p>
              <p className="text-xs mt-0.5">All copies of this book are currently borrowed. Please check back later.</p>
            </div>
          </div>
        ) : (
          <div className="p-3.5 mb-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 flex items-center space-x-3 text-emerald-700 dark:text-emerald-300 text-xs">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{availableCopies} copies currently available in the library.</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User Name (Read-only) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
              Borrower Name
            </label>
            <input
              type="text"
              readOnly
              value={user.name}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 text-gray-600 dark:text-gray-300 text-sm cursor-not-allowed"
            />
          </div>

          {/* User Email (Read-only) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
              Borrower Email
            </label>
            <input
              type="email"
              readOnly
              value={user.email}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 text-gray-600 dark:text-gray-300 text-sm cursor-not-allowed"
            />
          </div>

          {/* Return Date Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
              Return Deadline Date *
            </label>
            <div className="relative">
              <input
                type="date"
                required
                min={minDate.toISOString().split("T")[0]}
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                disabled={isOutOfStock}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-4 flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-3 px-4 rounded-xl font-medium text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || isOutOfStock}
              className="w-1/2 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-semibold text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 disabled:opacity-50 transition-all"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Borrowing...</span>
                </>
              ) : (
                <span>Confirm Borrow</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
