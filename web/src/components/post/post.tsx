import type { PostType as PostType } from "@/data/types";
import PostActions from "./post-actions";
import { useState } from "react";
import EditPost from "./edit-post";

const Post = ({ post }: { post: PostType }) => {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return <EditPost post={post} setIsEditing={setIsEditing} />;
  }

  return (
    <div className="p-1 border-b">
      <div className="flex items-center justify-between pl-4">
        <div>
          <h4 className="text-xs text-muted-foreground">
            {new Date(post.date).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
            })}
          </h4>
        </div>
        <PostActions post={post} setIsEditing={setIsEditing} />
      </div>
      {/* ✅ Added title */}
      <h3 className="text-lg font-semibold p-4">{post.title}</h3>
      <p className="p-4">{post.content}</p>
    </div>
  );
};

export default Post;
