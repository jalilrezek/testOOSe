import { atom } from "nanostores";
import { persistentMap } from "@nanostores/persistent";
import { logger } from "@nanostores/logger";
import type { CommentType, PostType, UserType } from "@/data/types";

const DEBUG = false;

export const $showSearchNote = atom(false);

export function toggleSearchNote() {
  $showSearchNote.set(!$showSearchNote.get());
}

export const $showAddPost = atom(false);

export function toggleAddPost() {
  $showAddPost.set(!$showAddPost.get());
}

export const $posts = atom<PostType[]>([]);
export const $currentPostPage = atom(1);
export const $hasMorePosts = atom(true);

export function setPosts(posts: PostType[]) {
  $posts.set(posts);
}

export function appendPosts(newPosts: PostType[]) {
  $posts.set([...$posts.get(), ...newPosts]);
}

export function incrementPostPage() {
  $currentPostPage.set($currentPostPage.get() + 1);
}

export function setHasMorePosts(hasMore: boolean) {
  $hasMorePosts.set(hasMore);
}

export function addPost(post: PostType) {
  $posts.set([post, ...$posts.get()]);
}

export function removePost(id: string) {
  $posts.set($posts.get().filter((post) => post.id !== id));
}

export function updatePostContent(id: string, title: string, content: string) {
  $posts.set(
    $posts.get().map((post) => {
      if (post.id === id) {
        return { ...post, title: title, content: content };
      }
      return post;
    }),
  );
}


export const $comments = atom<CommentType[]>([]);
export const $currentCommentPage = atom(1);
export const $hasMoreComments = atom(true);

export function setComments(comments: CommentType[]) {
  $comments.set(comments);
}

export function appendComments(newComments: CommentType[]) {
  $comments.set([...$comments.get(), ...newComments]);
}

export function incrementCommentPage() {
  $currentCommentPage.set($currentCommentPage.get() + 1);
}

export function setHasMoreComments(hasMore: boolean) {
  $hasMoreComments.set(hasMore);
}

export function addComment(comment: CommentType) {
  $comments.set([comment, ...$comments.get()]);
}

export function removeComment(id: string) {
  $comments.set($comments.get().filter((comment) => comment.id !== id));
}

export function updateCommentContent(id: string, content: string) {
  $comments.set(
    $comments.get().map((comment) => {
      if (comment.id === id) {
        return { ...comment, content: content };
      }
      return comment;
    }),
  );
}

export const $showAddComment = atom(false);

export function toggleAddComment() {
  $showAddComment.set(!$showAddComment.get());
}

const defaultUser: UserType = {
  id: "",
  name: "",
  username: "",
};

export const $user = persistentMap<UserType>("user:", defaultUser);

export function setUser(user: UserType) {
  $user.set(user);
}

export function clearUser() {
  $user.set(defaultUser);
}

DEBUG &&
  logger({
    $user,
    $posts,
    $comments,
  });

export const $enableFilter = atom(false);

export function setEnableFilter(enable: boolean) {
  $enableFilter.set(enable);
}
