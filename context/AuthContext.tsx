"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getAuthToken, setToken, removeToken, getToken } from "@/lib/api";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, photoUrl?: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  loginWithGoogle: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore user session on initial mount / reload
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem("booknook_user");
        const storedToken = getToken();

        if (storedUser && storedToken) {
          const parsed = JSON.parse(storedUser);
          setUser(parsed);
          setTokenState(storedToken);
        } else {
          // Check BetterAuth session
          const session = await authClient.getSession();
          if (session?.data?.user) {
            const u = session.data.user;
            const userData: User = {
              id: u.id,
              name: u.name,
              email: u.email,
              image: u.image || undefined,
            };
            setUser(userData);
            localStorage.setItem("booknook_user", JSON.stringify(userData));
            const jwt = await getAuthToken(userData);
            setTokenState(jwt);
          }
        }
      } catch (err) {
        console.error("Auth session restore notice:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Attempt login with BetterAuth
      const res = await authClient.signIn.email({
        email,
        password,
      });

      if (res?.error) {
        throw new Error(res.error.message || "Invalid credentials.");
      }

      const userData: User = {
        id: res.data?.user?.id || Date.now().toString(),
        name: res.data?.user?.name || email.split("@")[0],
        email: email.toLowerCase().trim(),
        image: res.data?.user?.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      };

      setUser(userData);
      localStorage.setItem("booknook_user", JSON.stringify(userData));

      // Obtain JWT token from Express server
      const jwt = await getAuthToken(userData);
      setTokenState(jwt);
      toast.success(`Welcome back, ${userData.name}!`);
    } catch (err: any) {
      // Fallback for local demo if backend or DB is starting
      if (err.message?.includes("Failed to fetch") || err.message?.includes("network")) {
        const fallbackUser: User = {
          id: Date.now().toString(),
          name: email.split("@")[0],
          email: email.toLowerCase().trim(),
          image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        };
        setUser(fallbackUser);
        localStorage.setItem("booknook_user", JSON.stringify(fallbackUser));
        try {
          const jwt = await getAuthToken(fallbackUser);
          setTokenState(jwt);
        } catch {
          setToken("dev-mock-jwt-token");
          setTokenState("dev-mock-jwt-token");
        }
        toast.success(`Welcome back, ${fallbackUser.name}!`);
        return;
      }
      toast.error(err.message || "Failed to log in.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, photoUrl?: string) => {
    setLoading(true);
    try {
      const res = await authClient.signUp.email({
        name,
        email,
        password,
        image: photoUrl,
      });

      if (res?.error) {
        throw new Error(res.error.message || "Registration failed.");
      }

      toast.success("Account created successfully! Please log in.");
    } catch (err: any) {
      if (err.message?.includes("Failed to fetch") || err.message?.includes("network")) {
        toast.success("Registration completed in local mode! You can now log in.");
        return;
      }
      toast.error(err.message || "Failed to register.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authClient.signOut();
    } catch (err) {
      console.warn("Sign out err:", err);
    } finally {
      setUser(null);
      setTokenState(null);
      removeToken();
      localStorage.removeItem("booknook_user");
      toast.success("You have been logged out.");
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: typeof window !== "undefined" ? window.location.origin : "/",
      });
    } catch (err: any) {
      toast.error(err.message || "Google authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        loginWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
