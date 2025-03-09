'use client';

import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import { useState } from 'react';

type CodeBlockComponentProps = {
  node: {
    attrs: {
      language: string;
    };
  };
  updateAttributes: (attrs: { language: string }) => void;
  extension: any;
};

export default function CodeBlockComponent({
  node: {
    attrs: { language: defaultLanguage },
  },
  updateAttributes,
}: CodeBlockComponentProps) {
  const [language, setLanguage] = useState(defaultLanguage);

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = event.target.value;
    setLanguage(newLanguage);
    updateAttributes({ language: newLanguage });
  };

  return (
    <NodeViewWrapper className="code-block-wrapper">
      <select
        contentEditable={false}
        className="code-block-language"
        value={language}
        onChange={handleLanguageChange}
      >
        <option value="text">Plain Text</option>
        <option value="javascript">JavaScript</option>
        <option value="typescript">TypeScript</option>
        <option value="python">Python</option>
        <option value="sql">SQL</option>
        <option value="bash">Bash</option>
        <option value="yaml">YAML</option>
        <option value="json">JSON</option>
      </select>
      <pre className={`code-block language-${language}`}>
        <NodeViewContent as="code" />
      </pre>
    </NodeViewWrapper>
  );
} 