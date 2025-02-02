import Post from "./post";
import useQueryPosts from "@/hooks/use-query-posts";
import InfiniteScroll from "@/components/shared/infinite-scroll";
import { useStore } from "@nanostores/react";
import { $currentPostPage, $hasMorePosts, $enableFilter } from "@/lib/store";
import useAuth from "@/hooks/use-auth";

const Posts = () => {
  const currentPage = useStore($currentPostPage);
  const hasMorePosts = useStore($hasMorePosts);
  const enableFilter = useStore($enableFilter);
  const { posts, loadPosts, isLoading } = useQueryPosts();
  const { user } = useAuth(); // ✅ Get authentication state


  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <h2 className="text-xl font-bold">Sign in or create a new account to make notes</h2>
      </div>
    );
  }

  const loadMorePosts = () => {
    loadPosts(currentPage + 1);
  };

  return (
    <div className="space-y-4">
      <InfiniteScroll
        loadMore={loadMorePosts}
        hasMore={hasMorePosts}
        isLoading={isLoading}
        key={enableFilter ? "filtered" : "all"}
      >
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default Posts;
