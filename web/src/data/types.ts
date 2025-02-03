export type PostType = {
  id: string;
  title: string;
  content: string;
  date: string;
  author: UserType;
};

export type CommentType = {
  id: string;
  content: string;
  date: string;
  postId: string;
  author: UserType;
};

export type UserType = {
  id: string;
  name: string;
  username: string;
};
