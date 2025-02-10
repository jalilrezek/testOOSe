import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input"; // ✅ Import Input for Title
import { toggleAddPost } from "@/lib/store";
import useMutationPosts from "@/hooks/use-mutation-posts";
import { useToast } from "@/components/ui/use-toast";

const AddPost = () => {
  const [title, setTitle] = useState(""); // ✅ New state for title
  const [content, setContent] = useState("");
  const { addNewPost } = useMutationPosts();
  const { toast } = useToast();

  const cleanUp = () => {
    setTitle(""); // ✅ Reset title
    setContent("");
    toggleAddPost();
  };

  const savePost = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        variant: "destructive",
        title: "Sorry! Title and content cannot be empty! 🙁",
        description: `Please enter both a title and the content of your note.`,
      });
    } else {
      await addNewPost(title, content); // ✅ Pass title to mutation
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
      {/* ✅ Title Input */}
      <Label htmlFor="title" className="text-sm">
        Title
      </Label>
      <Input
        id="title"
        placeholder="Enter a title for your note"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* ✅ Content Input */}
      <Label htmlFor="content" className="text-sm">
        Your note
      </Label>
      <Textarea
        id="content"
        placeholder="Type your message here."
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

export default AddPost;
