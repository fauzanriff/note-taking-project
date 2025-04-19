import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import tippy, { Instance as TippyInstance } from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { CustomReactRenderer } from './CustomReactRenderer';

interface CommandItem {
  title: string;
  description: string;
  icon: ReactNode;
  command: (props: { editor: any }) => void;
}

interface CommandListProps {
  items: CommandItem[];
  command: (item: CommandItem) => void;
}

const CommandList = ({ items, command }: CommandListProps) => {
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

export const SlashCommand = Extension.create({
  name: 'slashCommand',

  addProseMirrorPlugins() {
    let component: CustomReactRenderer | null = null;
    let popup: TippyInstance | null = null;

    return [
      new Plugin({
        key: new PluginKey('slashCommand'),

        view() {
          return {
            update: (view, prevState) => {
              const { state } = view;
              const { selection } = state;
              const { $from, empty } = selection;

              // Close the popup if selection changes or is not empty
              if (!empty) {
                popup?.hide();
                return;
              }

              // Get the current line of text before the cursor
              const currentLineText = $from.nodeBefore?.textContent || '';

              // Check if the line starts with '/'
              if (currentLineText === '/') {
                // Define the commands
                const items: CommandItem[] = [
                  {
                    title: 'Heading 1',
                    description: 'Large section heading',
                    icon: <span className="text-lg font-bold">H1</span>,
                    command: ({ editor }) => {
                      editor
                        .chain()
                        .focus()
                        .deleteRange({
                          from: $from.pos - 1,
                          to: $from.pos,
                        })
                        .setNode('heading', { level: 1 })
                        .run();
                    },
                  },
                  {
                    title: 'Heading 2',
                    description: 'Medium section heading',
                    icon: <span className="text-lg font-bold">H2</span>,
                    command: ({ editor }) => {
                      editor
                        .chain()
                        .focus()
                        .deleteRange({
                          from: $from.pos - 1,
                          to: $from.pos,
                        })
                        .setNode('heading', { level: 2 })
                        .run();
                    },
                  },
                  {
                    title: 'Heading 3',
                    description: 'Small section heading',
                    icon: <span className="text-lg font-bold">H3</span>,
                    command: ({ editor }) => {
                      editor
                        .chain()
                        .focus()
                        .deleteRange({
                          from: $from.pos - 1,
                          to: $from.pos,
                        })
                        .setNode('heading', { level: 3 })
                        .run();
                    },
                  },
                  {
                    title: 'Bullet List',
                    description: 'Create a simple bullet list',
                    icon: <span className="text-lg">•</span>,
                    command: ({ editor }) => {
                      editor
                        .chain()
                        .focus()
                        .deleteRange({
                          from: $from.pos - 1,
                          to: $from.pos,
                        })
                        .toggleBulletList()
                        .run();
                    },
                  },
                  {
                    title: 'Numbered List',
                    description: 'Create a numbered list',
                    icon: <span className="text-lg">1.</span>,
                    command: ({ editor }) => {
                      editor
                        .chain()
                        .focus()
                        .deleteRange({
                          from: $from.pos - 1,
                          to: $from.pos,
                        })
                        .toggleOrderedList()
                        .run();
                    },
                  },
                  {
                    title: 'Blockquote',
                    description: 'Create a blockquote',
                    icon: <span className="text-lg">"</span>,
                    command: ({ editor }) => {
                      editor
                        .chain()
                        .focus()
                        .deleteRange({
                          from: $from.pos - 1,
                          to: $from.pos,
                        })
                        .toggleBlockquote()
                        .run();
                    },
                  },
                  {
                    title: 'Code Block',
                    description: 'Create a code block',
                    icon: <span className="text-lg">{'</>'}</span>,
                    command: ({ editor }) => {
                      editor
                        .chain()
                        .focus()
                        .deleteRange({
                          from: $from.pos - 1,
                          to: $from.pos,
                        })
                        .toggleCodeBlock()
                        .run();
                    },
                  },
                  {
                    title: 'Horizontal Rule',
                    description: 'Insert a horizontal divider',
                    icon: <span className="text-lg">—</span>,
                    command: ({ editor }) => {
                      editor
                        .chain()
                        .focus()
                        .deleteRange({
                          from: $from.pos - 1,
                          to: $from.pos,
                        })
                        .setHorizontalRule()
                        .run();
                    },
                  },
                ];

                const editor = this.editor;

                if (!component) {
                  component = new CustomReactRenderer(CommandList, {
                    items,
                    command: (item: CommandItem) => {
                      item.command({ editor });
                      popup?.hide();
                    },
                  });
                } else {
                  component.updateProps({
                    items,
                    command: (item: CommandItem) => {
                      item.command({ editor });
                      popup?.hide();
                    },
                  });
                }

                const { view } = this.editor;
                const { state } = view;
                const { selection } = state;
                const { $from } = selection;

                const coords = view.coordsAtPos($from.pos);
                const dom = view.dom;

                if (!popup) {
                  popup = tippy(dom, {
                    getReferenceClientRect: () => ({
                      width: 0,
                      height: 0,
                      top: coords.top,
                      bottom: coords.bottom,
                      left: coords.left,
                      right: coords.right,
                      x: coords.left,
                      y: coords.top,
                      toJSON: () => ({}),
                    }),
                    appendTo: () => document.body,
                    content: component.element,
                    showOnCreate: true,
                    interactive: true,
                    trigger: 'manual',
                    placement: 'bottom-start',
                  });
                } else {
                  popup.setProps({
                    getReferenceClientRect: () => ({
                      width: 0,
                      height: 0,
                      top: coords.top,
                      bottom: coords.bottom,
                      left: coords.left,
                      right: coords.right,
                      x: coords.left,
                      y: coords.top,
                      toJSON: () => ({}),
                    }),
                  });

                  popup.show();
                }
              } else {
                popup?.hide();
              }
            },

            destroy: () => {
              popup?.destroy();
              component?.destroy();
            },
          };
        },
      }),
    ];
  },
});
