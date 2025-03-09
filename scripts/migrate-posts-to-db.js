// Script to migrate blog posts from file system to database
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const postsDirectory = path.join(process.cwd(), 'content/blog');

async function main() {
  console.log('Starting blog post migration...');
  
  // Check if the blog directory exists
  if (!fs.existsSync(postsDirectory)) {
    console.error(`Blog directory not found: ${postsDirectory}`);
    return;
  }
  
  // Get all existing posts from the database
  const existingPosts = await prisma.blogPost.findMany();
  console.log(`Found ${existingPosts.length} existing posts in the database:`);
  existingPosts.forEach(post => {
    console.log(`- ${post.slug}: ${post.title} (${post.status})`);
  });
  
  // Get all MDX files from the blog directory
  const fileNames = fs.readdirSync(postsDirectory);
  const mdxFiles = fileNames.filter(fileName => fileName.endsWith('.mdx'));
  
  console.log(`\nFound ${mdxFiles.length} MDX files in the content/blog directory:`);
  mdxFiles.forEach(file => console.log(`- ${file}`));
  
  // Process each MDX file
  let addedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;
  
  for (const fileName of mdxFiles) {
    try {
      const slug = fileName.replace(/\.mdx$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      
      // Check if post already exists in the database
      const existingPost = existingPosts.find(post => post.slug === slug);
      
      if (existingPost) {
        console.log(`\nSkipping existing post: ${slug}`);
        skippedCount++;
        continue;
      }
      
      // Prepare post data
      const postData = {
        slug,
        title: data.title || 'Untitled',
        date: data.date ? new Date(data.date) : new Date(),
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : new Date(),
        updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
        author: data.author || 'Anonymous',
        excerpt: data.excerpt || '',
        content: content,
        category: data.category || 'Uncategorized',
        status: data.status || 'published',
        image: data.image || null,
        tags: data.tags || []
      };
      
      // Create post in the database
      const newPost = await prisma.blogPost.create({
        data: postData
      });
      
      console.log(`\nAdded new post: ${slug}`);
      addedCount++;
    } catch (error) {
      console.error(`\nError processing file ${fileName}:`, error);
      errorCount++;
    }
  }
  
  console.log('\nMigration summary:');
  console.log(`- Total MDX files: ${mdxFiles.length}`);
  console.log(`- Added to database: ${addedCount}`);
  console.log(`- Skipped (already exist): ${skippedCount}`);
  console.log(`- Errors: ${errorCount}`);
}

main()
  .catch(e => {
    console.error('Migration failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 