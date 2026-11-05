"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Borrow, fetchUserBorrows, returnBook } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import {
  BookMarked,
  RotateCcw,
  Calendar,
  Loader2,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

export default function MyBorrowsPage() {
  const router = useRouter();
  const { user, token, loading: authLoading } = useAuth();

  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState<string | null>(null);

  useEffect(() => {
    document.title = "BookNook | My Borrows";
    if (!authLoading && !user) {
      toast.info("Please log in to view your borrowed books.");
      router.push("/login?callbackUrl=/my-borrows");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function loadBorrows() {
      if (!token) return;
      setLoading(true);
      try {
        const data = await fetchUserBorrows(token);
        setBorrows(data);
      } catch (err: any) {
        toast.error(err.message || "Failed to load borrowed books.");
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      loadBorrows();
    }
  }, [token]);

  const handleReturnBook = async (borrow: Borrow) => {
    if (!token) return;

    setReturningId(borrow._id);
    try {
      await returnBook(borrow._id, token);
      setBorrows((prev) => prev.filter((b) => b._id !== borrow._id));
      toast.success(`"${borrow.bookTitle}" has been returned. Thank you!`);
    } catch (err: any) {
      toast.error(err.message || "Failed to return book.");
    } finally {
      setReturningId(null);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        <p className="text-sm text-gray-500">Checking authorization...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <BookMarked className="w-3.5 h-3.5" />
            <span>Active Loans</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            My Borrowed Books
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Track books currently in your care and return them when you&apos;re done.
          </p>
        </div>

        <Link
          href="/books"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 transition-colors"
        >
          <span>Find More Books</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          <p className="text-sm text-gray-500">Loading your borrowed books...</p>
        </div>
      ) : borrows.length === 0 ? (
        <div className="text-center py-20 px-4 rounded-3xl border border-dashed border-gray-300 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            No active borrows right now
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-6">
            Looking for something to read? Browse through our curated collection.
          </p>
          <Link
            href="/books"
            className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl font-semibold text-sm text-white bg-emerald-600 hover:bg-emerald-700"
          >
            <span>Explore Library</span>
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 tracking-wider">
                  <th className="py-4 px-6">Book</th>
                  <th className="py-4 px-6">Borrow Date</th>
                  <th className="py-4 px-6">Return Deadline</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
                {borrows.map((borrow) => {
                  const isReturning = returningId === borrow._id;

                  return (
                    <tr
                      key={borrow._id}
                      className="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3.5">
                          <img
                            src={borrow.bookImage}
                            alt={borrow.bookTitle}
                            className="w-12 h-16 object-cover rounded-lg shadow-sm shrink-0"
                          />
                          <div>
                            <Link
                              href={`/books/${borrow.bookId}`}
                              className="font-bold text-gray-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors line-clamp-1"
                            >
                              {borrow.bookTitle}
                            </Link>
                            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium inline-block mt-0.5">
                              Active Loan
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-600 dark:text-gray-300">
                        <div className="flex items-center space-x-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span>{formatDate(borrow.borrowDate)}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-600 dark:text-gray-300">
                        <div className="flex items-center space-x-1.5 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-amber-500" />
                          <span>{formatDate(borrow.returnDate)}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleReturnBook(borrow)}
                          disabled={isReturning}
                          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white border border-emerald-200 dark:border-emerald-800 transition-all disabled:opacity-50"
                        >
                          {isReturning ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Returning...</span>
                            </>
                          ) : (
                            <>
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Return Book</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
