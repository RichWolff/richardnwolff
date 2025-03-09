import type { Metadata } from 'next';
import Link from 'next/link';
import EditBlogPostForm from '@/components/EditBlogPostForm';

export const metadata: Metadata = {
  title: 'Edit Blog Post | Richard Wolff',
  description: 'Edit an existing blog post on Richard Wolff\'s blog.',
};

export default function EditBlogPost({ params }: { params: { slug: string } }) {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link 
          href="/dashboard" 
          className="text-primary hover:text-primary-dark transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to dashboard
        </Link>
      </div>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Blog Post</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Make changes to your blog post below.
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <EditBlogPostForm slug={params.slug} />
        </div>
      </div>
    </main>
  );
} 