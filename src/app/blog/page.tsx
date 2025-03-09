import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getSortedPostsData, getAllTags, type BlogPost } from '@/lib/blog';
import BlogSearch from '@/components/BlogSearch';
import TagFilter from '@/components/TagFilter';

export const metadata: Metadata = {
  title: 'Blog | Richard Wolff',
  description: 'Insights and thoughts on data science, analytics, and business intelligence from Richard Wolff.',
};

// Force dynamic rendering and revalidation on every request
export const revalidate = 0;
export const dynamic = 'force-dynamic';

// This is a server component, so we can use the blog library directly
export default async function Blog() {
  // Only show published posts to public visitors
  const allPosts = await getSortedPostsData();
  const posts = allPosts.filter(post => post.status === 'published');
  const allTags = await getAllTags();

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-12">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Blog</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Thoughts on data science, analytics, and business intelligence
            </p>
          </div>
        </div>
        
        <BlogSearch />
        
        {allTags.length > 0 && (
          <TagFilter tags={allTags} />
        )}

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
          {posts.map((post) => (
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
                    <p className="text-sm font-medium text-primary dark:text-accent">
                      {post.category}
                    </p>
                    <h2 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">
                      {post.title}
                    </h2>
                    <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
                      {post.excerpt}
                    </p>
                    
                    {post.tags && post.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
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
                      <time dateTime={post.publishedAt} className="ml-1">{post.formattedPublishedAt}</time>
                    </div>
                    <span>•</span>
                    <span>{post.readTime}</span>
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
        
        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 dark:text-gray-400">No published posts yet.</p>
          </div>
        )}
      </div>
    </main>
  );
} 