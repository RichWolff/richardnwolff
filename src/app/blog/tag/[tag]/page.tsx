import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getSortedPostsData, getAllTags, getPostsByTag, type BlogPost } from '@/lib/blog';
import BlogSearch from '@/components/BlogSearch';
import TagFilter from '@/components/TagFilter';

type Props = {
  params: {
    tag: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const decodedTag = decodeURIComponent(params.tag);
  
  return {
    title: `Posts tagged with #${decodedTag} | Richard Wolff`,
    description: `Browse all blog posts tagged with #${decodedTag} by Richard Wolff.`,
  };
}

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map(tag => ({
    tag: encodeURIComponent(tag),
  }));
}

export default function TagPage({ params }: Props) {
  const decodedTag = decodeURIComponent(params.tag);
  const allTags = getAllTags();
  
  // Check if tag exists
  if (!allTags.includes(decodedTag)) {
    notFound();
  }
  
  // Get posts with this tag
  const posts = getPostsByTag(decodedTag).filter(post => post.status === 'published');

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-12">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Posts tagged with <span className="text-blue-600">#{decodedTag}</span>
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'} found
          </p>
        </div>
        
        <BlogSearch />
        
        <TagFilter tags={allTags} />

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
                            className={`px-2 py-1 text-xs rounded-full ${
                              tag === decodedTag
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            } transition-colors`}
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
            <p className="text-xl text-gray-600 dark:text-gray-400">No published posts with this tag.</p>
            <Link href="/blog" className="mt-4 inline-block text-blue-600 hover:underline">
              View all posts
            </Link>
          </div>
        )}
      </div>
    </main>
  );
} 