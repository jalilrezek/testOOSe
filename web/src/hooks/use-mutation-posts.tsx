import { toast } from "@/components/ui/use-toast";
import { createPost, deletePost, editPost } from "@/data/api";
import { addPost, removePost, updatePostContent } from "@/lib/store";
import useAuth from "@/hooks/use-auth";

function useMutationPosts() {
  const { user } = useAuth();

  const deletePostById = async (postId: string) => {
    try {
      await deletePost(postId);
      removePost(postId);
    } catch (error) {
      const errorMessage =
        (error as Error).message ?? "Please try again later!";
      toast({
        variant: "destructive",
        title: "Sorry! There was an error deleting the post 🙁",
        description: errorMessage,
      });
    }
  };

  // ✅ Added `title` field when creating a post
  const addNewPost = async (title: string, content: string) => {
    try {
      const newPost = await createPost({ title, content });
      newPost.author = user;
      addPost(newPost);
    } catch (error) {
      const errorMessage =
        (error as Error).message ?? "Please try again later!";
      toast({
        variant: "destructive",
        title: "Sorry! There was an error adding a new post 🙁",
        description: errorMessage,
      });
    }
  };

  // ✅ Added `title` field when updating a post
  const updatePost = async (postId: string, title: string, content: string) => {
    try {
      const updatedPost = await editPost(postId, title, content);
      updatePostContent(updatedPost.id, updatedPost.title, updatedPost.content);
    } catch (error) {
      const errorMessage =
        (error as Error).message ?? "Please try again later!";
      toast({
        variant: "destructive",
        title: "Sorry! There was an error updating the post 🙁",
        description: errorMessage,
      });
    }
  };

  return {
    deletePostById,
    addNewPost,
    updatePost,
  };
}

export default useMutationPosts;
