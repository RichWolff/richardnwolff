import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getAllPostSlugs, getPostData } from '@/lib/blog';
import { formatDate } from '@/lib/utils';
import { serialize } from 'next-mdx-remote/serialize';
import rehypeImgSize from 'rehype-img-size';
import rehypeSlug from 'rehype-slug';
import MDXContent from '@/components/MDXContent';

type Props = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata | null> {
  const post = await getPostData(params.slug);
  
  if (!post) {
    return null;
  }
  
  return {
    title: `${post.title} | Richard Wolff's Blog`,
    description: post.excerpt,
  };
}

export async function generateStaticParams() {
  const paths = getAllPostSlugs();
  return paths;
}

export default async function BlogPost({ params }: Props) {
  const post = await getPostData(params.slug);
  
  // If post doesn't exist, show 404 page
  if (!post) {
    notFound();
  }
  
  // Process MDX content
  const mdxSource = await serialize(post.content || '', {
    mdxOptions: {
      rehypePlugins: [
        rehypeSlug,
        [rehypeImgSize, { dir: 'public' }]
      ],
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <main>
        <article className="max-w-3xl mx-auto">
          <div className="relative w-full h-64 mb-8 rounded-lg overflow-hidden">
            <Image
              src={post.image || '/images/placeholder.svg'}
              alt={`Cover image for ${post.title}`}
              fill
              className="object-cover"
              priority
            />
          </div>
          
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm font-medium">
                {post.category}
              </span>
              {post.status === 'draft' && (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full text-sm font-medium">
                  Draft
                </span>
              )}
            </div>
            
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            
            <div className="flex flex-col gap-1 text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <span>
                  <Link href="/about" className="text-blue-600 hover:underline">
                    {post.author}
                  </Link>
                </span>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Published:</span>
                <time dateTime={post.publishedAt}>{post.formattedPublishedAt}</time>
                
                {post.updatedAt && (
                  <>
                    <span>•</span>
                    <span className="text-gray-500">Updated:</span>
                    <time dateTime={post.updatedAt}>{post.formattedUpdatedAt}</time>
                  </>
                )}
              </div>
            </div>
            
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map(tag => (
                  <Link 
                    key={tag} 
                    href={`/blog/tag/${encodeURIComponent(tag)}`}
                    className="px-3 py-1 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
          </header>
          
          <div className="prose prose-lg max-w-none">
            <MDXContent source={mdxSource} />
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <Link href="/blog" className="text-blue-600 hover:underline">
              ← Back to all posts
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
} 