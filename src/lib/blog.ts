import { format, parseISO } from 'date-fns';
import { prisma } from './prisma';

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  formattedDate: string;
  publishedAt: string;
  formattedPublishedAt: string;
  updatedAt?: string;
  formattedUpdatedAt?: string;
  author: string;
  excerpt: string;
  category: string;
  readTime: string;
  image?: string;
  content?: string;
  mdxSource?: any;
  status: 'draft' | 'published';
  tags?: string[];
};

export async function getSortedPostsData(): Promise<BlogPost[]> {
  try {
    // Get all posts from database
    const posts = await prisma.blogPost.findMany({
      orderBy: {
        publishedAt: 'desc'
      }
    });
    
    // Format the posts
    return posts.map(post => {
      // Format dates
      const formattedDate = format(post.date, 'yyyy-MM-dd');
      const formattedPublishedAt = format(post.publishedAt, 'yyyy-MM-dd');
      const formattedUpdatedAt = format(post.updatedAt, 'yyyy-MM-dd');
      
      // Calculate read time
      const wordsPerMinute = 200;
      const wordCount = post.content.split(/\s+/).length;
      const readTime = `${Math.ceil(wordCount / wordsPerMinute)} min read`;
      
      return {
        slug: post.slug,
        title: post.title,
        date: post.date.toISOString(),
        formattedDate,
        publishedAt: post.publishedAt.toISOString(),
        formattedPublishedAt,
        updatedAt: post.updatedAt.toISOString(),
        formattedUpdatedAt,
        author: post.author,
        excerpt: post.excerpt || '',
        category: post.category,
        image: post.image || '/images/blog-placeholder.jpg',
        readTime,
        status: post.status as 'draft' | 'published',
        tags: post.tags,
      };
    });
  } catch (error) {
    console.error('Error fetching blog posts from database:', error);
    return [];
  }
}

export async function getAllTags(): Promise<string[]> {
  try {
    // Get all posts from database
    const posts = await prisma.blogPost.findMany({
      select: {
        tags: true
      }
    });
    
    // Extract all tags and remove duplicates
    const allTags = posts.flatMap(post => post.tags);
    const uniqueTags = [...new Set(allTags)];
    
    return uniqueTags.sort();
  } catch (error) {
    console.error('Error fetching tags from database:', error);
    return [];
  }
}

export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  try {
    // Get posts with the specified tag
    const posts = await prisma.blogPost.findMany({
      where: {
        tags: {
          has: tag
        }
      },
      orderBy: {
        publishedAt: 'desc'
      }
    });
    
    // Format the posts
    return posts.map(post => {
      // Format dates
      const formattedDate = format(post.date, 'yyyy-MM-dd');
      const formattedPublishedAt = format(post.publishedAt, 'yyyy-MM-dd');
      const formattedUpdatedAt = format(post.updatedAt, 'yyyy-MM-dd');
      
      // Calculate read time
      const wordsPerMinute = 200;
      const wordCount = post.content.split(/\s+/).length;
      const readTime = `${Math.ceil(wordCount / wordsPerMinute)} min read`;
      
      return {
        slug: post.slug,
        title: post.title,
        date: post.date.toISOString(),
        formattedDate,
        publishedAt: post.publishedAt.toISOString(),
        formattedPublishedAt,
        updatedAt: post.updatedAt.toISOString(),
        formattedUpdatedAt,
        author: post.author,
        excerpt: post.excerpt || '',
        category: post.category,
        image: post.image || '/images/blog-placeholder.jpg',
        readTime,
        status: post.status as 'draft' | 'published',
        tags: post.tags,
      };
    });
  } catch (error) {
    console.error('Error fetching posts by tag from database:', error);
    return [];
  }
}

export async function getPostData(slug: string): Promise<BlogPost | null> {
  try {
    // Get post from database
    const post = await prisma.blogPost.findUnique({
      where: { slug }
    });
    
    if (!post) {
      return null;
    }
    
    // Format dates
    const formattedDate = format(post.date, 'yyyy-MM-dd');
    const formattedPublishedAt = format(post.publishedAt, 'yyyy-MM-dd');
    const formattedUpdatedAt = format(post.updatedAt, 'yyyy-MM-dd');
    
    // Calculate read time
    const wordsPerMinute = 200;
    const wordCount = post.content.split(/\s+/).length;
    const readTime = `${Math.ceil(wordCount / wordsPerMinute)} min read`;
    
    return {
      slug: post.slug,
      title: post.title,
      date: post.date.toISOString(),
      formattedDate,
      publishedAt: post.publishedAt.toISOString(),
      formattedPublishedAt,
      updatedAt: post.updatedAt.toISOString(),
      formattedUpdatedAt,
      author: post.author,
      excerpt: post.excerpt || '',
      category: post.category,
      content: post.content,
      image: post.image || '/images/blog-placeholder.jpg',
      readTime,
      status: post.status as 'draft' | 'published',
      tags: post.tags,
    };
  } catch (error) {
    console.error('Error fetching post from database:', error);
    return null;
  }
}

/**
 * Get all post slugs for static generation
 */
export async function getAllPostSlugs(): Promise<string[]> {
  try {
    const posts = await prisma.blogPost.findMany({
      select: {
        slug: true
      }
    });
    
    return posts.map(post => post.slug);
  } catch (error) {
    console.error('Error fetching post slugs:', error);
    return [];
  }
} 