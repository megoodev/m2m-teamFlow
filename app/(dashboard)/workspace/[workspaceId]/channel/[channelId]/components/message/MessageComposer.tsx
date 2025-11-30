import Editor from "@/components/rich-text-editor/Editor";
import { Button } from "@/components/ui/button";
import { ImageIcon, Send } from "lucide-react";
import React from "react";

interface MessageComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isPending?: boolean;
}
const MessageComposer = ({
  onChange,
  value,
  onSubmit,
  isPending,
}: MessageComposerProps) => {
  return (
    <Editor
      onChange={onChange}
      value={value}
      sendButton={
        <Button type="button" disabled={isPending} onClick={onSubmit}>
          <Send /> Send
        </Button>
      }
      footerLeft={
        <Button variant="outline">
          <ImageIcon className="size-4 mr-1" /> Attempt
        </Button>
      }
    />
  );
};

export default MessageComposer;
