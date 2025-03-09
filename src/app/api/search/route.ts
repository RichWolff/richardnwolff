import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import jwt from 'jsonwebtoken';

// Tell Next.js this route should be dynamic
export const dynamic = 'force-dynamic';

const postsDirectory = path.join(process.cwd(), 'content/blog');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Define post type
type Post = {
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  category: string;
  content: string;
  status: string;
  tags: string[];
  image?: string;
  publishedAt?: string;
  updatedAt?: string;
};

// Helper function to verify JWT token
function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
  } catch (error) {
    return null;
  }
}

// Helper function to get all posts
function getAllPosts(): Post[] {
  try {
    // Check if directory exists
    if (!fs.existsSync(postsDirectory)) {
      console.warn(`Blog directory not found: ${postsDirectory}`);
      return [];
    }
    
    const fileNames = fs.readdirSync(postsDirectory);
    
    const posts = fileNames
      .filter(fileName => fileName.endsWith('.mdx'))
      .map((fileName) => {
        try {
          const slug = fileName.replace(/\.mdx$/, '');
          const fullPath = path.join(postsDirectory, fileName);
          const fileContents = fs.readFileSync(fullPath, 'utf8');
          const matterResult = matter(fileContents);
          
          // Use 'published' as default status if not specified
          const status = matterResult.data.status || 'published';
          
          // Get publishedAt and updatedAt dates
          const date = matterResult.data.date || new Date().toISOString();
          const publishedAt = matterResult.data.publishedAt || date;
          const updatedAt = matterResult.data.updatedAt;
          
          return {
            slug,
            title: matterResult.data.title || 'Untitled',
            date,
            author: matterResult.data.author || 'Anonymous',
            excerpt: matterResult.data.excerpt || '',
            category: matterResult.data.category || 'Uncategorized',
            content: matterResult.content,
            status,
            tags: matterResult.data.tags || [],
            image: matterResult.data.image || undefined,
            publishedAt,
            updatedAt,
          } as Post;
        } catch (error) {
          console.error(`Error processing file ${fileName}:`, error);
          return null;
        }
      });
    
    // Filter out null values
    return posts.filter((post): post is Post => post !== null);
  } catch (error) {
    console.error('Error reading blog posts directory:', error);
    return [];
  }
}

// Search posts
export async function GET(request: NextRequest) {
  try {
    const user = verifyToken(request);
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const tagFilter = searchParams.get('tag') || '';
    
    if (!query && !tagFilter) {
      return NextResponse.json(
        { error: 'Search query or tag filter is required' },
        { status: 400 }
      );
    }
    
    const allPosts = getAllPosts();
    
    // Apply tag filter if provided
    let filteredPosts = allPosts;
    if (tagFilter) {
      filteredPosts = allPosts.filter(post => 
        post.tags.some(tag => tag.toLowerCase() === tagFilter.toLowerCase())
      );
    }
    
    // Filter posts by query (case-insensitive)
    if (query) {
      filteredPosts = filteredPosts.filter(post => {
        // If post is a draft and user is not authenticated, exclude it
        if (post.status === 'draft' && !user) {
          return false;
        }
        
        // Check if query starts with # to search for tags
        if (query.startsWith('#') && query.length > 1) {
          const tagQuery = query.substring(1).toLowerCase();
          return post.tags.some(tag => tag.toLowerCase().includes(tagQuery));
        }
        
        // Regular search
        const searchableText = `
          ${post.title} ${post.excerpt} ${post.category} 
          ${post.author} ${post.content} ${post.tags.join(' ')}
        `.toLowerCase();
        
        // Split query into words for better matching
        const queryWords = query.toLowerCase().split(/\s+/).filter(word => word.length > 0);
        
        // Check if any of the query words are in the searchable text
        return queryWords.some(word => searchableText.includes(word));
      });
    } else {
      // If only filtering by tag, exclude drafts for non-authenticated users
      filteredPosts = filteredPosts.filter(post => 
        post.status === 'published' || user
      );
    }
    
    // Sort posts by publishedAt date (newest first)
    const sortedResults = filteredPosts.sort((a, b) => {
      if (new Date(a.publishedAt || a.date) < new Date(b.publishedAt || b.date)) {
        return 1;
      } else {
        return -1;
      }
    });
    
    // Return only necessary fields
    const results = sortedResults.map(post => ({
      slug: post.slug,
      title: post.title,
      date: post.date,
      author: post.author,
      excerpt: post.excerpt,
      category: post.category,
      status: post.status,
      tags: post.tags,
      image: post.image || '/images/blog-placeholder.jpg',
      publishedAt: post.publishedAt || post.date,
      updatedAt: post.updatedAt,
    }));
    
    return NextResponse.json({
      results,
      count: results.length,
      query,
      tag: tagFilter || null
    });
  } catch (error) {
    console.error('Error searching posts:', error);
    return NextResponse.json(
      { error: 'Failed to search posts' },
      { status: 500 }
    );
  }
} 