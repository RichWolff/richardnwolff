'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ImageDocsModal from './ImageDocsModal';
import { useAuth } from '@/context/AuthContext';
import WysiwygEditor from './editor/WysiwygEditor';

type EditBlogPostFormProps = {
  slug: string;
};

export default function EditBlogPostForm({ slug }: EditBlogPostFormProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isImageDocsOpen, setIsImageDocsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    category: '',
    content: '',
    image: '',
    status: 'draft',
    tags: '',
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      if (!slug || !isAuthenticated) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Get auth token
        const token = localStorage.getItem('authToken');
        if (!token) {
          setError('Authentication token not found');
          setIsLoading(false);
          return;
        }
        
        // Fetch post from API
        const response = await fetch(`/api/posts/${slug}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const post = await response.json();
          
          // Set form data
          setFormData({
            title: post.title || '',
            excerpt: post.excerpt || '',
            category: post.category || '',
            content: post.content || '',
            image: post.image || '',
            status: post.status || 'draft',
            tags: post.tags ? post.tags.join(', ') : '',
          });
          
          // Set image preview if available
          if (post.image) {
            setImagePreview(post.image);
          }
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to fetch post');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        setError('An error occurred while fetching the post');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPost();
  }, [slug, isAuthenticated]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleContentChange = (content: string) => {
    setFormData({ ...formData, content });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setImagePreview(result);
      setFormData({
        ...formData,
        image: result
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Get auth token
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Authentication token not found');
        setIsSubmitting(false);
        return;
      }

      // Prepare tags array from comma-separated string
      const tagsArray = formData.tags
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        : [];

      // Call the API to update the post
      const response = await fetch(`/api/posts/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title,
          excerpt: formData.excerpt,
          content: formData.content,
          category: formData.category,
          status: formData.status,
          image: formData.image,
          tags: tagsArray
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to the blog page after successful submission
        router.push('/dashboard');
      } else {
        setError(data.error || 'Failed to update post');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('An error occurred while updating the post');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Excerpt
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          >
            <option value="">Select a category</option>
            <option value="Tutorial">Tutorial</option>
            <option value="Data Science">Data Science</option>
            <option value="Analytics">Analytics</option>
            <option value="Business Intelligence">Business Intelligence</option>
            <option value="Technology">Technology</option>
          </select>
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g. python, data, analytics"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Draft posts are only visible to you. Published posts are visible to everyone.
          </p>
        </div>

        <div>
          <div className="flex items-center">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Content
            </label>
            <button
              type="button"
              onClick={() => setIsImageDocsOpen(true)}
              className="ml-2 inline-flex items-center justify-center rounded-full h-5 w-5 bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
              title="Image documentation"
            >
              i
            </button>
          </div>
          <div className="mt-1">
            <WysiwygEditor 
              content={formData.content} 
              onChange={handleContentChange} 
              placeholder="Start writing your blog post..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Header Image
          </label>
          <div className="mt-1 flex items-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Choose Image
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
          </div>
          
          {imagePreview && (
            <div className="mt-4 relative aspect-video w-full max-w-md rounded-lg overflow-hidden">
              <Image
                src={imagePreview}
                alt="Image preview"
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : 'Update Post'}
          </button>
          
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
      
      <ImageDocsModal 
        isOpen={isImageDocsOpen} 
        onClose={() => setIsImageDocsOpen(false)} 
      />
    </>
  );
} 