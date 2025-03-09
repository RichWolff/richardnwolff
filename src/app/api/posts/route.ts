import { NextRequest, NextResponse } from 'next/server';
import { format } from 'date-fns';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

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

// GET all posts (with authentication check for drafts)
export async function GET(request: NextRequest) {
  try {
    const user = verifyToken(request);
    
    // Get all posts from database
    const allPosts = await prisma.blogPost.findMany({
      orderBy: {
        date: 'desc'
      },
      // If user is not authenticated, only get published posts
      where: user ? undefined : {
        status: 'published'
      }
    });
    
    // Format the posts for the response
    const formattedPosts = allPosts.map(post => ({
      slug: post.slug,
      title: post.title,
      date: post.date.toISOString(),
      formattedDate: format(post.date, 'MMMM dd, yyyy'),
      author: post.author,
      excerpt: post.excerpt || '',
      category: post.category,
      status: post.status,
      image: post.image || '/images/blog-placeholder.jpg',
    }));
    
    return NextResponse.json(formattedPosts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST a new blog post (requires authentication)
export async function POST(request: NextRequest) {
  try {
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { title, excerpt, content, category, status, image, tags } = await request.json();
    
    // Validate required fields
    if (!title || !content || !category) {
      return NextResponse.json(
        { error: 'Title, content, and category are required' },
        { status: 400 }
      );
    }
    
    // Create slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
    
    // Check if slug already exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug }
    });
    
    if (existingPost) {
      return NextResponse.json(
        { error: 'A post with this title already exists' },
        { status: 400 }
      );
    }
    
    // Create post in database
    const now = new Date();
    const newPost = await prisma.blogPost.create({
      data: {
        slug,
        title,
        date: now,
        publishedAt: now,
        author: user.email,
        excerpt: excerpt || '',
        content,
        category,
        status: status || 'draft',
        image: image || null,
        tags: Array.isArray(tags) ? tags : [],
      }
    });
    
    return NextResponse.json({
      success: true,
      slug: newPost.slug,
      title: newPost.title,
      date: newPost.date.toISOString(),
      author: newPost.author,
      excerpt: newPost.excerpt,
      category: newPost.category,
      status: newPost.status,
      image: newPost.image
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
} 