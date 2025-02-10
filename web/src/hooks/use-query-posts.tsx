import { useEffect, useState } from "react";
import { fetchPosts } from "@/data/api";
import { useStore } from "@nanostores/react";
import {
  $posts,
  appendPosts,
  incrementPostPage,
  setHasMorePosts,
  setPosts,
} from "@/lib/store";
import { toast } from "@/components/ui/use-toast";
import useAuth from "@/hooks/use-auth";

// edits: Removed use of enableFilter and changed up the useEffect() hook to ensure refresh upon
// signing out so that we don't still see the previous user's notes

function useQueryPosts() {
  const posts = useStore($posts);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth(); // ✅ Track authenticated user

  const loadPosts = async (
    page: number = 1,
    limit: number = 10,
    titleSearch?: string,
    contentSearch?: string,
  ) => {
    if (!user) {
      console.log("🔹 INFO: No user logged in. Skipping post fetch.");
      setPosts([]); // ✅ Immediately clear posts if no user (not logged in)
      return;
    }

    setIsLoading(true);
    try {
      const { data: fetchedPosts, total } = await fetchPosts(
        page,
        limit,
        user.username,
        titleSearch,
        contentSearch,
      );
      setHasMorePosts(posts.length + fetchedPosts.length < total);
      if (page === 1) {
        setPosts(fetchedPosts);
      } else {
        appendPosts(fetchedPosts);
        incrementPostPage();
      }
    } catch (error) {
      const errorMessage = (error as Error).message ?? "Please try again later!";
      toast({
        variant: "destructive",
        title: "Sorry! There was an error reading the posts 🙁",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Ensure posts refresh when `user` changes (logs in or logs out)
  useEffect(() => {
    if (!user) {
      console.log("🔹 INFO: User logged out, clearing posts...");
      setPosts([]); // ✅ Clear posts when user logs out
    } else {
      console.log("🔹 INFO: User logged in, loading posts...");
      loadPosts(); // ✅ Reload posts when user logs in
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]); // ✅ Runs when `user` changes

  return { posts, loadPosts, isLoading };
}

export default useQueryPosts;