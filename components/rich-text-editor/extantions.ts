
import StarterKit from '@tiptap/starter-kit'
import textAlign from '@tiptap/extension-text-align'
import { Placeholder } from '@tiptap/extensions'
import CodeBlock from '@tiptap/extension-code-block-lowlight'
import {all, createLowlight} from 'lowlight'
const lowlight = createLowlight(all)
export const baseExtensions = [
    StarterKit.configure({
        codeBlock: false
    }),
    textAlign.configure({
        types: ['heading', 'paragraph'],
    }),
    CodeBlock.configure({ 
         lowlight
    }),
    
]
export const  editorExtensions = [...baseExtensions, Placeholder.configure({
    placeholder: 'Type message here...',
})]