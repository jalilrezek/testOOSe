import { z } from "zod";

export const signInSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const signUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z.string().min(1, "Username is required"),
  // TODO: Add password requirements
  password: z.string().min(1, "Password is required"),
});

export const createPostSchema = z.object({
  title: z
    .string()
    .min(1, "title required")
    .max(100, "title must be <= 100 chars"),
  content: z
    .string()
    .min(1, "Content is required")
    .max(240, "Content must be 240 characters or less"),
});

export const updatePostSchema = createPostSchema.partial();

export const getPostSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Content is required")
    .max(120, "Content must be 120 characters or less"),
});

export const updateCommentSchema = createCommentSchema.partial();

export const getCommentsSchema = z.object({
  postId: z.coerce.number().int().positive(),
});

export const getCommentSchema = z.object({
  postId: z.coerce.number().int().positive(),
  commentId: z.coerce.number().int().positive(),
});

export const queryParamsSchema = z.object({
  sort: z.enum(["asc", "desc"]).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  username: z.string().optional(),
});
