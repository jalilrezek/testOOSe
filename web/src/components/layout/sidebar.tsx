import {
  ChatBubbleIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { useStore } from "@nanostores/react";
import {
  $showAddPost,
  $showAddComment,
  $showSearchNote,
  toggleAddPost,
  toggleAddComment,
  toggleSearchNote,
} from "@/lib/store";
import { $router } from "@/lib/router";
import { openPage } from "@nanostores/router";
import useAuth from "@/hooks/use-auth";
import { toast } from "@/components/ui/use-toast";

const Sidebar = () => {
  const page = useStore($router);
  const showAddPost = useStore($showAddPost);
  const showAddComment = useStore($showAddComment);
  const showSearchNote = useStore($showSearchNote);
  const { user } = useAuth();

  const authGuard = () => {
    if (user.username) return true;
    toast({
      variant: "destructive",
      title: "Sorry! You need to be signed in to do that 🙁",
      description: "Please sign in or create an account to continue.",
    });
    return false;
  };

  // Look here 👇
  const navigateHome = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    openPage($router, "home");
  };

  if (!page) return null;

  return (
    <div className="flex flex-col items-end p-2 space-y-2">
      <Button
        aria-label={"Home"}
        variant="ghost"
        size="icon"
        onClick={navigateHome} // 👈 look here
      >
        <HomeIcon className="w-5 h-5" />
      </Button>

      {page.route === "home" && !showSearchNote && (
        <Button
          aria-label={"Search"}
          variant="ghost"
          size="icon"
          onClick={() => {
            authGuard() && toggleSearchNote();
          }}
        >
          <MagnifyingGlassIcon className="w-5 h-5" />
        </Button>
      )}

      {page.route === "home" && !showAddPost && (
        <Button
          aria-label={"Make a Post"}
          variant="default"
          size="icon"
          onClick={() => {
            authGuard() && toggleAddPost();
          }}
        >
          <PlusCircledIcon className="w-5 h-5" />
        </Button>
      )}
      {page.route === "post" && !showAddComment && (
        <Button
          aria-label={"Make a Comment"}
          variant="default" // 👈 look here
          size="icon"
          onClick={() => {
            authGuard() && toggleAddComment();
          }}
        >
          <ChatBubbleIcon className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
};

export default Sidebar;
