"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu, FloatingMenu } from "@tiptap/react/menus";

import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import FontFamily from "@tiptap/extension-font-family";
import { TextStyle } from "@tiptap/extension-text-style";
import { Selection } from "@tiptap/extensions/selection";
import Highlight from "@tiptap/extension-highlight";

import Loading from "@/pages/components/loading";

import { useEffect, useState } from "react";
export default function OutputPanel({
  value,
  onChange,
  setOutputIsEmpty,
  onReOpimized,
  onSelectionChange,
  selection,
  setEditorActions,
  onSelectiveReOpimized,
  onCopy,
  copied,
  loading,
}) {
  const [headingOpen, setHeadingOpen] = useState(false);

  const editor = useEditor({
    immediatelyRender: true,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      FontFamily,
      TextStyle,
      // BulletList,
      // OrderedList,
      // ListItem,
      Selection,

      // AiSelectionHighlight,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
      setOutputIsEmpty(editor.isEmpty);
    },
  });

  // Sync external value changes
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, false);
    }
  }, [value, editor]);

  const [, forceUpdate] = useState(0);

  useEffect(() => {
    if (!editor) return;

    const update = () => {
      forceUpdate((v) => v + 1);
    };

    editor.on("selectionUpdate", update);
    editor.on("transaction", update);

    return () => {
      editor.off("selectionUpdate", update);
      editor.off("transaction", update);
    };
  }, [editor]);

  useEffect(() => {
    if (!editor) return;

    const updateSelection = () => {
      const { from, to } = editor.state.selection;

      if (from === to) return;

      const text = editor.state.doc.textBetween(from, to);

      console.log(text);

      onSelectionChange?.({
        from,
        to,
        text,
      });
    };

    editor.on("selectionUpdate", updateSelection);

    return () => {
      editor.off("selectionUpdate", updateSelection);
    };
  }, [editor]);

  useEffect(() => {
    if (!editor) return;

    setEditorActions({
      replaceSelection: (from, to, text) => {
        editor.chain().focus().insertContentAt({ from, to }, text).run();

        setTimeout(() => {
          editor
            .chain()
            .focus()
            .setTextSelection({
              from,
              to: from + text.length,
            })
            .run();
        }, 0);
      },
    });
  }, [editor]);

  // useEffect(() => {
  //   if (!editor) return;

  //   editor.storage.aiSelectionHighlight.from = selection?.from ?? null;

  //   editor.storage.aiSelectionHighlight.to = selection?.to ?? null;

  //   editor.view.dispatch(editor.state.tr);
  // }, [selection, editor]);

  if (!editor) return null;

  const headings = [
    {
      icon: "format_paragraph",
      title: "Paragraph",
      onClick: () => {
        editor.chain().focus().setParagraph().run();
        setHeadingOpen(false);
      },
    },
    {
      icon: "format_h1",
      title: "Heading 1",
      onClick: () => {
        editor.chain().focus().toggleHeading({ level: 1 }).run();
        setHeadingOpen(false);
      },
    },
    {
      icon: "format_h2",
      title: "Heading 2",
      onClick: () => {
        editor.chain().focus().toggleHeading({ level: 2 }).run();
        setHeadingOpen(false);
      },
    },
    {
      icon: "format_h3",
      title: "Heading 3",
      onClick: () => {
        editor.chain().focus().toggleHeading({ level: 3 }).run();
        setHeadingOpen(false);
      },
    },
  ];

  const toolbarItems = [
    { type: "heading-dropdown" },
    { type: "divider" },
    {
      type: "button",
      icon: "format_bold",
      title: "Bold",
      active: editor.isActive("bold"),
      onClick: () => editor.chain().focus().toggleBold().run(),
    },
    {
      type: "button",
      icon: "format_italic",
      title: "Italic",
      active: editor.isActive("italic"),
      onClick: () => editor.chain().focus().toggleItalic().run(),
    },
    { type: "divider" },
    {
      type: "button",
      icon: "format_list_bulleted",
      title: "Bullet List",
      active: editor.isActive("bulletList"),
      onClick: () => {
        editor.chain().focus().toggleBulletList().run();
        console.log(editor.getJSON());
      },
    },
    {
      type: "button",
      icon: "format_list_numbered",
      title: "Numbered List",
      active: editor.isActive("orderedList"),
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
    },
    { type: "divider" },
    // {
    //   type: "button",
    //   icon: copied ? "check" : "content_copy",
    //   title: "Copy",
    //   active: false,
    //   onClick: () => onCopy(selection.text),
    // },
    {
      type: "button",
      icon: "cached",
      title: "Re-optimize",
      active: false,
      onClick: onSelectiveReOpimized,
    },
    // {
    //   type: "button",
    //   icon: "undo",
    //   title: "Undo",
    //   active: false,
    //   onClick: () => editor.chain().focus().undo().run(),
    // },
    // {
    //   type: "button",
    //   icon: "redo",
    //   title: "Redo",
    //   active: false,
    //   onClick: () => editor.chain().focus().redo().run(),
    // },
  ];

  const getHeading = () => {
    if (editor.isActive("heading", { level: 1 })) return "Heading 1";
    if (editor.isActive("heading", { level: 2 })) return "Heading 2";
    if (editor.isActive("heading", { level: 3 })) return "Heading 3";
    return "Paragraph";
  };

  const getIcon = () => {
    if (editor.isActive("heading", { level: 1 })) return "format_h1";
    if (editor.isActive("heading", { level: 2 })) return "format_h2";
    if (editor.isActive("heading", { level: 3 })) return "format_h3";
    return "format_paragraph";
  };

  return (
    <div className="bg-tinted-white-blue rounded-xl shadow-md p-5 h-full flex flex-1 flex-col justify-between min-h-0">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="material-symbols-outlined text-primary-blue">
          output
        </div>
        <h1 className="text-xl font-bold text-dark-brown">output content</h1>
      </div>

      {/* Editor Container */}
      <div className="w-full h-1 grow rounded-lg bg-natural-white p-4 border-1 border-gray-200 flex flex-col overflow-hidden mb-4 min-h-0">
        {/* Floating Toolbar (appears when text selected) */}
        {loading && <Loading />}
        <FloatingMenu
          editor={editor}
          tippyOptions={{
            duration: 100,
            maxWidth: 400,
          }}
          className="floating-menu bg-natural-white shadow-lg rounded-full border-1 border-primary-blue p-2 flex gap-1 flex-wrap"
        >
          {toolbarItems.map((item, index) => {
            switch (item.type) {
              case "button":
                return <ToolbarButton key={index} {...item} />;

              case "divider":
                return <ToolbarDivider key={index} />;

              case "heading-dropdown":
                return (
                  <div key={index}>
                    <HeadingDropDownMenu
                      setHeadingOpen={setHeadingOpen}
                      headingIcon={getIcon()}
                      headingLabel={getHeading()}
                      headingOpen={headingOpen}
                      headings={headings}
                    />
                  </div>
                );
              default:
                return null;
            }
          })}
        </FloatingMenu>

        {/* Bubble Menu (appears near selected text) */}
        <BubbleMenu
          editor={editor}
          tippyOptions={{
            duration: 100,
            maxWidth: 300,
          }}
          className="bubble-menu bg-natural-white shadow-lg rounded-full border-1 border-primary-blue p-2 flex gap-1"
        >
          {toolbarItems.map((item, index) => {
            switch (item.type) {
              case "button":
                return <ToolbarButton key={index} {...item} />;

              case "divider":
                return <ToolbarDivider key={index} />;

              case "heading-dropdown":
                return (
                  <div key={index}>
                    <HeadingDropDownMenu
                      setHeadingOpen={setHeadingOpen}
                      headingIcon={getIcon()}
                      headingLabel={getHeading()}
                      headingOpen={headingOpen}
                      headings={headings}
                    />
                  </div>
                );
              default:
                return null;
            }
          })}
        </BubbleMenu>

        {/* Editor Content */}
        <div className="prose prose-sm overflow-auto flex-1 min-h-0">
          <EditorContent
            placeholder="Optimized result from AI will show here"
            editor={editor}
            className="editor-content text-base text-dark-brown outline-none"
          />
        </div>
      </div>

      {/* Bottom Toolbar */}
      <div className="flex items-center gap-2 bg-natural-white rounded-full border-1 border-primary-blue px-3 py-2 w-fit">
        {/* {toolbarItems.map((item, index) => {
          switch (item.type) {
            case "button":
              return <ToolbarButton key={index} {...item} />;

            case "divider":
              return <ToolbarDivider key={index} />;

            case "heading-dropdown":
              return (
                <div key={index}>
                  <HeadingDropDownMenu
                    setHeadingOpen={setHeadingOpen}
                    headingIcon={getIcon()}
                    headingLabel={getHeading()}
                    headingOpen={headingOpen}
                    headings={headings}
                  />
                </div>
              );
            default:
              return null;
          }
        })}
        <ToolbarDivider /> */}
        <button
          onClick={() => onCopy(editor.getHTML())}
          className="material-symbols-outlined text-primary-blue hover:opacity-70"
        >
          {copied ? "check" : "content_copy"}
        </button>
        <button
          onClick={onReOpimized}
          className="material-symbols-outlined text-primary-blue hover:opacity-70"
        >
          cached
        </button>
      </div>
    </div>
  );
}

function HeadingDropDownMenu({
  setHeadingOpen,
  headingIcon,
  headingLabel,
  headingOpen,
  headings,
}) {
  return (
    <div className="relative">
      <button
        onClick={() => setHeadingOpen((prev) => !prev)}
        className="flex flex-row items-center justify-between text-primary-blue shrink-0 grow-0"
      >
        <span className="material-symbols-outlined p-1">{headingIcon} </span>
        <p className="text-nowrap min-w-20">{headingLabel}</p>
        <span className="material-symbols-outlined p-1">
          {headingOpen ? "arrow_drop_up" : "arrow_drop_down"}
        </span>
      </button>

      {headingOpen && (
        <div className="absolute bottom-full mb-2 bg-white shadow-lg rounded-lg border p-2 flex flex-col gap-1">
          {headings.map((h) => (
            <button
              key={h.title}
              onClick={h.onClick}
              className={`flex flex-row items-center hover:text-primary-blue ${headingIcon == h.icon ? "text-primary-blue" : "text-accent-grey"}`}
            >
              <span className="material-symbols-outlined p-1">{h.icon} </span>
              {h.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Reusable toolbar button component
function ToolbarButton({ icon, title, active, onClick }) {
  return (
    <button
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      title={title}
      className={`material-symbols-outlined p-0 rounded transition-colors ${
        active
          ? "bg-primary-blue text-natural-white"
          : "text-primary-blue hover:bg-gray-100"
      }`}
    >
      {icon}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="w-px h-6 bg-gray-300 mx-1" />;
}
