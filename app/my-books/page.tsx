"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Book, fetchBooks, deleteBook } from "@/lib/api";
import { EditBookModal } from "@/components/books/EditBookModal";
import { DeleteConfirmModal } from "@/components/books/DeleteConfirmModal";
import {
  Library,
  PlusCircle,
  Edit2,
  Trash2,
  ExternalLink,
  Loader2,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";

export default function MyBooksPage() {
  const router = useRouter();
  const { user, token, loading: authLoading } = useAuth();

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [selectedBookForEdit, setSelectedBookForEdit] = useState<Book | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [selectedBookForDelete, setSelectedBookForDelete] = useState<Book | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    document.title = "BookNook | My Books";
    if (!authLoading && !user) {
      toast.info("Please log in to view your added books.");
      router.push("/login?callbackUrl=/my-books");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function loadUserBooks() {
      if (!user) return;
      setLoading(true);
      try {
        const data = await fetchBooks({ userEmail: user.email, sort: "newest" });
        setBooks(data);
      } catch (err: any) {
        toast.error(err.message || "Failed to load your books.");
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      loadUserBooks();
    }
  }, [user]);

  const handleEditClick = (book: Book) => {
    setSelectedBookForEdit(book);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = (updatedBook: Book) => {
    setBooks((prev) =>
      prev.map((b) => (b._id === updatedBook._id ? updatedBook : b))
    );
  };

  const handleDeleteClick = (book: Book) => {
    setSelectedBookForDelete(book);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedBookForDelete || !token) return;

    setDeleting(true);
    try {
      await deleteBook(selectedBookForDelete._id, token);
      setBooks((prev) => prev.filter((b) => b._id !== selectedBookForDelete._id));
      toast.success(`"${selectedBookForDelete.title}" deleted from library.`);
      setIsDeleteModalOpen(false);
      setSelectedBookForDelete(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete book.");
    } finally {
      setDeleting(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        <p className="text-sm text-gray-500">Authenticating user...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Library className="w-3.5 h-3.5" />
            <span>Manage Catalog</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            My Added Books
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Review, edit, or remove books you have contributed to BookNook.
          </p>
        </div>

        <Link
          href="/add-book"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Book</span>
        </Link>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          <p className="text-sm text-gray-500">Loading your books...</p>
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-20 px-4 rounded-3xl border border-dashed border-gray-300 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            You haven&apos;t added any books yet
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-6">
            Share your favorite reads with the community today.
          </p>
          <Link
            href="/add-book"
            className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl font-semibold text-sm text-white bg-emerald-600 hover:bg-emerald-700"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Your First Book</span>
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 tracking-wider">
                  <th className="py-4 px-6">Book</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6 text-center">Copies</th>
                  <th className="py-4 px-6 text-center">Available</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
                {books.map((book) => (
                  <tr
                    key={book._id}
                    className="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3.5">
                        <img
                          src={book.image}
                          alt={book.title}
                          className="w-12 h-16 object-cover rounded-lg shadow-sm shrink-0"
                        />
                        <div>
                          <Link
                            href={`/books/${book._id}`}
                            className="font-bold text-gray-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 line-clamp-1 transition-colors"
                          >
                            {book.title}
                          </Link>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            by {book.author}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                        {book.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center font-medium">
                      {book.totalCopies}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                          book.availableCopies > 0
                            ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
                            : "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300"
                        }`}
                      >
                        {book.availableCopies} left
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center space-x-2">
                        <button
                          onClick={() => handleEditClick(book)}
                          className="p-2 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                          title="Edit Book"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(book)}
                          className="p-2 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Delete Book"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {selectedBookForEdit && token && (
        <EditBookModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedBookForEdit(null);
          }}
          book={selectedBookForEdit}
          token={token}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Custom Delete Confirmation Modal */}
      {selectedBookForDelete && (
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedBookForDelete(null);
          }}
          onConfirm={handleDeleteConfirm}
          title={selectedBookForDelete.title}
          loading={deleting}
        />
      )}
    </div>
  );
}
