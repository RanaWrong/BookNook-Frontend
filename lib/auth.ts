import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import dns from "node:dns";

// Ensure DNS resolvers handle Atlas SRV records smoothly on all environments
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {
  // Ignore in browser or restricted runtime
}

function getSanitizedMongoUri(): string {
  let raw = process.env.MONGODB_URI || "";
  raw = raw.trim().replace(/^["']|["']$/g, "").trim();

  if (raw && !raw.startsWith("mongodb://") && !raw.startsWith("mongodb+srv://")) {
    if (raw.includes(".mongodb.net") || raw.includes("@")) {
      raw = `mongodb+srv://${raw}`;
    }
  }

  return raw || "mongodb://localhost:27017/booknook";
}

const uri = getSanitizedMongoUri();

const client = new MongoClient(uri);
const db = client.db("booknook");

// Secrets that were published in this repository must never be used again.
const betterAuthSecret = process.env.BETTER_AUTH_SECRET;
if (betterAuthSecret && /booknook|development-fallback|changeme|your_/i.test(betterAuthSecret)) {
  throw new Error(
    "BETTER_AUTH_SECRET is a known placeholder. Generate a new one: openssl rand -base64 48"
  );
}

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      enabled: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    },
  },
  // No fallback: better-auth refuses to run without BETTER_AUTH_SECRET.
  secret: betterAuthSecret,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
});
