import dns from "node:dns";

// Local-dev only: some machines have a broken/invalid DNS entry that makes
// c-ares refuse SRV lookups, which breaks mongodb+srv:// connections.
// Vercel's resolver is healthy, so never override DNS in production.
if (process.env.NODE_ENV !== "production") {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
}

import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGODB_AUTH_URI);
const db = client.db("RecipeHub-Auth");

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: [process.env.BETTER_AUTH_URL].filter(Boolean),
  database: mongodbAdapter(db, {
    // Optional: if you don't provide a client, database transactions won't be enabled.
    client,
  }),
  user: {
    changeEmail: {
      enabled: true,
    },
    additionalFields: {
      role: {
        type: "string",
        default: "user",
      },
      status: {
        type: "string",
        default: "active",
      },
      plan: {
        default: "user_free",
      },
    },
  },
  //...other options
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
});
