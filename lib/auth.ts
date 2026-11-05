import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/booknook";
const client = new MongoClient(uri);
const db = client.db("booknook");

export const auth = betterAuth({
  database: db,
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
