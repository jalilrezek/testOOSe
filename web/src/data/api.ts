import { API_URL } from "../env";
import type { CommentType, PostType, UserType } from "./types";


export const fetchPosts = async (
  page: number = 1,
  limit: number = 10,
  username?: string,
  titleSearch?: string,
  contentSearch?: string,
): Promise<{ data: PostType[]; total: number }> => {
  // Build query parameters
  const params = new URLSearchParams({
    sort: "desc",
    page: page.toString(),
    limit: limit.toString(),
    ...(username && { username }),
    ...(titleSearch && { titleSearch }),
    ...(contentSearch && { contentSearch }),
  });

  const response = await fetch(`${API_URL}/posts?${params.toString()}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`API request failed! Status: ${response.status}`);
  }

  const { data, total }: { data: PostType[]; total: number } = await response.json();
  return { data, total };
};


// Fetch all posts
//export const fetchPosts = async (
 // page: number = 1,
 // limit: number = 10,
  //username?: string,
//): Promise<{ data: PostType[]; total: number }> => {
  //const response = await fetch(
  //  `${API_URL}/posts?sort=desc&page=${page}&limit=${limit}${username ? `&username=${username}` : ""}`,
   // { credentials: "include" },
  //);
  //if (!response.ok) {
  //  throw new Error(`API request failed! with status: ${response.status}`);
  //}
  //const { data, total }: { data: PostType[]; total: number } =
   // await response.json();
 // return { data, total };
//};

// Delete a post by id
export const deletePost = async (id: string): Promise<boolean> => {
  const response = await fetch(`${API_URL}/posts/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(`API request failed! with status: ${response.status}`);
  }
  return true;
};

// ✅ Create a post (Added `title` to request)
export const createPost = async ({
  title,
  content,
}: {
  title: string;
  content: string;
}): Promise<PostType> => {
  const response = await fetch(`${API_URL}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content }), // ✅ Include title
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(`API request failed! with status: ${response.status}`);
  }
  const data: PostType = await response.json();
  return data;
};

// ✅ Edit a post (Added `title` to request)
export const editPost = async (
  id: string,
  title: string,
  content: string,
): Promise<PostType> => {
  const response = await fetch(`${API_URL}/posts/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content }), // ✅ Include title
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(`API request failed! with status: ${response.status}`);
  }
  const data: PostType = await response.json();
  return data;
};

// Fetch all comments for a post
export const fetchComments = async (
  postId: string,
  page: number = 1,
  limit: number = 10,
  username?: string,
): Promise<{ data: CommentType[]; total: number }> => {
  const response = await fetch(
    `${API_URL}/posts/${postId}/comments?sort=desc&page=${page}&limit=${limit}${username ? `&username=${username}` : ""}`,
    { credentials: "include" },
  );
  if (!response.ok) {
    throw new Error(`API request failed! with status: ${response.status}`);
  }
  const { data, total }: { data: CommentType[]; total: number } =
    await response.json();
  return { data, total };
};

// Delete a comment for a post
export const deleteComment = async (
  postId: string,
  commentId: string,
): Promise<boolean> => {
  const response = await fetch(
    `${API_URL}/posts/${postId}/comments/${commentId}`,
    {
      method: "DELETE",
      credentials: "include",
    },
  );
  if (!response.ok) {
    throw new Error(`API request failed! with status: ${response.status}`);
  }
  return true;
};

// Create a comment for a post
export const createComment = async (
  postId: string,
  content: string,
): Promise<CommentType> => {
  const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content,
    }),
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(`API request failed! with status: ${response.status}`);
  }
  const data: CommentType = await response.json();
  return data;
};

// Edit a comment for a post
export const editComment = async (
  postId: string,
  commentId: string,
  content: string,
): Promise<CommentType> => {
  const response = await fetch(
    `${API_URL}/posts/${postId}/comments/${commentId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
      credentials: "include",
    },
  );
  if (!response.ok) {
    throw new Error(`API request failed! with status: ${response.status}`);
  }
  const data: CommentType = await response.json();
  return data;
};

// Sign up
export const signUp = async (
  name: string,
  username: string,
  password: string,
): Promise<UserType> => {
  const response = await fetch(`${API_URL}/sign-up`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      username,
      password,
    }),
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(`API request failed! with status: ${response.status}`);
  }
  const { user }: { user: UserType } = await response.json();
  return user;
};

// Sign in
export const signIn = async (
  username: string,
  password: string,
): Promise<UserType> => {
  const response = await fetch(`${API_URL}/sign-in`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      password,
    }),
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(`API request failed! with status: ${response.status}`);
  }
  const { user }: { user: UserType } = await response.json();
  return user;
};

// Sign out
export const signOut = async (): Promise<boolean> => {
  const response = await fetch(`${API_URL}/sign-out`, {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(`API request failed! with status: ${response.status}`);
  }
  return true;
};
