'use client'
import { Bold, Code, Italic, List, ListOrdered, Redo, Strikethrough, Undo } from "lucide-react"
import { Toggle } from "../ui/toggle"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { Editor, useEditorState } from "@tiptap/react"
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
interface MenuEditorProps {
    editor: Editor | null;
}
const MenuEditor = ({editor}:   MenuEditorProps ) => {
    if (!editor) {
        return null;
    }
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const editorState = useEditorState({ editor,selector: ({editor})=> {
       if (!editor) return null;

        return {
            isBold: editor.isActive('bold'),
            isItalic: editor.isActive('italic'),
            isStrike: editor.isActive('strike'),
            isCodeBlock: editor.isActive('codeBlock'),
            isBulletList: editor.isActive('bulletList'),
            isOrderdList: editor.isActive('orderdList'),
            canUndo: editor.can().undo(),
            canRedo: editor.can().redo(),
        }
    } });
  return (
<div className="border border-input border-t-0 border-x-0 rounded-t-lg p-2 bg-card flex flex-wrap gap-1 items-center">
        <TooltipProvider>
            <div className="flex flex-wrap gap-1">
                <Tooltip >
                    <TooltipTrigger asChild>
                        <Toggle size='sm' pressed={editorState?.isBold} className={cn(editorState?.isBold && 'bg-muted text-muted-foreground' )} onPressedChange={() => editor.chain().focus().toggleBold().run()}>
                            <Bold className="size-4"/>
                        </Toggle>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Bold</p>
                    </TooltipContent>
                </Tooltip>

                <Tooltip >
                    <TooltipTrigger asChild>
                        <Toggle size='sm' pressed={editorState?.isItalic} className={cn(editorState?.isItalic  && 'bg-muted text-muted-foreground' )} onPressedChange={() => editor.chain().focus().toggleItalic().run()}>
                            <Italic className="size-4"/>
                        </Toggle>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Italic</p>
                    </TooltipContent>
                </Tooltip>
                
                <Tooltip >
                    <TooltipTrigger asChild>
                        <Toggle size='sm' pressed={editorState?.isStrike} className={cn(editorState?.isStrike  && 'bg-muted text-muted-foreground' )}  onPressedChange={() => editor.chain().focus().toggleStrike().run()}>
                            <Strikethrough className="size-4"/>
                        </Toggle>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Italic</p>
                    </TooltipContent>
                </Tooltip>
                <Tooltip >
                    <TooltipTrigger asChild>
                        <Toggle size='sm' pressed={editorState?.isCodeBlock} className={cn(editorState?.isCodeBlock && 'bg-muted text-muted-foreground' )}  onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}>
                            <Code className="size-4"/>
                        </Toggle>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Italic</p>
                    </TooltipContent>
                </Tooltip>
            </div>

            <div className="h-6 w-px bg-accent mx-2"></div>

            <div className="flex flex-wrap gap-1">
                <Tooltip >
                    <TooltipTrigger asChild>
                        <Toggle size='sm' pressed={editorState?.isBulletList} className={cn(editorState?.isBulletList  && 'bg-muted text-muted-foreground' )}  onPressedChange={() => editor.chain().focus().toggleBulletList().run()}>
                            <List className="size-4"/>

                        </Toggle>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Bullet List</p>
                    </TooltipContent>
                </Tooltip>
                <Tooltip >
                    <TooltipTrigger asChild>
                        <Toggle size='sm' pressed={editorState?.isOrderdList} className={cn(editorState?.isOrderdList  && 'bg-muted text-muted-foreground' )} onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}>
                            <ListOrdered className="size-4"/>
                        </Toggle>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Order List</p>
                    </TooltipContent>
                </Tooltip>


            </div>

            <div className="h-6 w-px bg-accent mx-2"></div>

            <div className="flex flex-wrap gap-1">
                <Tooltip >
                    <TooltipTrigger asChild>
                        <Button type="button" size='sm' variant='ghost' disabled={!editor.can().undo()}>
                            <Undo className="size-4" onClick={() => editor.chain().focus().undo().run()}/>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Undo</p>
                    </TooltipContent>
                </Tooltip>
                <Tooltip >
                    <TooltipTrigger asChild>
                        <Button type="button" size='sm' variant='ghost' disabled={!editor.can().redo()}>
                            <Redo className="size-4" onClick={() => editor.chain().focus().redo().run()}/>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Redo</p>
                    </TooltipContent>
                </Tooltip>



            </div>
    </TooltipProvider>
</div>
  )
}

export default MenuEditor