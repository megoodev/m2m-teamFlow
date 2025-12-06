import SafeContent from "@/components/rich-text-editor/SafeContent";
import { Message } from "@/lib/generated/prisma/client";
import { getAvatar } from "@/lib/git-avatar";
import Image from "next/image";

interface MessageItemProps {
  message: Message;
}
const MessageItem = ({ message }: MessageItemProps) => {
  return (
    <div className="flex space-x-3 relative p-3 rounded-lg group hover:bg-muted/50 min-w-0">
      <Image
        src={getAvatar(message.AuthorAvatar, message.authorEmail!)}
        className="size-8 rounded-lg"
        height={32}
        width={32}
        alt="user avatar"
      />
      <div className="flex-1 space-y-1 min-w-0">
        <div className="flex items-center leading-none gap-x-2">
          <p className="leading-none font-medium">{message.AuthorName}</p>
          <p className="text-xs text-muted-foreground">
            {new Intl.DateTimeFormat("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }).format(message.createdAt)}{" "}
            {new Intl.DateTimeFormat("en-GB", {
              hour12: true,
              hour: "2-digit",
              minute: "2-digit",
            }).format(message.createdAt)}
          </p>
        </div>
        <SafeContent
          className="text-sm wrap-break-word prose dark:prose-invert"
          content={JSON.parse(message.content)}
        />
        {message.imageUrl && (
          <div className="mt-3 ">
            <Image
              src={message.imageUrl}
              width={512}
              height={512}
              alt="Message attachment"
              className="rounded-md max-h-80 w-auto object-contain"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;
