import React, { useState, useEffect, useRef } from 'react';
import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  MessageSquare,
} from 'lucide-react';

interface TiptapToolbarProps {
  editor: Editor | null;
}

export const TiptapToolbar: React.FC<TiptapToolbarProps> = ({ editor }) => {
  const [isChatMenuOpen, setIsChatMenuOpen] = useState(false);
  const chatMenuRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatMenuRef.current && !chatMenuRef.current.contains(event.target as Node)) {
        setIsChatMenuOpen(false);
      }
    };

    if (isChatMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isChatMenuOpen]);

  if (!editor) {
    return null;
  }

  const addChatBubble = (type: 'sent' | 'received') => {
    editor.chain().focus().setChatBubble({ type, sender: type === 'sent' ? 'You' : 'Friend' }).run();
    setIsChatMenuOpen(false); // Close the menu after selection
  };

  const toggleChatMenu = () => {
    setIsChatMenuOpen(!isChatMenuOpen);
  };

  return (
    <div className="tiptap-toolbar flex flex-wrap gap-1 p-1 mb-2 border rounded-md bg-background">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-muted ${editor.isActive('bold') ? 'bg-muted' : ''}`}
        title="Bold"
      >
        <Bold className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-muted ${editor.isActive('italic') ? 'bg-muted' : ''}`}
        title="Italic"
      >
        <Italic className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded hover:bg-muted ${
          editor.isActive('heading', { level: 1 }) ? 'bg-muted' : ''
        }`}
        title="Heading 1"
      >
        <Heading1 className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded hover:bg-muted ${
          editor.isActive('heading', { level: 2 }) ? 'bg-muted' : ''
        }`}
        title="Heading 2"
      >
        <Heading2 className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-2 rounded hover:bg-muted ${
          editor.isActive('heading', { level: 3 }) ? 'bg-muted' : ''
        }`}
        title="Heading 3"
      >
        <Heading3 className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-muted ${editor.isActive('bulletList') ? 'bg-muted' : ''}`}
        title="Bullet List"
      >
        <List className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-muted ${editor.isActive('orderedList') ? 'bg-muted' : ''}`}
        title="Ordered List"
      >
        <ListOrdered className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded hover:bg-muted ${editor.isActive('blockquote') ? 'bg-muted' : ''}`}
        title="Quote"
      >
        <Quote className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`p-2 rounded hover:bg-muted ${editor.isActive('codeBlock') ? 'bg-muted' : ''}`}
        title="Code Block"
      >
        <Code className="h-4 w-4" />
      </button>

      <div className="border-l mx-1"></div>

      {/* Chat Bubble Buttons */}
      <div className="relative" ref={chatMenuRef}>
        <button
          type="button"
          onClick={toggleChatMenu}
          className={`p-2 rounded hover:bg-muted ${
            editor.isActive('chatBubble') ? 'bg-muted' : ''
          } ${isChatMenuOpen ? 'bg-muted' : ''}`}
          title="Chat Bubble"
        >
          <MessageSquare className="h-4 w-4" />
        </button>
        {isChatMenuOpen && (
          <div className="absolute left-0 top-full mt-1 bg-background border rounded shadow-lg z-10 w-40">
            <button
              type="button"
              onClick={() => addChatBubble('sent')}
              className="block w-full text-left px-3 py-2 hover:bg-muted"
            >
              Sent Message
            </button>
            <button
              type="button"
              onClick={() => addChatBubble('received')}
              className="block w-full text-left px-3 py-2 hover:bg-muted"
            >
              Received Message
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
