import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';

// Tell Next.js this route should be dynamic
export const dynamic = 'force-dynamic';

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

// Search posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const tagFilter = searchParams.get('tag') || '';
    
    if (!query && !tagFilter) {
      return NextResponse.json({
        results: [],
        count: 0,
        query: '',
        tag: null
      });
    }
    
    // Build the database query
    const dbQuery: any = {
      where: {
        status: 'published',
      },
      orderBy: {
        publishedAt: 'desc'
      }
    };
    
    // Add tag filter if provided
    if (tagFilter) {
      dbQuery.where.tags = {
        has: tagFilter
      };
    }
    
    // Add search query if provided
    if (query) {
      const searchTerms = query.toLowerCase().split(' ').filter(Boolean);
      
      if (searchTerms.length > 0) {
        // Create OR conditions for each search term
        dbQuery.where.OR = searchTerms.flatMap(term => [
          { title: { contains: term, mode: 'insensitive' } },
          { content: { contains: term, mode: 'insensitive' } },
          { excerpt: { contains: term, mode: 'insensitive' } },
          { category: { contains: term, mode: 'insensitive' } },
          { author: { contains: term, mode: 'insensitive' } }
        ]);
      }
    }
    
    // Execute the query
    const posts = await prisma.blogPost.findMany(dbQuery);
    
    // Format the results
    const results = posts.map(post => ({
      slug: post.slug,
      title: post.title,
      date: post.date.toISOString(),
      author: post.author,
      excerpt: post.excerpt || '',
      category: post.category,
      status: post.status,
      tags: post.tags,
      image: post.image || '/images/blog-placeholder.jpg',
      publishedAt: post.publishedAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      formattedDate: format(post.date, 'MMMM dd, yyyy')
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