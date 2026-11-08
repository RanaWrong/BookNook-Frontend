const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/+$/, "");

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

// Safe JSON Response parser to prevent "Unexpected token '<', <!DOCTYPE" syntax crash
async function parseJsonResponse(res: Response, fallbackMessage: string): Promise<any> {
  const contentType = res.headers.get("content-type") || "";
  
  if (!contentType.includes("application/json")) {
    const preview = await res.text();
    console.error(`[API Non-JSON Response] URL: ${res.url} | Status: ${res.status}`, preview.slice(0, 200));
    throw new Error(
      `Backend API server returned HTML (${res.status}). Please verify NEXT_PUBLIC_API_URL in Vercel points to your live Express backend URL (e.g. https://your-backend.vercel.app), not your Frontend URL.`
    );
  }

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || fallbackMessage);
  }
  return data;
}

// API Methods
// Exchanges the BetterAuth session token for an API JWT. The backend verifies the
// session itself; identity is never taken from what the client sends.
export async function getAuthToken(sessionToken: string): Promise<string> {
  const res = await fetch(`${API_BASE_URL}/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionToken }),
  });

  const data = await parseJsonResponse(res, "Failed to obtain auth token.");
  setToken(data.token);
  return data.token;
}

export async function fetchBooks(
  params?: {
    category?: string;
    sort?: "newest" | "desc" | "asc";
    limit?: number;
    search?: string;
    userEmail?: string;
  },
  token?: string
): Promise<Book[]> {
  const query = new URLSearchParams();
  if (params?.category && params.category !== "All") query.append("category", params.category);
  if (params?.sort) query.append("sort", params.sort);
  if (params?.limit) query.append("limit", String(params.limit));
  if (params?.search) query.append("search", params.search);
  if (params?.userEmail) query.append("userEmail", params.userEmail);

  const headers: Record<string, string> = {};
  const activeToken = token || getToken();
  if (activeToken) {
    headers["Authorization"] = `Bearer ${activeToken}`;
  }

  const url = `${API_BASE_URL}/books${query.toString() ? `?${query.toString()}` : ""}`;
  const res = await fetch(url, { headers, cache: "no-store" });
  const data = await parseJsonResponse(res, "Failed to fetch books.");
  return data.data;
}

export async function fetchBookById(id: string, token?: string): Promise<Book> {
  const headers: Record<string, string> = {};
  const activeToken = token || getToken();
  if (activeToken) {
    headers["Authorization"] = `Bearer ${activeToken}`;
  }

  const res = await fetch(`${API_BASE_URL}/books/${id}`, {
    headers,
    cache: "no-store",
  });
  const data = await parseJsonResponse(res, "Failed to fetch book details.");
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

  const data = await parseJsonResponse(res, "Failed to create book.");
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

  const data = await parseJsonResponse(res, "Failed to update book.");
  return data.data;
}

export async function deleteBook(id: string, token: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/books/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  await parseJsonResponse(res, "Failed to delete book.");
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

  const data = await parseJsonResponse(res, "Failed to borrow book.");
  return data.data;
}

export async function fetchUserBorrows(token: string): Promise<Borrow[]> {
  const res = await fetch(`${API_BASE_URL}/borrows`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const data = await parseJsonResponse(res, "Failed to fetch borrowed books.");
  return data.data;
}

export async function returnBook(borrowId: string, token: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/borrows/${borrowId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  await parseJsonResponse(res, "Failed to return book.");
}
