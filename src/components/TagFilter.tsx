'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface TagFilterProps {
  tags: string[];
}

export default function TagFilter({ tags }: TagFilterProps) {
  const [expanded, setExpanded] = useState(false);
  const pathname = usePathname();
  const isTagPage = pathname.startsWith('/blog/tag/');
  
  // Display only first 10 tags if not expanded
  const displayTags = expanded ? tags : tags.slice(0, 10);
  const hasMoreTags = tags.length > 10;
  
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Filter by Tags</h2>
      <div className="flex flex-wrap gap-2">
        {isTagPage && (
          <Link 
            href="/blog"
            className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
          >
            All Posts
          </Link>
        )}
        
        {displayTags.map(tag => (
          <Link 
            key={tag}
            href={`/blog/tag/${encodeURIComponent(tag)}`}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              pathname === `/blog/tag/${encodeURIComponent(tag)}`
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            #{tag}
          </Link>
        ))}
        
        {hasMoreTags && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="px-3 py-1 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-full text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {expanded ? 'Show Less' : `+${tags.length - 10} More`}
          </button>
        )}
      </div>
    </div>
  );
} 