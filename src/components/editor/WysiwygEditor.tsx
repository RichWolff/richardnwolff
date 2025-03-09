'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import { useState, useEffect, useCallback, useRef } from 'react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import CodeBlock from '@tiptap/extension-code-block';
import Code from '@tiptap/extension-code';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { createLowlight } from 'lowlight';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Toolbar from './Toolbar';
import LinkModal from './LinkModal';
import CodeBlockComponent from './CodeBlockComponent';
import './editor.css';

// Register languages for syntax highlighting
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import sql from 'highlight.js/lib/languages/sql';
import bash from 'highlight.js/lib/languages/bash';
import yaml from 'highlight.js/lib/languages/yaml';
import json from 'highlight.js/lib/languages/json';

const lowlight = createLowlight();
lowlight.register('javascript', javascript);
lowlight.register('typescript', typescript);
lowlight.register('python', python);
lowlight.register('sql', sql);
lowlight.register('bash', bash);
lowlight.register('yaml', yaml);
lowlight.register('json', json);

// Custom CodeBlock extension with syntax highlighting
const CustomCodeBlock = CodeBlock.extend({
  addNodeView() {
    return ({ node, editor, getPos }) => {
      const dom = document.createElement('div');
      dom.className = 'code-block-wrapper';
      
      const content = document.createElement('pre');
      content.className = 'code-block';
      
      const code = document.createElement('code');
      code.innerHTML = node.textContent;
      code.className = `language-${node.attrs.language || 'text'}`;
      
      const languageSelect = document.createElement('select');
      languageSelect.className = 'code-block-language';
      
      const languages = [
        { value: 'text', label: 'Plain Text' },
        { value: 'javascript', label: 'JavaScript' },
        { value: 'typescript', label: 'TypeScript' },
        { value: 'python', label: 'Python' },
        { value: 'sql', label: 'SQL' },
        { value: 'bash', label: 'Bash' },
        { value: 'yaml', label: 'YAML' },
        { value: 'json', label: 'JSON' },
      ];
      
      languages.forEach(lang => {
        const option = document.createElement('option');
        option.value = lang.value;
        option.textContent = lang.label;
        option.selected = node.attrs.language === lang.value;
        languageSelect.appendChild(option);
      });
      
      languageSelect.addEventListener('change', event => {
        if (typeof getPos === 'function') {
          editor.commands.updateAttributes('codeBlock', {
            language: (event.target as HTMLSelectElement).value,
          });
        }
      });
      
      content.appendChild(code);
      dom.appendChild(languageSelect);
      dom.appendChild(content);
      
      return {
        dom,
        contentDOM: code,
        update: (updatedNode) => {
          if (updatedNode.type !== node.type) return false;
          
          if (updatedNode.attrs.language !== node.attrs.language) {
            languageSelect.value = updatedNode.attrs.language || 'text';
            code.className = `language-${updatedNode.attrs.language || 'text'}`;
          }
          
          return true;
        },
      };
    };
  },
});

type WysiwygEditorProps = {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
};

export default function WysiwygEditor({ content, onChange, placeholder = 'Start writing...' }: WysiwygEditorProps) {
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [linkSelection, setLinkSelection] = useState<Range | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      CustomCodeBlock.configure({
        HTMLAttributes: {
          class: 'code-block',
        },
      }),
      Code,
      Image.configure({
        allowBase64: true,
        inline: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'editor-link',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Underline,
      TextStyle,
      Color,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  useEffect(() => {
    if (editor) {
      // Add a debug log for link insertion
      editor.on('update', ({ editor }) => {
        const isLinkActive = editor.isActive('link');
        if (isLinkActive) {
          const linkAttrs = editor.getAttributes('link');
          console.log('Link is active:', linkAttrs);
        }
      });
    }
  }, [editor]);

  const handleLinkSubmit = useCallback((url: string, text?: string) => {
    if (!editor) return;
    
    try {
      // First, restore the selection if we have one
      if (linkSelection) {
        try {
          editor.view.dispatch(editor.view.state.tr.setSelection(
            editor.view.state.selection.constructor.fromJSON(editor.view.state.doc, linkSelection)
          ));
        } catch (error) {
          console.error('Error restoring selection:', error);
          // If we can't restore the selection, just focus the editor
          editor.commands.focus();
        }
      }
      
      // If we have text, insert it with the link
      if (text && text.trim()) {
        // First check if there's already selected text
        const hasSelection = !editor.view.state.selection.empty;
        
        if (hasSelection) {
          // If text is already selected, replace it with the new text and link
          editor.chain()
            .focus()
            .deleteSelection()
            .insertContent(text)
            .setLink({ href: url })
            .run();
        } else {
          // If no text is selected, just insert the new text with link
          editor.chain()
            .focus()
            .insertContent(text)
            .setLink({ href: url })
            .run();
        }
      } else {
        // If no text provided, just convert the selected text to a link
        editor.chain()
          .focus()
          .extendMarkRange('link')
          .setLink({ href: url })
          .run();
      }
      
      // Log success for debugging
      console.log('Link inserted successfully:', { url, text });
    } catch (error) {
      console.error('Error inserting link:', error);
    }
    
    // Reset the link modal state
    setIsLinkModalOpen(false);
    setLinkUrl('');
    setLinkText('');
    setLinkSelection(null);
  }, [editor, linkSelection]);

  const handleInternalLinkSearch = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    setSearchQuery(query);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        // Get token from localStorage, but don't require it
        const token = localStorage.getItem('authToken');
        const headers: HeadersInit = {};
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch(`/api/posts/search?query=${encodeURIComponent(query)}`, {
          headers
        });
        
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data);
          
          if (data.length === 0) {
            console.log('No posts found matching:', query);
          }
        } else {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          console.error('Error searching posts:', errorData);
          setSearchResults([]);
        }
      } catch (error) {
        console.error('Error searching posts:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  }, []);

  const handleImageUpload = useCallback(async (file: File) => {
    if (!editor) return;
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      console.error('File is not an image');
      return;
    }
    
    // Create a placeholder for the image
    const placeholderId = `image-placeholder-${Date.now()}`;
    editor.chain().focus().insertContent(`<div id="${placeholderId}" class="image-placeholder">Uploading image...</div>`).run();
    
    try {
      // Read the file as base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        
        // Find the placeholder and replace it with the image
        const placeholder = document.getElementById(placeholderId);
        if (placeholder) {
          editor.chain().focus().setNodeSelection(editor.view.state.doc.resolve(editor.view.state.doc.text.indexOf(placeholder.textContent || ''))).run();
          editor.chain().focus().deleteSelection().run();
          editor.chain().focus().setImage({ src: result, alt: file.name }).run();
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      
      // Remove the placeholder if there's an error
      const placeholder = document.getElementById(placeholderId);
      if (placeholder) {
        editor.chain().focus().setNodeSelection(editor.view.state.doc.resolve(editor.view.state.doc.text.indexOf(placeholder.textContent || ''))).run();
        editor.chain().focus().deleteSelection().run();
      }
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="wysiwyg-editor">
      <Toolbar 
        editor={editor} 
        onOpenLinkModal={() => {
          try {
            // Store the current selection
            const selection = editor.view.state.selection;
            const selectionJSON = selection.toJSON();
            setLinkSelection(selectionJSON);
            
            // Get the selected text
            const selectedText = selection.empty 
              ? '' 
              : editor.view.state.doc.textBetween(
                  selection.from,
                  selection.to,
                  ' '
                );
            
            setLinkText(selectedText);
            
            // Check if the selection already has a link
            const linkMark = editor.isActive('link');
            if (linkMark) {
              const attrs = editor.getAttributes('link');
              if (attrs.href) {
                setLinkUrl(attrs.href);
              }
            } else {
              setLinkUrl('');
            }
            
            // Open the modal
            setIsLinkModalOpen(true);
            
            // Log for debugging
            console.log('Opening link modal with selection:', { selectionJSON, selectedText });
          } catch (error) {
            console.error('Error opening link modal:', error);
            // Open the modal anyway
            setIsLinkModalOpen(true);
          }
        }}
        onImageUpload={handleImageUpload}
      />
      
      <EditorContent editor={editor} className="editor-content" />
      
      <LinkModal 
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        onSubmit={handleLinkSubmit}
        initialUrl={linkUrl}
        initialText={linkText}
        onSearch={handleInternalLinkSearch}
        searchResults={searchResults}
        isSearching={isSearching}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    </div>
  );
} 