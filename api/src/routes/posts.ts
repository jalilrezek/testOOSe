import { Hono } from "hono";
import { db } from "../db";
import { posts, users } from "../db/schema";
import { eq, asc, desc, like, count, SQL, and, or } from "drizzle-orm";
import {
  createPostSchema,
  updatePostSchema,
  getPostSchema,
  queryParamsSchema,
} from "../validators/schemas";
import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import type { Context } from "../lib/context.js";
import { authGuard } from "../middleware/auth-guard"; 

const postRoutes = new Hono<Context>();

postRoutes.get("/posts", zValidator("query", queryParamsSchema), async (c) => {
  const { sort, titleSearch, contentSearch, page = 1, limit = 10 } = c.req.valid("query");

  const user = c.get("user");

  if (!user) {
    return c.json({ data: [], message: "No posts available. Please log in to create and view notes." });
  }

  const whereClause = [
    eq(posts.userId, user.id),
  ];

  // Dynamic OR filtering for title or content search
  const searchConditions = or(
    ...(titleSearch ? [like(posts.title, `%${titleSearch}%`)] : []),
    ...(contentSearch ? [like(posts.content, `%${contentSearch}%`)] : [])
  );

  if (titleSearch || contentSearch) {
    whereClause.push(searchConditions);
  }

  const orderByClause: SQL[] = [];
  if (sort === "desc") {
    orderByClause.push(desc(posts.date));
  } else if (sort === "asc") {
    orderByClause.push(asc(posts.date));
  }

  const offset = (page - 1) * limit;

  const [userPosts, [{ totalCount }]] = await Promise.all([
    db
      .select({
        id: posts.id,
        title: posts.title,
        content: posts.content,
        date: posts.date,
        author: {
          id: users.id,
          name: users.name,
          username: users.username,
        },
      })
      .from(posts)
      .leftJoin(users, eq(posts.userId, users.id))
      .where(and(...whereClause))
      .orderBy(...orderByClause)
      .limit(limit)
      .offset(offset),
    db
      .select({ totalCount: count() })
      .from(posts)
      .where(and(...whereClause)),
  ]);

  return c.json({
    data: userPosts,
    page,
    limit,
    total: totalCount,
  });
});



// Get a single post by id
postRoutes.get("/posts/:id", zValidator("param", getPostSchema), async (c) => {
  const { id } = c.req.valid("param");
  const post = await db
    .select({
      id: posts.id,
      title: posts.title,
      content: posts.content,
      date: posts.date,
      author: {
        id: users.id,
        name: users.name,
        username: users.username,
      },
    })
    .from(posts)
    .leftJoin(users, eq(posts.userId, users.id))
    .where(eq(posts.id, id))
    .get();
  if (!post) {
    throw new HTTPException(404, { message: "Post not found" });
  }
  return c.json(post);
});

// Delete a post by id
postRoutes.delete(
  "/posts/:id",
  authGuard,
  zValidator("param", getPostSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const user = c.get("user");

    const post = await db.select().from(posts).where(eq(posts.id, id)).get();

    if (!post) {
      throw new HTTPException(404, { message: "Post not found" });
    }

    if (post.userId !== user!.id) {
      throw new HTTPException(403, {
        message: "Unauthorized to delete this post",
      });
    }

    const deletedPost = await db
      .delete(posts)
      .where(eq(posts.id, id))
      .returning()
      .get();

    return c.json(deletedPost);
  },
);

// Create a new post
postRoutes.post(
  "/posts",
  authGuard,
  zValidator("json", createPostSchema),
  async (c) => {
    const { title, content } = c.req.valid("json");
    const user = c.get("user");

    const newPost = await db
      .insert(posts)
      .values({
        title,
        content,
        date: new Date(),
        userId: user!.id,
      })
      .returning()
      .get();

    return c.json(newPost);
  },
);

// Update a post by id
postRoutes.patch(
  "/posts/:id",
  authGuard,
  zValidator("param", getPostSchema),
  zValidator("json", updatePostSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const { title, content } = c.req.valid("json"); // ✅ Validate title
    const user = c.get("user");

    const post = await db.select().from(posts).where(eq(posts.id, id)).get();

    if (!post) {
      throw new HTTPException(404, { message: "Post not found" });
    }

    if (post.userId !== user!.id) {
      throw new HTTPException(403, {
        message: "Unauthorized to update this post",
      });
    }

    const updatedPost = await db
      .update(posts)
      .set({ title, content })
      .where(eq(posts.id, id))
      .returning()
      .get();

    return c.json(updatedPost);
  },
);

export default postRoutes;
