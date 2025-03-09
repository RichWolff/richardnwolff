declare module 'lowlight' {
  export function createLowlight(): {
    register: (name: string, language: any) => void;
    highlight: (language: string, code: string) => any;
    registerAlias: (name: string | string[], alias: string | string[]) => void;
    registered: (aliasOrName: string) => boolean;
    listLanguages: () => string[];
    highlightAuto: (value: string, options?: any) => any;
  };
}

declare module 'highlight.js/lib/languages/javascript' {
  const javascript: any;
  export default javascript;
}

declare module 'highlight.js/lib/languages/typescript' {
  const typescript: any;
  export default typescript;
}

declare module 'highlight.js/lib/languages/python' {
  const python: any;
  export default python;
}

declare module 'highlight.js/lib/languages/sql' {
  const sql: any;
  export default sql;
}

declare module 'highlight.js/lib/languages/bash' {
  const bash: any;
  export default bash;
}

declare module 'highlight.js/lib/languages/yaml' {
  const yaml: any;
  export default yaml;
}

declare module 'highlight.js/lib/languages/json' {
  const json: any;
  export default json;
} 