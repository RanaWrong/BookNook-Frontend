const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface Book {
  _id: string;
  title: string;
  author: string;
  category: "Fiction" | "Science" | "History" | "Kids" | "Others";
  image: string;
  description: string;
  totalCopies: number;
  availableCopies: number;
  userEmail: string;
  userName: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Borrow {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookImage: string;
  userEmail: string;
  userName: string;
  borrowDate: string;
  returnDate: string;
  status: "borrowed" | "returned";
  createdAt: string;
}

// Helper to get JWT token from localStorage or session
export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("booknook_token");
};

export const setToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("booknook_token", token);
  }
};

export const removeToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("booknook_token");
  }
};

// API Methods
export async function getAuthToken(user: { id?: string; email: string; name?: string }): Promise<string> {
  const res = await fetch(`${API_BASE_URL}/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to obtain auth token.");
  }

  setToken(data.token);
  return data.token;
}

export async function fetchBooks(params?: {
  category?: string;
  sort?: "newest" | "desc" | "asc";
  limit?: number;
  search?: string;
  userEmail?: string;
}): Promise<Book[]> {
  const query = new URLSearchParams();
  if (params?.category && params.category !== "All") query.append("category", params.category);
  if (params?.sort) query.append("sort", params.sort);
  if (params?.limit) query.append("limit", String(params.limit));
  if (params?.search) query.append("search", params.search);
  if (params?.userEmail) query.append("userEmail", params.userEmail);

  const url = `${API_BASE_URL}/books${query.toString() ? `?${query.toString()}` : ""}`;
  const res = await fetch(url, { cache: "no-store" });
  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch books.");
  }
  return data.data;
}

export async function fetchBookById(id: string): Promise<Book> {
  const res = await fetch(`${API_BASE_URL}/books/${id}`, { cache: "no-store" });
  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch book details.");
  }
  return data.data;
}

export async function createBook(bookData: Partial<Book>, token: string): Promise<Book> {
  const res = await fetch(`${API_BASE_URL}/books`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(bookData),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to create book.");
  }
  return data.data;
}

export async function updateBook(id: string, bookData: Partial<Book>, token: string): Promise<Book> {
  const res = await fetch(`${API_BASE_URL}/books/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(bookData),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to update book.");
  }
  return data.data;
}

export async function deleteBook(id: string, token: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/books/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to delete book.");
  }
}

export async function borrowBook(payload: { bookId: string; returnDate: string }, token: string): Promise<Borrow> {
  const res = await fetch(`${API_BASE_URL}/borrows`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to borrow book.");
  }
  return data.data;
}

export async function fetchUserBorrows(token: string): Promise<Borrow[]> {
  const res = await fetch(`${API_BASE_URL}/borrows`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch borrowed books.");
  }
  return data.data;
}

export async function returnBook(borrowId: string, token: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/borrows/${borrowId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to return book.");
  }
}
