import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { signInSchema, signUpSchema } from "../validators/schemas";
import { users } from "../db/schema";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import { hash, verify } from "@node-rs/argon2";
import { lucia } from "../db/auth";
import type { Context } from "../lib/context.js";

// 🔹 Import Arctic GitHub OAuth
import { generateState } from "arctic";
import { githubAuth } from "../db/auth";

const authRoutes = new Hono<Context>();

// Recommended minimum parameters for Argon2 hashing
const hashOptions = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
}


// FOR OAUTH // 


/* ✅ STEP 1: Redirect user to GitHub OAuth login */
authRoutes.get("/auth/github", async (c) => {
  const state = generateState();
  const authUrl = githubAuth.createAuthorizationURL(state, []);

  // ✅ Use `Set-Cookie` header instead of `c.cookie()`
  c.header(
    "Set-Cookie",
    `github_oauth_state=${state}; Path=/; HttpOnly; Secure=${process.env.NODE_ENV === "production"}; Max-Age=600; SameSite=Lax`
  );

  return c.redirect(authUrl.toString());
});

/* ✅ STEP 2: Handle GitHub OAuth callback */
authRoutes.get("/auth/github/callback", async (c) => {
  const code = c.req.query("code");
  const state = c.req.query("state");

  if (!code || !state) {
    throw new HTTPException(400, { message: "OAuth code or state missing" });
  }

  // Manually parse cookies from request header
  const cookieHeader = c.req.header("Cookie") || "";
  const cookies = Object.fromEntries(
    cookieHeader
      .split("; ")
      .map((c) => c.split("=").map(decodeURIComponent))
  );
  const storedState = cookies["github_oauth_state"];

  if (state !== storedState) {
    throw new HTTPException(400, { message: "Invalid OAuth state" });
  }

  try {
    // Exchange code for tokens
    const tokens = await githubAuth.validateAuthorizationCode(code);

    // Fetch user data from GitHub API
    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${tokens.accessToken()}` },
    });
    const githubUser = await githubUserResponse.json();

    if (!githubUser.id || !githubUser.login) {
      throw new HTTPException(400, { message: "GitHub user info missing" });
    }

    // Check if user exists
    let user = await db.select().from(users).where(eq(users.username, githubUser.login)).get();

    if (!user) {
      // Create new user if they don't exist
      user = await db
        .insert(users)
        .values({
          name: githubUser.name || githubUser.login,
          username: githubUser.login,
          password: "", // ✅ Allow null passwords for OAuth users, or just set it to "". Hopefully both work.
        })
        .returning()
        .get();
    }

    // Create session for the user using Lucia
    const session = await lucia.createSession(user.id, {});
    const cookie = lucia.createSessionCookie(session.id);
    c.header("Set-Cookie", cookie.serialize(), { append: true });

    return c.redirect("http://localhost:5173/");
    
  } catch (error) {
    console.error("OAuth callback error:", error);
    throw new HTTPException(500, { message: "OAuth login failed" });
  }
});

// END OAUTH //

authRoutes.post("/sign-in", 
  zValidator("json", signInSchema),
  async (c) => {
    const { username, password } = c.req.valid("json");
    
    const user = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .get();

    if (!user) {
      throw new HTTPException(401, {
        message: "Invalid username or password",
      });
    }

    const validPassword = await verify(user.password,  password, hashOptions);
    if (!validPassword) {
      throw new HTTPException(401, {
        message: "Invalid username or password",
      });
    }

    const { password: _, ...rest } = user;

    // crete a session for the user
    const session = await lucia.createSession(user.id, {});
    const cookie = lucia.createSessionCookie(session.id);
    c.header("Set-Cookie", cookie.serialize(), {
      append: true,
    })

    return c.json({ 
      message: "You have been signed in!",
      user: rest
     });
  }
);

authRoutes.post("/sign-up",
  zValidator("json", signUpSchema), 
  async (c) => {
    const { name, username, password } = c.req.valid("json");
    
    const hashedPassword = await hash(password, hashOptions);

    const newUser = await db
      .insert(users)
      .values(
        {
          name,
          username,
          password: hashedPassword
        }
      )
      .returning()
      .get();

    // crete a session for the new user
    const session = await lucia.createSession(newUser.id, {});
    const cookie = lucia.createSessionCookie(session.id);
    c.header("Set-Cookie", cookie.serialize(), {
      append: true,
    })

    return c.json({ 
      message: "You have been signed up!",
      user: {
        id: newUser.id,
        name: newUser.name,
        username: newUser.username,
      }
    }, 201);
  }
);

authRoutes.post("/sign-out", async (c) => {
  const session = c.get("session");
  if (!session) {
    throw new HTTPException(401, { message: "No session found" });
  }

  await lucia.invalidateSession(session.id);
  const sessionCookie = lucia.createBlankSessionCookie();
  c.header("Set-Cookie", sessionCookie.serialize()); // Remove the session cookie from the client

  return c.json({ message: "You have been signed out!" });
});

export default authRoutes;