'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BlogSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // If query starts with #, it's a tag search
      if (query.trim().startsWith('#') && query.trim().length > 1) {
        const tag = query.trim().substring(1);
        router.push(`/blog/tag/${encodeURIComponent(tag)}`);
      } else {
        router.push(`/blog/search?q=${encodeURIComponent(query.trim())}`);
      }
    }
  };
  
  return (
    <form onSubmit={handleSearch} className="mb-8">
      <div className="flex flex-col">
        <div className="flex">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts by title, content, or #tag..."
            className="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Tip: Use # to search by tag (e.g., #python)
        </p>
      </div>
    </form>
  );
} 