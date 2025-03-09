import Image from 'next/image';
import Link from 'next/link';

// Define custom components for MDX
export const components = {
  // Override default elements
  h1: (props: any) => <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />,
  h2: (props: any) => <h2 className="text-2xl font-bold mt-6 mb-3" {...props} />,
  h3: (props: any) => <h3 className="text-xl font-bold mt-5 mb-2" {...props} />,
  h4: (props: any) => <h4 className="text-lg font-bold mt-4 mb-2" {...props} />,
  p: (props: any) => <p className="my-4" {...props} />,
  a: (props: any) => (
    <Link 
      href={props.href} 
      className="text-blue-600 dark:text-blue-400 hover:underline"
      {...props}
    />
  ),
  ul: (props: any) => <ul className="list-disc pl-6 my-4" {...props} />,
  ol: (props: any) => <ol className="list-decimal pl-6 my-4" {...props} />,
  li: (props: any) => <li className="my-1" {...props} />,
  blockquote: (props: any) => (
    <blockquote className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 my-4 italic" {...props} />
  ),
  code: (props: any) => {
    const { children, className } = props;
    const match = /language-(\w+)/.exec(className || '');
    return match ? (
      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto my-4">
        <code className={className} {...props} />
      </pre>
    ) : (
      <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm" {...props} />
    );
  },
  pre: (props: any) => <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto my-4" {...props} />,
  table: (props: any) => (
    <div className="overflow-x-auto my-4">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700" {...props} />
    </div>
  ),
  th: (props: any) => (
    <th className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-left text-sm font-medium" {...props} />
  ),
  td: (props: any) => <td className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 text-sm" {...props} />,
  hr: (props: any) => <hr className="my-6 border-gray-200 dark:border-gray-700" {...props} />,
  
  // Custom components
  img: (props: any) => (
    <div className="relative w-full h-64 md:h-96 my-6">
      <Image
        src={props.src}
        alt={props.alt || ''}
        fill
        className="object-cover rounded-lg"
        sizes="(max-width: 768px) 100vw, 768px"
      />
    </div>
  ),
}; 