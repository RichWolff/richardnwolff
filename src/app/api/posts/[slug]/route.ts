import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper function to verify JWT token
function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No Authorization header or invalid format');
    return null;
  }

  const token = authHeader.split(' ')[1];
  try {
    console.log('Attempting to verify token');
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
    console.log('Token verified successfully:', decoded);
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

// GET a single post by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const user = verifyToken(request);
    const { slug } = params;
    
    // Get post from database
    const post = await prisma.blogPost.findUnique({
      where: { slug }
    });
    
    // Check if post exists
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    // Check if post is a draft and user is not authenticated
    if (post.status === 'draft' && !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return NextResponse.json({
      slug: post.slug,
      title: post.title,
      date: post.date.toISOString(),
      publishedAt: post.publishedAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      author: post.author,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      status: post.status,
      image: post.image,
      tags: post.tags
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

// PUT to update a post
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { slug } = params;
    
    // Check if post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug }
    });
    
    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
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
    
    // Update post in database
    const updatedPost = await prisma.blogPost.update({
      where: { slug },
      data: {
        title,
        excerpt: excerpt || '',
        content,
        category,
        status: status || 'draft',
        image: image || null,
        tags: Array.isArray(tags) ? tags : [],
        updatedAt: new Date()
      }
    });
    
    return NextResponse.json({
      success: true,
      slug: updatedPost.slug,
      title: updatedPost.title,
      date: updatedPost.date.toISOString(),
      author: updatedPost.author,
      excerpt: updatedPost.excerpt,
      category: updatedPost.category,
      status: updatedPost.status,
      image: updatedPost.image,
      tags: updatedPost.tags
    });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

// DELETE a post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { slug } = params;
    
    // Check if post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug }
    });
    
    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    // Delete post from database
    await prisma.blogPost.delete({
      where: { slug }
    });
    
    // Attempt to revalidate the blog pages to clear cache
    try {
      // This is a Next.js App Router API route, so we need to use the revalidatePath function
      // from next/cache to revalidate the blog pages
      const { revalidatePath } = await import('next/cache');
      
      // Revalidate the blog index page and the specific post page
      revalidatePath('/blog');
      revalidatePath(`/blog/${slug}`);
      
      console.log(`Revalidated paths: /blog and /blog/${slug}`);
    } catch (revalidateError) {
      console.error('Error revalidating paths:', revalidateError);
      // Continue with the response even if revalidation fails
    }
    
    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
} 