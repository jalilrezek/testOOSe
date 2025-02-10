import useQueryPosts from "@/hooks/use-query-posts";
import { toggleSearchNote } from "@/lib/store";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input"; // ✅ Import Input for Title
import { useToast } from "@/components/ui/use-toast";

const SearchNotes = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { loadPosts } = useQueryPosts();
  const { toast } = useToast();

  const cleanUp = () => {
    setTitle("");
    setContent("");
    toggleSearchNote(); // need to do this
  };

  const findNotes = async () => {
    // error handling or do nothing if both title & content are empty
    //await loadPosts();
  };

  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    findNotes();
  };

  const handleSaveOnEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      findNotes();
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
        placeholder="Enter the title to search for"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* ✅ Content Input */}
      <Label htmlFor="content" className="text-sm">
        Content
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
          Search
        </Button>
      </div>
    </form>
  );
};

export default SearchNotes;
