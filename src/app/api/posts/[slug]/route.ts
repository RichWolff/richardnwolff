import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import jwt from 'jsonwebtoken';

const postsDirectory = path.join(process.cwd(), 'content/blog');
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
    const fullPath = path.join(postsDirectory, `${slug}.mdx`);
    
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);
    
    // Check if post is a draft and user is not authenticated
    if (matterResult.data.status === 'draft' && !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return NextResponse.json({
      slug,
      content: matterResult.content,
      ...matterResult.data
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
    const fullPath = path.join(postsDirectory, `${slug}.mdx`);
    
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    const { title, excerpt, content, category, status, image } = await request.json();
    
    // Validate required fields
    if (!title || !content || !category) {
      return NextResponse.json(
        { error: 'Title, content, and category are required' },
        { status: 400 }
      );
    }
    
    // Read existing file to get the original date
    const existingFile = fs.readFileSync(fullPath, 'utf8');
    const existingData = matter(existingFile).data;
    
    // Create frontmatter
    const frontmatter = {
      title,
      date: existingData.date, // Keep the original date
      author: existingData.author, // Keep the original author
      excerpt: excerpt || '',
      category,
      status: status || 'draft',
      image: image || existingData.image || '',
    };
    
    // Create MDX content
    const mdxContent = matter.stringify(content, frontmatter);
    
    // Write to file
    fs.writeFileSync(fullPath, mdxContent);
    
    return NextResponse.json({
      success: true,
      slug,
      ...frontmatter
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
    const fullPath = path.join(postsDirectory, `${slug}.mdx`);
    
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    // Delete file
    fs.unlinkSync(fullPath);
    
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