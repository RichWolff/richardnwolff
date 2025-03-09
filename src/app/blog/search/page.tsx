'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import BlogSearch from '@/components/BlogSearch';
import { useAuth } from '@/context/AuthContext';
import { format, parseISO } from 'date-fns';

type SearchResult = {
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  category: string;
  status: 'draft' | 'published';
  tags?: string[];
  image?: string;
  publishedAt?: string;
  updatedAt?: string;
};

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();
  
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setSearchResults([]);
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      
      try {
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };
        
        // Add authorization header if user is authenticated
        if (isAuthenticated) {
          const token = localStorage.getItem('authToken');
          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
          }
        }
        
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
          headers
        });
        
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data.results);
        } else {
          console.error('Search failed:', await response.text());
          setSearchResults([]);
        }
      } catch (error) {
        console.error('Error searching posts:', error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSearchResults();
  }, [query, isAuthenticated]);
  
  // Format date for display in ISO format (YYYY-MM-DD)
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'yyyy-MM-dd');
    } catch (error) {
      return dateString;
    }
  };
  
  // Handle tag click - this is a client-side function
  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.stopPropagation();
    e.preventDefault();
    window.location.href = `/blog/tag/${encodeURIComponent(tag)}`;
  };
  
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Search Results</h1>
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        {isLoading ? 'Searching...' : `${searchResults.length} results for "${query}"`}
      </p>
      
      <BlogSearch />
      
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Searching posts...</p>
        </div>
      ) : (
        <>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            {searchResults.map((post) => (
              <article
                key={post.slug}
                className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md"
              >
                <Link href={`/blog/${post.slug}`}>
                  <div className="relative aspect-video w-full mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={post.image || '/images/placeholder.svg'}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex-1 p-6 flex flex-col">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-primary dark:text-accent">
                          {post.category}
                        </p>
                        {post.status === 'draft' && (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                            Draft
                          </span>
                        )}
                      </div>
                      <h2 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">
                        {post.title}
                      </h2>
                      <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
                        {post.excerpt}
                      </p>
                      {post.tags && post.tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2" onClick={e => e.stopPropagation()}>
                          {post.tags.map(tag => (
                            <Link 
                              key={tag}
                              href={`/blog/tag/${encodeURIComponent(tag)}`}
                              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                              #{tag}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <span>Published: </span>
                        <time dateTime={post.publishedAt || post.date} className="ml-1">
                          {formatDate(post.publishedAt || post.date)}
                        </time>
                      </div>
                      {post.updatedAt && (
                        <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                          Updated
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
          
          {searchResults.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 dark:text-gray-400">No posts found matching your search.</p>
              <Link href="/blog" className="mt-4 inline-block text-blue-600 hover:underline">
                View all posts
              </Link>
            </div>
          )}
        </>
      )}
    </main>
  );
} 