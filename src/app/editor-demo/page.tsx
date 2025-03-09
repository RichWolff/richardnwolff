'use client';

import { useState } from 'react';
import WysiwygEditor from '@/components/editor/WysiwygEditor';

export default function EditorDemoPage() {
  const [content, setContent] = useState('<h1>Welcome to the WYSIWYG Editor Demo</h1><p>This is a demo of the rich text editor for technical blog posts.</p><p>Try out the following features:</p><ul><li>Formatting text (bold, italic, underline)</li><li>Creating headings (H1, H2, H3)</li><li>Adding code blocks with syntax highlighting</li><li>Inserting images</li><li>Creating links to other posts</li></ul>');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">WYSIWYG Editor Demo</h1>
      
      <div className="mb-8">
        <WysiwygEditor 
          content={content} 
          onChange={setContent} 
          placeholder="Start writing..."
        />
      </div>
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Editor Output</h2>
        <div className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg">
          <h3 className="text-lg font-medium mb-2">HTML Content:</h3>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
            {content}
          </pre>
        </div>
        
        <div className="mt-6 p-4 border border-gray-300 dark:border-gray-700 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Rendered Content:</h3>
          <div 
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </div>
  );
} 