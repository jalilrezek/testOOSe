import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia, TimeSpan } from "lucia";
import { db } from ".";
import { sessions, users } from "./schema";

// ✅ Import Arctic for OAuth
import { GitHub } from "arctic";

const adapter = new DrizzleSQLiteAdapter(db, sessions, users);

// ✅ Initialize Lucia
export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    },
  },
  sessionExpiresIn: new TimeSpan(60, "m"),
});

// ✅ Initialize GitHub OAuth using Arctic
export const githubAuth = new GitHub(
  process.env.GITHUB_CLIENT_ID!,
  process.env.GITHUB_CLIENT_SECRET!,
  process.env.GITHUB_REDIRECT_URI! // Ensure this is set in .env (e.g., http://localhost:3000/auth/github/callback)
);

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    UserId: number;
  }
}
