import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { format } from 'date-fns';
import jwt from 'jsonwebtoken';

const postsDirectory = path.join(process.cwd(), 'content/blog');
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
    const fileNames = fs.readdirSync(postsDirectory);
    
    const allPosts = fileNames.map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);
      
      // Format the date
      const date = matterResult.data.date;
      const formattedDate = format(new Date(date), 'MMMM dd, yyyy');
      
      // Use 'published' as default status if not specified
      const status = matterResult.data.status || 'published';
      
      return {
        slug,
        title: matterResult.data.title,
        date,
        formattedDate,
        author: matterResult.data.author,
        excerpt: matterResult.data.excerpt,
        category: matterResult.data.category,
        status,
        image: matterResult.data.image || '/images/blog-placeholder.jpg',
      };
    });
    
    // Sort posts by date
    const sortedPosts = allPosts.sort((a, b) => {
      if (a.date < b.date) {
        return 1;
      } else {
        return -1;
      }
    });
    
    // Filter out drafts if user is not authenticated
    const posts = user 
      ? sortedPosts 
      : sortedPosts.filter(post => post.status === 'published');
    
    return NextResponse.json(posts);
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
    
    const { title, excerpt, content, category, status, image } = await request.json();
    
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
    const existingFiles = fs.readdirSync(postsDirectory);
    if (existingFiles.includes(`${slug}.mdx`)) {
      return NextResponse.json(
        { error: 'A post with this title already exists' },
        { status: 400 }
      );
    }
    
    // Create frontmatter
    const frontmatter = {
      title,
      date: new Date().toISOString(),
      author: user.email,
      excerpt: excerpt || '',
      category,
      status: status || 'draft',
      image: image || '',
    };
    
    // Create MDX content
    const mdxContent = matter.stringify(content, frontmatter);
    
    // Write to file
    fs.writeFileSync(path.join(postsDirectory, `${slug}.mdx`), mdxContent);
    
    return NextResponse.json({
      success: true,
      slug,
      ...frontmatter
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
} 