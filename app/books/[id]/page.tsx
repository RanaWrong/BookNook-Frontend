"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Book, fetchBookById } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { BorrowModal } from "@/components/books/BorrowModal";
import {
  BookOpen,
  User,
  Calendar,
  Layers,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Share2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

export default function BookDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { user, token, loading: authLoading } = useAuth();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);

  useEffect(() => {
    async function loadBookDetails() {
      if (!id) return;
      try {
        const data = await fetchBookById(id);
        setBook(data);
        document.title = `BookNook | ${data.title}`;
      } catch (err: any) {
        console.error("Error loading book:", err);
      } finally {
        setLoading(false);
      }
    }

    loadBookDetails();
  }, [id]);

  const handleBorrowClick = () => {
    if (!user || !token) {
      toast.info("Please log in to borrow books from the library.");
      router.push(`/login?callbackUrl=/books/${id}`);
      return;
    }
    setIsBorrowModalOpen(true);
  };

  const handleBorrowSuccess = async () => {
    // Reload book details to update available copies
    try {
      const updated = await fetchBookById(id);
      setBook(updated);
    } catch {
      // ignore
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        <p className="text-sm text-gray-500">Loading book details...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Book Not Found</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          The requested book could not be found in our collection.
        </p>
        <Link
          href="/books"
          className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Books</span>
        </Link>
      </div>
    );
  }

  const isAvailable = book.availableCopies > 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/books"
          className="inline-flex items-center space-x-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to catalog</span>
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 p-6 sm:p-10">
        {/* Cover Image Column */}
        <div className="md:col-span-5 flex flex-col">
          <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800 bg-gray-100 dark:bg-gray-800">
            <img
              src={book.image}
              alt={book.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow text-emerald-700 dark:text-emerald-300">
                {book.category}
              </span>
            </div>
          </div>
        </div>

        {/* Details & Actions Column */}
        <div className="md:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                {book.category} Shelf
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight mt-1">
                {book.title}
              </h1>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 mt-2">
                <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="font-medium text-base">{book.author}</span>
              </div>
            </div>

            {/* Copies and stock badges */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                  isAvailable
                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                    : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800"
                }`}
              >
                {isAvailable ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>{book.availableCopies} of {book.totalCopies} Available</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    <span>Not Available (0 copies)</span>
                  </>
                )}
              </div>

              <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>Added on {new Date(book.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Book Description */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-2">
                About This Book
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {book.description}
              </p>
            </div>

            {/* Added By / Contributor */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
                {book.userName?.charAt(0) || "L"}
              </div>
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-200">
                  Added by {book.userName}
                </p>
                <p>{book.userEmail}</p>
              </div>
            </div>
          </div>

          {/* Action Button: Borrow This Book */}
          <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
            <button
              onClick={handleBorrowClick}
              disabled={!isAvailable}
              className={`w-full py-4 px-6 rounded-2xl font-bold text-base flex items-center justify-center space-x-2.5 transition-all shadow-md ${
                isAvailable
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30 transform hover:-translate-y-0.5"
                  : "bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed shadow-none"
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span>{isAvailable ? "Borrow This Book" : "Not Available (Out of stock)"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Borrow Modal */}
      {user && token && (
        <BorrowModal
          isOpen={isBorrowModalOpen}
          onClose={() => setIsBorrowModalOpen(false)}
          bookId={book._id}
          bookTitle={book.title}
          availableCopies={book.availableCopies}
          user={{
            name: user.name,
            email: user.email,
          }}
          token={token}
          onSuccess={handleBorrowSuccess}
        />
      )}
    </div>
  );
}

