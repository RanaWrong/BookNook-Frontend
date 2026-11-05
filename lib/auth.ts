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

const uri =
  process.env.MONGODB_URI ||
  "mongodb://localhost:27017/booknook";

const client = new MongoClient(uri);
const db = client.db("booknook");

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "placeholder-google-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "placeholder-google-client-secret",
      enabled: Boolean(process.env.GOOGLE_CLIENT_ID),
    },
  },
  secret: process.env.BETTER_AUTH_SECRET || "REMOVED_SECRET",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
});
