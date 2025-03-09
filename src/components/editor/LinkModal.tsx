'use client';

import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';

type LinkModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (url: string, text?: string) => void;
  initialUrl?: string;
  initialText?: string;
  onSearch: (query: string) => void;
  searchResults: any[];
  isSearching: boolean;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
};

export default function LinkModal({
  isOpen,
  onClose,
  onSubmit,
  initialUrl = '',
  initialText = '',
  onSearch,
  searchResults,
  isSearching,
  searchQuery,
  setSearchQuery,
}: LinkModalProps) {
  const [url, setUrl] = useState(initialUrl);
  const [text, setText] = useState(initialText);
  const [activeTab, setActiveTab] = useState<'internal' | 'external'>('internal');

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setUrl(initialUrl);
      setText(initialText);
      setActiveTab('internal');
    }
  }, [isOpen, initialUrl, initialText]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(url, text || undefined);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleSelectPost = (post: any) => {
    const postUrl = `/blog/${post.slug}`;
    const postTitle = post.title;
    
    // Set the URL and text
    setUrl(postUrl);
    const linkText = text || postTitle;
    setText(linkText);
    
    // Submit the form and close the modal
    onSubmit(postUrl, linkText);
    onClose();
    
    // Log for debugging
    console.log('Selected post:', { post, url: postUrl, text: linkText });
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title 
                  as="h3" 
                  className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                >
                  Add Link
                </Dialog.Title>
                
                <div className="mt-4">
                  <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
                    <button
                      type="button"
                      className={`py-2 px-4 border-b-2 ${
                        activeTab === 'internal'
                          ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                          : 'border-transparent text-gray-500 dark:text-gray-400'
                      }`}
                      onClick={() => setActiveTab('internal')}
                    >
                      Internal Link
                    </button>
                    <button
                      type="button"
                      className={`py-2 px-4 border-b-2 ${
                        activeTab === 'external'
                          ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                          : 'border-transparent text-gray-500 dark:text-gray-400'
                      }`}
                      onClick={() => setActiveTab('external')}
                    >
                      External Link
                    </button>
                  </div>
                  
                  <form onSubmit={handleSubmit}>
                    {activeTab === 'internal' ? (
                      <div>
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Search Posts
                        </label>
                        <input
                          type="text"
                          id="search"
                          value={searchQuery}
                          onChange={handleSearchInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          placeholder="Type to search posts..."
                          autoComplete="off"
                        />
                        
                        <div className="mt-2 max-h-40 overflow-y-auto">
                          {isSearching ? (
                            <div className="text-center py-2 text-gray-500 dark:text-gray-400">
                              Searching...
                            </div>
                          ) : searchResults.length > 0 ? (
                            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                              {searchResults.map((post) => (
                                <li 
                                  key={post.id} 
                                  className="py-2 px-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded"
                                  onClick={() => handleSelectPost(post)}
                                >
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {post.title}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(post.publishedAt).toLocaleDateString()}
                                    {post.tags && post.tags.length > 0 && (
                                      <span className="ml-2">
                                        Tags: {post.tags.join(', ')}
                                      </span>
                                    )}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          ) : searchQuery ? (
                            <div className="text-center py-2 text-gray-500 dark:text-gray-400">
                              No posts found matching "{searchQuery}". 
                              <div className="text-xs mt-1">
                                Try different keywords or check your spelling.
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          URL
                        </label>
                        <input
                          type="url"
                          id="url"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          placeholder="https://example.com"
                          required
                        />
                      </div>
                    )}
                    
                    <div className="mt-4">
                      <label htmlFor="text" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Link Text (optional)
                      </label>
                      <input
                        type="text"
                        id="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Display text for the link"
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Leave empty to use the selected text
                      </p>
                    </div>
                    
                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        disabled={!url}
                      >
                        Add Link
                      </button>
                    </div>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 