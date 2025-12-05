import Editor from "@/components/rich-text-editor/Editor";
import ImageUploadModal from "@/components/rich-text-editor/ImageUploadModal";
import { Button } from "@/components/ui/button";
import { ImageIcon, Send } from "lucide-react";
import { useAttachmentUploadType } from "../../../../../../../../hooks/use-attachment-upload";
import AttachmentChin from "./AttachmentChin";

interface MessageComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isPending?: boolean;
  upload: useAttachmentUploadType;
}
const MessageComposer = ({
  onChange,
  value,
  onSubmit,
  isPending,
  upload,
}: MessageComposerProps) => {
  return (
    <>
      <Editor
        onChange={onChange}
        value={value}
        sendButton={
          <Button type="button" disabled={isPending} onClick={onSubmit}>
            <Send /> Send
          </Button>
        }
        footerLeft={
          upload.stageUrl ? (
            <AttachmentChin onRemove={upload.clear} url={upload.stageUrl} />
          ) : (
            <Button variant="outline" type="button" onClick={() => upload.setIsOpen(true)}>
              <ImageIcon className="size-4 mr-1" /> Attech
            </Button>
          )
        }
      />
      <ImageUploadModal
        open={upload.isOpen}
        onOpenChange={upload.setIsOpen}
        onUploaded={(url) => upload.onUploaded(url)}
      />
    </>
  );
};

export default MessageComposer;
