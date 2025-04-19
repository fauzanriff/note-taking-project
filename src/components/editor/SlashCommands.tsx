import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Editor } from '@tiptap/react';
import tippy, { Instance as TippyInstance } from 'tippy.js';
import 'tippy.js/dist/tippy.css';

interface CommandProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  action: (editor: Editor) => void;
}

interface SlashCommandsProps {
  editor: Editor;
}

// Define all available commands
const commands: CommandProps[] = [
  {
    title: 'Heading 1',
    description: 'Large section heading',
    icon: <span className="text-lg font-bold">H1</span>,
    action: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
  },
  {
    title: 'Heading 2',
    description: 'Medium section heading',
    icon: <span className="text-lg font-bold">H2</span>,
    action: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    title: 'Heading 3',
    description: 'Small section heading',
    icon: <span className="text-lg font-bold">H3</span>,
    action: (editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
  },
  {
    title: 'Bullet List',
    description: 'Create a simple bullet list',
    icon: <span className="text-lg">•</span>,
    action: (editor) => editor.chain().focus().toggleBulletList().run(),
  },
  {
    title: 'Numbered List',
    description: 'Create a numbered list',
    icon: <span className="text-lg">1.</span>,
    action: (editor) => editor.chain().focus().toggleOrderedList().run(),
  },
  {
    title: 'Blockquote',
    description: 'Create a blockquote',
    icon: <span className="text-lg">"</span>,
    action: (editor) => editor.chain().focus().toggleBlockquote().run(),
  },
  {
    title: 'Code Block',
    description: 'Create a code block',
    icon: <span className="text-lg">{'</>'}</span>,
    action: (editor) => editor.chain().focus().toggleCodeBlock().run(),
  },
  {
    title: 'Horizontal Rule',
    description: 'Insert a horizontal divider',
    icon: <span className="text-lg">—</span>,
    action: (editor) => editor.chain().focus().setHorizontalRule().run(),
  },
];

// Command menu component
const CommandMenu: React.FC<{
  items: CommandProps[];
  command: (item: CommandProps) => void;
}> = ({ items, command }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const commandListRef = useRef<HTMLDivElement>(null);

  const selectItem = useCallback(
    (index: number) => {
      const item = items[index];
      if (item) {
        command(item);
      }
    },
    [command, items]
  );

  useEffect(() => {
    const navigationKeys = ['ArrowUp', 'ArrowDown', 'Enter'];
    
    const onKeyDown = (e: KeyboardEvent) => {
      if (navigationKeys.includes(e.key)) {
        e.preventDefault();
        
        if (e.key === 'ArrowUp') {
          setSelectedIndex((selectedIndex + items.length - 1) % items.length);
        } else if (e.key === 'ArrowDown') {
          setSelectedIndex((selectedIndex + 1) % items.length);
        } else if (e.key === 'Enter') {
          selectItem(selectedIndex);
        }
      }
    };
    
    document.addEventListener('keydown', onKeyDown);
    
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [items, selectedIndex, selectItem]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [items]);

  useEffect(() => {
    const selectedElement = commandListRef.current?.querySelector(`[data-index="${selectedIndex}"]`);
    if (selectedElement) {
      selectedElement.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  return (
    <div 
      className="slash-command-list bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden overflow-y-auto max-h-[300px] w-[300px] border border-gray-200 dark:border-gray-700"
      ref={commandListRef}
    >
      <div className="p-1">
        {items.length > 0 ? (
          items.map((item, index) => (
            <button
              className={`flex items-center gap-2 w-full text-left p-2 rounded-md ${
                index === selectedIndex ? 'bg-gray-100 dark:bg-gray-700' : ''
              } hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
              key={index}
              data-index={index}
              onClick={() => selectItem(index)}
            >
              <div className="flex-shrink-0 text-gray-500 dark:text-gray-400 w-8 h-8 flex items-center justify-center">
                {item.icon}
              </div>
              <div>
                <div className="font-medium">{item.title}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{item.description}</div>
              </div>
            </button>
          ))
        ) : (
          <div className="p-3 text-sm text-gray-500 dark:text-gray-400">No results</div>
        )}
      </div>
    </div>
  );
};

export const SlashCommands: React.FC<SlashCommandsProps> = ({ editor }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const tippyInstance = useRef<TippyInstance | null>(null);

  // Function to check if we should show the slash menu
  const checkForSlashCommand = useCallback(() => {
    if (!editor) return;

    const { state } = editor;
    const { selection } = state;
    const { $from, empty } = selection;

    // Only show menu if selection is empty (cursor only)
    if (!empty) {
      setShowMenu(false);
      return;
    }

    // Get text before cursor on the current line
    const textBeforeCursor = $from.nodeBefore?.textContent || '';

    // Show menu if text is exactly '/'
    if (textBeforeCursor === '/') {
      // Get cursor position
      const coords = editor.view.coordsAtPos($from.pos);
      setMenuPosition({ x: coords.left, y: coords.bottom });
      setShowMenu(true);
    } else {
      setShowMenu(false);
    }
  }, [editor]);

  // Handle command selection
  const handleCommand = useCallback(
    (item: CommandProps) => {
      if (!editor) return;

      // Delete the '/' character
      const { state } = editor;
      const { selection } = state;
      const { $from } = selection;
      
      editor
        .chain()
        .focus()
        .deleteRange({ from: $from.pos - 1, to: $from.pos })
        .run();

      // Execute the command
      item.action(editor);
      
      // Hide the menu
      setShowMenu(false);
    },
    [editor]
  );

  // Set up event listeners
  useEffect(() => {
    if (!editor) return;

    // Update on every transaction (document change, selection change, etc.)
    const updateListener = () => {
      checkForSlashCommand();
    };

    editor.on('transaction', updateListener);

    return () => {
      editor.off('transaction', updateListener);
    };
  }, [editor, checkForSlashCommand]);

  // Set up tippy for the menu
  useEffect(() => {
    if (!editor || !showMenu) {
      if (tippyInstance.current) {
        tippyInstance.current.destroy();
        tippyInstance.current = null;
      }
      return;
    }

    const editorElement = editor.view.dom;

    if (!tippyInstance.current) {
      const menuElement = document.createElement('div');
      
      tippyInstance.current = tippy(editorElement, {
        getReferenceClientRect: () => ({
          width: 0,
          height: 0,
          top: menuPosition.y,
          bottom: menuPosition.y,
          left: menuPosition.x,
          right: menuPosition.x,
          x: menuPosition.x,
          y: menuPosition.y,
          toJSON: () => ({}),
        }),
        appendTo: () => document.body,
        content: menuElement,
        showOnCreate: true,
        interactive: true,
        trigger: 'manual',
        placement: 'bottom-start',
      });

      // Render the command menu into the tippy content
      const root = document.createElement('div');
      menuElement.appendChild(root);
      
      // Use ReactDOM to render the component
      const ReactDOM = require('react-dom/client');
      const reactRoot = ReactDOM.createRoot(root);
      reactRoot.render(<CommandMenu items={commands} command={handleCommand} />);
    } else {
      tippyInstance.current.setProps({
        getReferenceClientRect: () => ({
          width: 0,
          height: 0,
          top: menuPosition.y,
          bottom: menuPosition.y,
          left: menuPosition.x,
          right: menuPosition.x,
          x: menuPosition.x,
          y: menuPosition.y,
          toJSON: () => ({}),
        }),
      });
      tippyInstance.current.show();
    }

    return () => {
      if (tippyInstance.current) {
        tippyInstance.current.destroy();
        tippyInstance.current = null;
      }
    };
  }, [editor, showMenu, menuPosition, handleCommand]);

  return null; // This component doesn't render anything directly
};

export default SlashCommands;
