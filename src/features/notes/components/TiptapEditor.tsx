import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';
import './TiptapEditor.css';
import ChatBubble from './extensions/ChatBubbleNode';
import './extensions/ChatBubble.css';
import { TiptapToolbar } from './TiptapToolbar';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  className?: string;
  placeholder?: string;
}

export default function TiptapEditor({
  content,
  onChange,
  className = '',
  placeholder = 'Start writing...',
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      ChatBubble,
    ],
    content,
    editorProps: {
      attributes: {
        class: `prose prose-sm max-w-none outline-none min-h-[300px] p-2 cursor-text rounded ${className}`,
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Update content from outside
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      // Only update if the editor is not focused to avoid cursor jumping
      if (!editor.isFocused) {
        editor.commands.setContent(content);
      }
    }
  }, [content, editor]);

  return (
    <div className="tiptap-editor">
      <TiptapToolbar editor={editor} />
      <div className="relative">
        <EditorContent editor={editor} />
        {editor?.isEmpty && (
          <div className="absolute top-0 left-0 p-2 text-gray-400 pointer-events-none">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
}
