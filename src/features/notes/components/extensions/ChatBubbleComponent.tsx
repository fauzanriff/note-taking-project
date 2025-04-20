import React from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';

interface ChatBubbleComponentProps {
  node: {
    attrs: {
      type: 'sent' | 'received';
      sender: string;
    };
  };
  updateAttributes: (attrs: Record<string, any>) => void;
  selected: boolean;
}

export const ChatBubbleComponent: React.FC<ChatBubbleComponentProps> = ({
  node: {
    attrs: { type, sender },
  },
  updateAttributes,
  selected,
}) => {
  const toggleType = () => {
    updateAttributes({
      type: type === 'sent' ? 'received' : 'sent',
    });
  };

  const updateSender = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateAttributes({
      sender: e.target.value,
    });
  };

  return (
    <NodeViewWrapper
      className={`chat-bubble-wrapper my-4 ${
        type === 'sent' ? 'flex justify-end' : 'flex justify-start'
      }`}
    >
      <div
        className={`chat-bubble relative max-w-[80%] ${
          selected ? 'ring-2 ring-primary ring-offset-2' : ''
        } ${
          type === 'sent'
            ? 'bg-primary text-primary-foreground rounded-tl-lg rounded-tr-lg rounded-bl-lg'
            : 'bg-muted text-muted-foreground rounded-tl-lg rounded-tr-lg rounded-br-lg'
        }`}
      >
        {sender && (
          <div
            className={`chat-bubble-sender text-xs font-medium px-4 pt-2 ${
              type === 'sent' ? 'text-primary-foreground/80' : 'text-muted-foreground/80'
            }`}
          >
            {sender}
          </div>
        )}
        <div className="chat-bubble-content p-4 pt-2">
          <NodeViewContent className="chat-bubble-editor" />
        </div>
        <div className="chat-bubble-controls absolute -top-8 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
          <button
            type="button"
            onClick={toggleType}
            className="p-1 bg-background border rounded text-xs"
            title={`Switch to ${type === 'sent' ? 'received' : 'sent'} message`}
          >
            {type === 'sent' ? '← Received' : 'Sent →'}
          </button>
          <input
            type="text"
            value={sender}
            onChange={updateSender}
            placeholder="Sender name"
            className="p-1 bg-background border rounded text-xs w-24"
          />
        </div>
      </div>
    </NodeViewWrapper>
  );
};
