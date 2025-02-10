import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { updatePost } = useMutationPosts();
  const { toast } = useToast();

  useEffect(() => {
    if (
      post &&
      (post.id !== id || post.content !== content || post.title !== title)
    ) {
      setId(post.id);
      setTitle(post.title);
      setContent(post.content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post]);

  const cleanUp = () => {
    setIsEditing(false);
  };

  const savePost = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        variant: "destructive",
        title: "Invalid Input",
        description: `Both title and content are required.`,
      });
      return;
    }
    await updatePost(id, title, content);
    cleanUp();
  };

  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    savePost();
  };

  const handleSaveOnEnter = (
    e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      savePost();
    }
  };

  const handleCancel = () => {
    cleanUp();
  };

  return (
    <form className="grid w-full gap-1.5 p-4 border-b">
      <Label htmlFor="title">Edit Title</Label>
      <Input
        id="title"
        placeholder="Type your post title here."
        value={title}
        onKeyDown={handleSaveOnEnter}
        onChange={(e) => setTitle(e.target.value)}
      />

      <Label htmlFor="content">Edit Content</Label>
      <Textarea
        id="content"
        placeholder="Type your post content here."
        value={content}
        onKeyDown={handleSaveOnEnter}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="flex justify-end gap-3">
        <Button type="reset" variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="submit" onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default EditPost;
