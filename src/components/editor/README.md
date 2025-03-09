# WYSIWYG Blog Editor

A rich text editor for technical blog posts, built with TipTap and React.

## Features

- **Rich Text Formatting**: Bold, italic, underline, strikethrough, headings, lists, blockquotes, and more.
- **Code Blocks with Syntax Highlighting**: Support for JavaScript, TypeScript, Python, SQL, Bash, YAML, and JSON.
- **Image Upload**: Insert images with placeholders during upload.
- **Internal Linking**: Search and link to other blog posts in the system.
- **Keyboard Shortcuts**: Common keyboard shortcuts for formatting.

## Components

- `WysiwygEditor.tsx`: The main editor component.
- `Toolbar.tsx`: The toolbar with formatting buttons.
- `LinkModal.tsx`: Modal for adding links, with internal post search.
- `CodeBlockComponent.tsx`: Component for code blocks with syntax highlighting.
- `editor.css`: Styles for the editor.

## Usage

```tsx
import WysiwygEditor from '@/components/editor/WysiwygEditor';

function MyComponent() {
  const [content, setContent] = useState('<p>Initial content</p>');

  return (
    <WysiwygEditor 
      content={content} 
      onChange={setContent} 
      placeholder="Start writing..."
    />
  );
}
```

## Props

### WysiwygEditor

| Prop | Type | Description |
|------|------|-------------|
| `content` | string | The HTML content to display in the editor. |
| `onChange` | (content: string) => void | Callback function that receives the updated HTML content. |
| `placeholder` | string | (Optional) Placeholder text to display when the editor is empty. Default: "Start writing..." |

## Keyboard Shortcuts

- **Bold**: Ctrl+B
- **Italic**: Ctrl+I
- **Underline**: Ctrl+U
- **Code**: Ctrl+E
- **Heading 1-3**: Ctrl+Alt+1, Ctrl+Alt+2, Ctrl+Alt+3
- **Bullet List**: Ctrl+Shift+8
- **Ordered List**: Ctrl+Shift+7
- **Code Block**: Ctrl+Alt+C

## Dependencies

- [@tiptap/react](https://tiptap.dev/): The core editor framework.
- [@tiptap/starter-kit](https://tiptap.dev/api/extensions/starter-kit): A collection of essential TipTap extensions.
- [highlight.js](https://highlightjs.org/): For syntax highlighting in code blocks.

## API Endpoints

- `/api/posts/search`: Used for searching posts when creating internal links.

## Demo

Visit `/editor-demo` to see a live demo of the editor. 