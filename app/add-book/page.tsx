"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createBook } from "@/lib/api";
import { uploadImageToImgBB } from "@/lib/imgbb";
import { BookOpen, Upload, Loader2, PlusCircle, User, Mail, Layers, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

const categories = ["Fiction", "Science", "History", "Kids", "Others"] as const;

export default function AddBookPage() {
  const router = useRouter();
  const { user, token, loading: authLoading } = useAuth();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState<typeof categories[number]>("Fiction");
  const [description, setDescription] = useState("");
  const [totalCopies, setTotalCopies] = useState<number>(3);
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = "BookNook | Add Book";
    if (!authLoading && !user) {
      toast.info("Please log in to add a book to the library.");
      router.push("/login?callbackUrl=/add-book");
    }
  }, [user, authLoading, router]);

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setUploadingImage(true);
    try {
      toast.loading("Uploading book cover to ImgBB...", { id: "img-upload" });
      const uploadedUrl = await uploadImageToImgBB(file);
      setImageUrl(uploadedUrl);
      toast.success("Cover image uploaded successfully!", { id: "img-upload" });
    } catch (err: any) {
      toast.error(err.message || "Failed to upload image to ImgBB.", { id: "img-upload" });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !token) {
      toast.error("You must be logged in to add a book.");
      router.push("/login?callbackUrl=/add-book");
      return;
    }

    if (!title.trim() || !author.trim() || !description.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!imageUrl) {
      toast.error("Please provide or upload a book cover image.");
      return;
    }

    if (totalCopies < 1) {
      toast.error("Total copies must be at least 1.");
      return;
    }

    setSubmitting(true);
    try {
      await createBook(
        {
          title: title.trim(),
          author: author.trim(),
          category,
          image: imageUrl.trim(),
          description: description.trim(),
          totalCopies: Number(totalCopies),
        },
        token
      );

      toast.success(`"${title}" has been successfully added to the catalog!`);
      router.push("/my-books");
    } catch (err: any) {
      toast.error(err.message || "Failed to add book.");
    } finally {
      setSubmitting(false);
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl p-6 sm:p-10">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Contribute to Library</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Add a New Book
          </h1>
          <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-400">
            Share a compelling title with fellow community readers.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Read-only User Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                Contributor Name (Read-only)
              </label>
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                <User className="w-4 h-4 text-emerald-600" />
                <span>{user.name}</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                Contributor Email (Read-only)
              </label>
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-900 dark:text-gray-200 truncate">
                <Mail className="w-4 h-4 text-emerald-600" />
                <span className="truncate">{user.email}</span>
              </div>
            </div>
          </div>

          {/* Book Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
              Book Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. The Midnight Library"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>

          {/* Author Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
              Author Name *
            </label>
            <input
              type="text"
              required
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g. Matt Haig"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>

          {/* Category & Total Copies */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                Total Copies * (Challenge 1)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                required
                value={totalCopies}
                onChange={(e) => setTotalCopies(parseInt(e.target.value, 10) || 1)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>
          </div>

          {/* Book Image (Upload to ImgBB or Direct URL) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
              Book Cover Image (ImgBB Upload / Image URL) *
            </label>
            <div className="space-y-3">
              {/* File upload input */}
              <div className="flex items-center space-x-3">
                <label className="cursor-pointer inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors">
                  <Upload className="w-4 h-4" />
                  <span>{uploadingImage ? "Uploading to ImgBB..." : "Upload from Computer"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>
                <span className="text-xs text-gray-500">or enter image link below</span>
              </div>

              {/* Direct image URL input */}
              <input
                type="url"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/cover.jpg or uploaded ImgBB link"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />

              {/* Cover Preview */}
              {imageUrl && (
                <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <img
                    src={imageUrl}
                    alt="Cover preview"
                    className="w-12 h-16 object-cover rounded-lg shadow-sm"
                  />
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    Cover image ready for publication!
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
              Short Description *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write a captivating summary of the book..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting || uploadingImage}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Adding Book to Catalog...</span>
                </>
              ) : (
                <>
                  <BookOpen className="w-5 h-5" />
                  <span>Add Book</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
