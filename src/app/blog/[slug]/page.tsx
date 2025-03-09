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
import { format } from 'date-fns';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { components } from '@/components/mdx-components';

type Props = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostData(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found | Richard Wolff',
      description: 'The requested blog post could not be found.',
    };
  }
  
  return {
    title: `${post.title} | Richard Wolff`,
    description: post.excerpt || `Read ${post.title} by Richard Wolff`,
    openGraph: {
      title: post.title,
      description: post.excerpt || `Read ${post.title} by Richard Wolff`,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      tags: post.tags,
      images: post.image ? [{ url: post.image }] : undefined,
    },
  };
}

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map(slug => ({ slug }));
}

export default async function BlogPost({ params }: Props) {
  const post = await getPostData(params.slug);
  
  if (!post || (post.status !== 'published' && process.env.NODE_ENV === 'production')) {
    notFound();
  }
  
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <article className="prose dark:prose-invert lg:prose-lg mx-auto">
        {post.status === 'draft' && (
          <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 p-4 rounded-lg mb-8">
            <p className="font-medium">This post is a draft and is not visible to the public.</p>
          </div>
        )}
        
        {post.image && (
          <div className="relative aspect-video w-full mb-8 rounded-lg overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{post.title}</h1>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-8">
          <div className="flex items-center">
            <span>Published: </span>
            <time dateTime={post.publishedAt} className="ml-1">{post.formattedPublishedAt}</time>
          </div>
          
          {post.updatedAt && (
            <div className="flex items-center">
              <span>Updated: </span>
              <time dateTime={post.updatedAt} className="ml-1">{post.formattedUpdatedAt}</time>
            </div>
          )}
          
          <div>{post.readTime}</div>
          
          <div>By {post.author}</div>
        </div>
        
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map(tag => (
              <Link 
                key={tag}
                href={`/blog/tag/${encodeURIComponent(tag)}`}
                className="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
        
        <div className="mt-8">
          <MDXRemote source={post.content} components={components} />
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <Link 
            href="/blog"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Back to all posts
          </Link>
        </div>
      </article>
    </main>
  );
} 