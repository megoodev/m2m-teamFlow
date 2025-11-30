import { baseExtensions } from "@/components/rich-text-editor/extantions";
import { generateHTML, type JSONContent } from "@tiptap/react";
export function convertJsontoHtml(jsonContent: JSONContent): string {
  try {
    const content =
      typeof jsonContent === "string" ? JSON.parse(jsonContent) : jsonContent;
    return generateHTML(content, baseExtensions);
  } catch {
    console.error("Error convert json to html");
    return ''
  }
}
