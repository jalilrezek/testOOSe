import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PostType } from "@/data/types";
import { useToast } from "@/components/ui/use-toast";
import useMutationPosts from "@/hooks/use-mutation-posts";

const EditPost = ({
  post,
  setIsEditing,
}: {
  post: PostType;
  setIsEditing: (flag: boolean) => void;
}) => {
  const [id, setId] = useState("");
  const [content, setContent] = useState("");
  const { updatePost } = useMutationPosts();
  const { toast } = useToast();

  useEffect(() => {
    if (post && post.id !== id && post.content !== content) {
      setId(post.id);
      setContent(post.content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post]);

  const cleanUp = () => {
    setIsEditing(false);
  };

  const savePost = async () => {
    if (!content) {
      toast({
        variant: "destructive",
        title: "Sorry! Post cannot be empty! 🙁",
        description: `Please enter the content of your post.`,
      });
    } else {
      await updatePost(id, content);
      cleanUp();
    }
  };

  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    savePost();
  };

  const handleSaveOnEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      savePost();
    }
  };

  const handleCancel = () => {
    cleanUp();
  };

  return (
    <form className="grid w-full gap-1.5 p-4 border-b">
      <Label htmlFor="content">Edit your note</Label>
      <Textarea
        id="content"
        placeholder="Type your post here."
        value={content}
        onKeyDown={handleSaveOnEnter}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="flex justify-end gap-3">
        <Button type="reset" variant={"secondary"} onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="submit" onClick={handleSave}>
          Add Note
        </Button>
      </div>
    </form>
  );
};

export default EditPost;
