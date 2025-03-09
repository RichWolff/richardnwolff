import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyJwtToken } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Get search query from URL
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    // Check for authentication (optional)
    const token = request.headers.get('authorization')?.split(' ')[1];
    let isAuthenticated = false;
    
    if (token) {
      try {
        const payload = verifyJwtToken(token);
        isAuthenticated = !!payload;
      } catch (error) {
        console.error('Error verifying token:', error);
        // Continue without authentication
      }
    }

    // Search for posts
    const posts = await prisma.blogPost.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            content: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            tags: {
              has: query,
            },
          },
        ],
        // If authenticated, show all posts, otherwise only published
        status: isAuthenticated ? undefined : 'published',
      },
      select: {
        id: true,
        title: true,
        slug: true,
        publishedAt: true,
        category: true,
        tags: true,
      },
      orderBy: {
        publishedAt: 'desc',
      },
      take: 10, // Limit results
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error searching posts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 