'use client';

import { Editor } from '@tiptap/react';
import { useCallback, useRef, useState } from 'react';

type ToolbarProps = {
  editor: Editor;
  onOpenLinkModal: () => void;
  onImageUpload: (file: File) => void;
};

export default function Toolbar({ editor, onOpenLinkModal, onImageUpload }: ToolbarProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  // Common colors for the color picker
  const colors = [
    '#000000', // Black
    '#FF0000', // Red
    '#00FF00', // Green
    '#0000FF', // Blue
    '#FFFF00', // Yellow
    '#FF00FF', // Magenta
    '#00FFFF', // Cyan
    '#FFA500', // Orange
    '#800080', // Purple
    '#008000', // Dark Green
    '#800000', // Maroon
    '#008080', // Teal
  ];

  const handleImageInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
    
    // Reset the input value so the same file can be selected again
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  }, [onImageUpload]);

  const setHeading = useCallback((level: 1 | 2 | 3 | 4 | 5 | 6) => {
    editor.chain().focus().toggleHeading({ level }).run();
  }, [editor]);

  const toggleBold = useCallback(() => {
    editor.chain().focus().toggleBold().run();
  }, [editor]);

  const toggleItalic = useCallback(() => {
    editor.chain().focus().toggleItalic().run();
  }, [editor]);

  const toggleUnderline = useCallback(() => {
    editor.chain().focus().toggleUnderline().run();
  }, [editor]);

  const toggleStrike = useCallback(() => {
    editor.chain().focus().toggleStrike().run();
  }, [editor]);

  const toggleCode = useCallback(() => {
    editor.chain().focus().toggleCode().run();
  }, [editor]);

  const toggleBlockquote = useCallback(() => {
    editor.chain().focus().toggleBlockquote().run();
  }, [editor]);

  const toggleBulletList = useCallback(() => {
    editor.chain().focus().toggleBulletList().run();
  }, [editor]);

  const toggleOrderedList = useCallback(() => {
    editor.chain().focus().toggleOrderedList().run();
  }, [editor]);

  const insertCodeBlock = useCallback(() => {
    editor.chain().focus().setCodeBlock().run();
  }, [editor]);

  const handleSlashCommand = useCallback((e: React.KeyboardEvent) => {
    if (e.key === '/') {
      // Implement slash command menu
      console.log('Slash command triggered');
    }
  }, []);

  const setTextColor = useCallback((color: string) => {
    editor.chain().focus().setColor(color).run();
    setShowColorPicker(false);
  }, [editor]);

  return (
    <div className="editor-toolbar">
      <div className="toolbar-group">
        <button
          type="button"
          onClick={() => setHeading(1)}
          className={`toolbar-button ${editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}`}
          title="Heading 1"
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => setHeading(2)}
          className={`toolbar-button ${editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}`}
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => setHeading(3)}
          className={`toolbar-button ${editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}`}
          title="Heading 3"
        >
          H3
        </button>
      </div>

      <div className="toolbar-group">
        <button
          type="button"
          onClick={toggleBold}
          className={`toolbar-button ${editor.isActive('bold') ? 'is-active' : ''}`}
          title="Bold"
        >
          <span className="font-bold">B</span>
        </button>
        <button
          type="button"
          onClick={toggleItalic}
          className={`toolbar-button ${editor.isActive('italic') ? 'is-active' : ''}`}
          title="Italic"
        >
          <span className="italic">I</span>
        </button>
        <button
          type="button"
          onClick={toggleUnderline}
          className={`toolbar-button ${editor.isActive('underline') ? 'is-active' : ''}`}
          title="Underline"
        >
          <span className="underline">U</span>
        </button>
        <button
          type="button"
          onClick={toggleStrike}
          className={`toolbar-button ${editor.isActive('strike') ? 'is-active' : ''}`}
          title="Strikethrough"
        >
          <span className="line-through">S</span>
        </button>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="toolbar-button"
            title="Text Color"
            style={{ display: 'flex', alignItems: 'center', padding: '6px' }}
          >
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ 
                width: '16px', 
                height: '16px', 
                border: '1px solid #ccc', 
                borderRadius: '4px',
                backgroundColor: editor.getAttributes('textStyle').color || '#000000' 
              }}></span>
              <span style={{ marginLeft: '4px' }}>▼</span>
            </span>
          </button>
          {showColorPicker && (
            <div style={{ 
              position: 'absolute', 
              top: '100%', 
              left: '0', 
              marginTop: '4px', 
              padding: '8px', 
              backgroundColor: 'white', 
              border: '1px solid #ccc', 
              borderRadius: '4px', 
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)', 
              zIndex: 10,
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '4px'
            }}>
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setTextColor(color)}
                  style={{ 
                    width: '24px', 
                    height: '24px', 
                    border: '1px solid #ccc', 
                    borderRadius: '4px', 
                    backgroundColor: color,
                    cursor: 'pointer' 
                  }}
                  title={color}
                />
              ))}
              <input
                type="color"
                onChange={(e) => setTextColor(e.target.value)}
                style={{ width: '24px', height: '24px', cursor: 'pointer' }}
                title="Custom Color"
              />
            </div>
          )}
        </div>
      </div>

      <div className="toolbar-group">
        <button
          type="button"
          onClick={toggleCode}
          className={`toolbar-button ${editor.isActive('code') ? 'is-active' : ''}`}
          title="Inline Code"
        >
          <span className="font-mono">{'<>'}</span>
        </button>
        <button
          type="button"
          onClick={insertCodeBlock}
          className={`toolbar-button ${editor.isActive('codeBlock') ? 'is-active' : ''}`}
          title="Code Block"
        >
          <span className="font-mono">{'{ }'}</span>
        </button>
      </div>

      <div className="toolbar-group">
        <button
          type="button"
          onClick={toggleBlockquote}
          className={`toolbar-button ${editor.isActive('blockquote') ? 'is-active' : ''}`}
          title="Blockquote"
        >
          <span>"</span>
        </button>
        <button
          type="button"
          onClick={toggleBulletList}
          className={`toolbar-button ${editor.isActive('bulletList') ? 'is-active' : ''}`}
          title="Bullet List"
        >
          <span>•</span>
        </button>
        <button
          type="button"
          onClick={toggleOrderedList}
          className={`toolbar-button ${editor.isActive('orderedList') ? 'is-active' : ''}`}
          title="Ordered List"
        >
          <span>1.</span>
        </button>
      </div>

      <div className="toolbar-group">
        <button
          type="button"
          onClick={onOpenLinkModal}
          className={`toolbar-button ${editor.isActive('link') ? 'is-active' : ''}`}
          title="Link"
        >
          <span>🔗</span>
        </button>
        <button
          type="button"
          onClick={() => imageInputRef.current?.click()}
          className="toolbar-button"
          title="Image"
        >
          <span>📷</span>
        </button>
        <input
          type="file"
          ref={imageInputRef}
          onChange={handleImageInputChange}
          accept="image/*"
          className="hidden"
        />
      </div>
    </div>
  );
} 