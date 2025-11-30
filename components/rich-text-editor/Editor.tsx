'use client'
import { editorExtensions } from "./extantions"
import { useEditor, EditorContent } from '@tiptap/react'
import MenuEditor from "./MenuEditor"
import { ReactNode } from "react";

interface EditorProps {
    value: string;
    onChange: (value: string) => void;
    sendButton: ReactNode;
    footerLeft?: ReactNode;
}
const Editor = ({value, onChange,sendButton,footerLeft} : EditorProps ) => {
    const editor  = useEditor({
        extensions: editorExtensions,
        onUpdate:({editor}) => {
            onChange?.(JSON.stringify(editor.getJSON()))
        },
        content: (()=> {
            if (!value) return ''        
            try{
                return JSON.parse(value)
            }
            catch{
                return ''
            }        
        })(),
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: 'max-w-none min-h-[125px] foucs:outline-none p-2 prose dark:prose-invert',
            }
        }
    })
  return (
    <div className="relative w-full border border-border rounded-lg overflow-hidden dark:bg-input/30 ">
        <MenuEditor editor={editor} />
        <EditorContent editor={editor}  className="max-h-[125px] h-50 overflow-y-auto focus:outline-none"/>
        <div className="flex items-center justify-between gap-2 px-3 py-2 border-t border-input bg-card">
            <div className="min-h-8 flex items-center ">{footerLeft}</div>
            <div className="shrink-0">{sendButton}</div>
        </div>
    </div>
  )
}

export default Editor