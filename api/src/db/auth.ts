import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia, TimeSpan } from "lucia";
import { db } from ".";
import { sessions, users } from "./schema";

// FOR OAUTH //
import { GitHub } from "@lucia-auth/oauth/providers";

export const githubAuth = new GitHub(lucia, {
  clientId: process.env.GITHUB_CLIENT_ID!,
  clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  redirectUri: "http://localhost:3000/auth/github/callback",
});

// END OAUTH //


const adapter = new DrizzleSQLiteAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    },
  },
  sessionExpiresIn: new TimeSpan(60, "m"),
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    UserId: number;
  }
}


