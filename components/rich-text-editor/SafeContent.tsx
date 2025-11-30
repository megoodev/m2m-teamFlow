import { convertJsontoHtml } from "@/lib/convertJsonTohtml";
import { cn } from "@/lib/utils";
import { type JSONContent } from "@tiptap/react";
import domPurify from "dompurify";
import parse from "html-react-parser";
interface iAppProps {
  content: JSONContent;
  className?: string;
}
const SafeContent = ({ content, className }: iAppProps) => {
  const html = convertJsontoHtml(content);
  const clean = domPurify.sanitize(html);
  return <div className={cn(className)}>{parse(clean)}</div>;
};

export default SafeContent;
