import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { format, parseISO } from 'date-fns';

const postsDirectory = path.join(process.cwd(), 'content/blog');

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

export function getSortedPostsData(): BlogPost[] {
  try {
    // Check if directory exists
    if (!fs.existsSync(postsDirectory)) {
      console.warn(`Blog directory not found: ${postsDirectory}`);
      return [];
    }
    
    const fileNames = fs.readdirSync(postsDirectory);
    
    const allPostsData = fileNames
      .filter(fileName => fileName.endsWith('.mdx'))
      .map((fileName) => {
        try {
          // Remove ".mdx" from file name to get slug
          const slug = fileName.replace(/\.mdx$/, '');
          
          // Read markdown file as string
          const fullPath = path.join(postsDirectory, fileName);
          const fileContents = fs.readFileSync(fullPath, 'utf8');
          
          // Use gray-matter to parse the post metadata section
          const matterResult = matter(fileContents);
          
          // Handle dates
          const date = matterResult.data.date;
          const formattedDate = format(parseISO(date), 'yyyy-MM-dd');
          
          // Use publishedAt if available, otherwise fall back to date
          const publishedAt = matterResult.data.publishedAt || date;
          const formattedPublishedAt = format(parseISO(publishedAt), 'yyyy-MM-dd');
          
          // Handle updatedAt if available
          let updatedAt = matterResult.data.updatedAt;
          let formattedUpdatedAt;
          if (updatedAt) {
            formattedUpdatedAt = format(parseISO(updatedAt), 'yyyy-MM-dd');
          }
          
          // Set default image if not provided
          const image = matterResult.data.image || '/images/blog-placeholder.jpg';
          
          // Use readTime from frontmatter if available, otherwise calculate it
          let readTime = matterResult.data.readTime;
          if (!readTime) {
            const wordsPerMinute = 200;
            const wordCount = matterResult.content.split(/\s+/).length;
            readTime = `${Math.ceil(wordCount / wordsPerMinute)} min read`;
          }
          
          // Use 'published' as default status if not specified
          const status = matterResult.data.status || 'published';
          
          // Extract tags or use empty array if not specified
          const tags = matterResult.data.tags || [];
          
          // Combine the data with the slug
          return {
            slug,
            title: matterResult.data.title,
            date,
            formattedDate,
            publishedAt,
            formattedPublishedAt,
            updatedAt,
            formattedUpdatedAt,
            author: matterResult.data.author,
            excerpt: matterResult.data.excerpt,
            category: matterResult.data.category,
            image,
            readTime,
            status: status as 'draft' | 'published',
            tags,
          } as BlogPost;
        } catch (error) {
          console.error(`Error processing file ${fileName}:`, error);
          return null;
        }
      });
    
    // Filter out null values and cast to BlogPost[]
    const validPosts = allPostsData.filter((post): post is BlogPost => post !== null);
    
    // Sort posts by publishedAt date (newest first)
    return validPosts.sort((a, b) => {
      if (new Date(a.publishedAt) < new Date(b.publishedAt)) {
        return 1;
      } else {
        return -1;
      }
    });
  } catch (error) {
    console.error('Error reading blog posts directory:', error);
    return [];
  }
}

export function getAllPostSlugs() {
  try {
    // Check if directory exists
    if (!fs.existsSync(postsDirectory)) {
      console.warn(`Blog directory not found: ${postsDirectory}`);
      return [];
    }
    
    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames
      .filter(fileName => fileName.endsWith('.mdx'))
      .map((fileName) => {
        return {
          params: {
            slug: fileName.replace(/\.mdx$/, ''),
          },
        };
      });
  } catch (error) {
    console.error('Error reading blog posts directory:', error);
    return [];
  }
}

export async function getPostData(slug: string): Promise<BlogPost | null> {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);
  
  // Check if the file exists before trying to read it
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Handle dates
  const date = matterResult.data.date;
  const formattedDate = format(parseISO(date), 'yyyy-MM-dd');
  
  // Use publishedAt if available, otherwise fall back to date
  const publishedAt = matterResult.data.publishedAt || date;
  const formattedPublishedAt = format(parseISO(publishedAt), 'yyyy-MM-dd');
  
  // Handle updatedAt if available
  let updatedAt = matterResult.data.updatedAt;
  let formattedUpdatedAt;
  if (updatedAt) {
    formattedUpdatedAt = format(parseISO(updatedAt), 'yyyy-MM-dd');
  }

  // Set default image if not provided
  const image = matterResult.data.image || '/images/blog-placeholder.jpg';

  // Return the raw content for MDX processing in the component
  const content = matterResult.content;

  // Use readTime from frontmatter if available, otherwise calculate it
  let readTime = matterResult.data.readTime;
  if (!readTime) {
    const wordsPerMinute = 200;
    const wordCount = matterResult.content.split(/\s+/).length;
    readTime = `${Math.ceil(wordCount / wordsPerMinute)} min read`;
  }

  // Use 'published' as default status if not specified
  const status = matterResult.data.status || 'published';
  
  // Extract tags or use empty array if not specified
  const tags = matterResult.data.tags || [];

  // Combine the data with the slug and content
  return {
    slug,
    content,
    ...(matterResult.data as Omit<BlogPost, 'slug' | 'content' | 'formattedDate' | 'formattedPublishedAt' | 'formattedUpdatedAt' | 'image' | 'readTime' | 'status' | 'tags'>),
    date,
    formattedDate,
    publishedAt,
    formattedPublishedAt,
    updatedAt,
    formattedUpdatedAt,
    image,
    readTime,
    status,
    tags,
  };
}

// Get all unique tags from all posts
export function getAllTags(): string[] {
  const posts = getSortedPostsData();
  const allTags = new Set<string>();
  
  posts.forEach(post => {
    if (post.tags && post.tags.length > 0) {
      post.tags.forEach(tag => allTags.add(tag));
    }
  });
  
  return Array.from(allTags).sort();
}

// Get posts by tag
export function getPostsByTag(tag: string): BlogPost[] {
  const posts = getSortedPostsData();
  return posts.filter(post => 
    post.tags && 
    post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  );
} 