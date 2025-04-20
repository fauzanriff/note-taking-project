import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { ChatBubbleComponent } from './ChatBubbleComponent';

export interface ChatBubbleOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    chatBubble: {
      /**
       * Add a chat bubble
       */
      setChatBubble: (options: { type: 'sent' | 'received', sender?: string }) => ReturnType;
    };
  }
}

export const ChatBubble = Node.create<ChatBubbleOptions>({
  name: 'chatBubble',

  group: 'block',

  content: 'inline*',

  defining: true,

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'chat-bubble',
      },
    };
  },

  addAttributes() {
    return {
      type: {
        default: 'sent',
        parseHTML: element => element.getAttribute('data-type') || 'sent',
        renderHTML: attributes => {
          return {
            'data-type': attributes.type,
          };
        },
      },
      sender: {
        default: '',
        parseHTML: element => element.getAttribute('data-sender') || '',
        renderHTML: attributes => {
          return {
            'data-sender': attributes.sender,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-node-type="chatBubble"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(
        this.options.HTMLAttributes,
        HTMLAttributes,
        { 'data-node-type': 'chatBubble' }
      ),
      0
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ChatBubbleComponent);
  },

  addCommands() {
    return {
      setChatBubble:
        options =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              type: options.type,
              sender: options.sender || '',
            },
            content: [
              {
                type: 'text',
                text: 'Chat message content',
              },
            ],
          });
        },
    };
  },
});

export default ChatBubble;
