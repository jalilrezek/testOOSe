import Header from "./header";
import { useStore } from "@nanostores/react";
import { $showAddPost, $showAddComment } from "@/lib/store";
import AddPost from "../post/add-post";
import Posts from "../post/posts";
import AddComment from "../comment/add-comment";
import Comments from "../comment/comments";
import useAuth from "@/hooks/use-auth";



const Feed = ({ postId }: { postId?: string }) => {
  const showNewPostEditor = useStore($showAddPost);
  const showNewCommentEditor = useStore($showAddComment);
  const { user } = useAuth();


  console.log("🔍 DEBUG: Current User in Feed:", user); // ✅ Check if `user` is null when logged out

  // ✅ Check if the user is the default user (logged out)
  // note: If logged out, user is set not to null but to a user whose fields are all ""
  // (this is distinct from real users cuz real usernames must have >= 1 char)
  // that's why we check for !user.id not !user
  if (!user.id) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <h2 className="text-xl font-bold">Sign in or create a new account to make notes</h2>
      </div>
    );
  }


  if (!postId) {
    return (
      <div className="flex flex-col w-full min-h-screen border-x">
        <Header />
        {showNewPostEditor && <AddPost />}
        <Posts />
      </div>
    );
  }

  // 👆 Look here 👇

  return (
    <div className="flex flex-col w-full min-h-screen border-x">
      <Header />
      {showNewCommentEditor && <AddComment postId={postId} />}
      <Comments postId={postId} />
    </div>
  );
};

export default Feed;
