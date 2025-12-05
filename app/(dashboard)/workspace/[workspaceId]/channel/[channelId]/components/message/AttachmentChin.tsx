import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Image from "next/image";

interface AttachmentChinProps {
  url: string;
  onRemove: () => void;
}
const AttachmentChin = ({ url, onRemove }: AttachmentChinProps) => {
  return (
    <div className="group relative overflow-hidden size-12 rounded-md bg-muted">
      <Image src={url} alt="Attachment" fill className="object-cover" />
      <div className="absolute inset-0 grid place-items-center bg-black-0 opacity-0 transition-opacity group-hover:opacity-100 ">
        <Button
          type="button"
          variant="destructive"
          onClick={() => onRemove()}
          className="size-6">
          <X className="size-3" />
        </Button>
      </div>
    </div>
  );
};

export default AttachmentChin;
