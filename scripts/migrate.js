const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { PrismaClient } = require('@prisma/client');
const { parseISO } = require('date-fns');

const prisma = new PrismaClient();
const postsDirectory = path.join(process.cwd(), 'content/blog');

async function migratePosts() {
  console.log('Starting migration of blog posts to database...');
  
  try {
    // Check if directory exists
    if (!fs.existsSync(postsDirectory)) {
      console.error(`Blog directory not found: ${postsDirectory}`);
      return;
    }
    
    const fileNames = fs.readdirSync(postsDirectory);
    
    // Filter for MDX files
    const mdxFiles = fileNames.filter(fileName => fileName.endsWith('.mdx'));
    console.log(`Found ${mdxFiles.length} MDX files to migrate`);
    
    for (const fileName of mdxFiles) {
      try {
        const slug = fileName.replace(/\.mdx$/, '');
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const matterResult = matter(fileContents);
        
        // Check if post already exists in database
        const existingPost = await prisma.blogPost.findUnique({
          where: { slug }
        });
        
        if (existingPost) {
          console.log(`Post with slug "${slug}" already exists in database, skipping...`);
          continue;
        }
        
        // Extract data from frontmatter
        const {
          title,
          date,
          author,
          excerpt,
          category,
          status,
          image,
          tags,
          publishedAt,
          updatedAt
        } = matterResult.data;
        
        // Create post in database
        await prisma.blogPost.create({
          data: {
            slug,
            title: title || 'Untitled',
            date: parseISO(date),
            author: author || 'Anonymous',
            excerpt: excerpt || '',
            content: matterResult.content,
            category: category || 'Uncategorized',
            status: status || 'draft',
            image: image || null,
            tags: Array.isArray(tags) ? tags : [],
            publishedAt: publishedAt ? parseISO(publishedAt) : parseISO(date),
            updatedAt: updatedAt ? parseISO(updatedAt) : new Date()
          }
        });
        
        console.log(`Migrated post: ${title} (${slug})`);
      } catch (error) {
        console.error(`Error migrating post ${fileName}:`, error);
      }
    }
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
migratePosts(); 