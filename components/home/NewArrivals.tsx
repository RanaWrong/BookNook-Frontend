"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Book, fetchBooks } from "@/lib/api";
import { BookCard } from "@/components/books/BookCard";
import { ArrowRight, Sparkles, Loader2 } from "lucide-react";

// Backup sample books in case backend is empty
const fallbackBooks: Book[] = [
  {
    _id: "demo-1",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    category: "Fiction",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800",
    description: "The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it.",
    totalCopies: 5,
    availableCopies: 5,
    userEmail: "librarian@booknook.com",
    userName: "BookNook Librarian",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "demo-2",
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    category: "Science",
    image: "https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&q=80&w=800",
    description: "A landmark volume in science writing by one of the great minds of modern times exploring black holes and cosmology.",
    totalCopies: 3,
    availableCopies: 3,
    userEmail: "librarian@booknook.com",
    userName: "BookNook Librarian",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "demo-3",
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    category: "History",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800",
    description: "Explores how biology and history have defined humanity and enhanced our understanding of what it means to be human.",
    totalCopies: 4,
    availableCopies: 4,
    userEmail: "librarian@booknook.com",
    userName: "BookNook Librarian",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "demo-4",
    title: "The Little Prince",
    author: "Antoine de Saint-Exupéry",
    category: "Kids",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800",
    description: "A poetic tale about a young prince who visits various planets in space, addressing themes of loneliness, friendship, love, and loss.",
    totalCopies: 6,
    availableCopies: 6,
    userEmail: "librarian@booknook.com",
    userName: "BookNook Librarian",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "demo-5",
    title: "Cosmos",
    author: "Carl Sagan",
    category: "Science",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
    description: "The story of fifteen billion years of cosmic evolution transforming matter into consciousness.",
    totalCopies: 4,
    availableCopies: 4,
    userEmail: "librarian@booknook.com",
    userName: "BookNook Librarian",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "demo-6",
    title: "1984",
    author: "George Orwell",
    category: "Fiction",
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=800",
    description: "A chilling dystopian tale of totalitarian regime surveillance and personal liberty under Big Brother.",
    totalCopies: 5,
    availableCopies: 5,
    userEmail: "librarian@booknook.com",
    userName: "BookNook Librarian",
    createdAt: new Date().toISOString(),
  },
];

export function NewArrivals() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNewArrivals() {
      try {
        const data = await fetchBooks({ limit: 6, sort: "newest" });
        if (data && data.length > 0) {
          setBooks(data);
        } else {
          setBooks(fallbackBooks);
        }
      } catch (err) {
        console.warn("Could not load from API, utilizing initial catalog:", err);
        setBooks(fallbackBooks);
      } finally {
        setLoading(false);
      }
    }

    loadNewArrivals();
  }, []);

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fresh Off The Shelves</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              New Arrivals
            </h2>
            <p className="mt-2 text-base text-gray-600 dark:text-gray-400 max-w-xl">
              Browse the latest literary additions to our digital collection, available for borrowing today.
            </p>
          </div>

          <Link
            href="/books"
            className="hidden md:inline-flex items-center space-x-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
          >
            <span>See All Books</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Books Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading newest books...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {books.slice(0, 6).map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        )}

        {/* See All Books Button below the cards */}
        <div className="mt-10 text-center">
          <Link
            href="/books"
            className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all duration-150 transform hover:-translate-y-0.5"
          >
            <span>See All Books</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
