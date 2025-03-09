// Script to check blog posts in the database and add a test post if needed
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Checking blog posts in the database...');
  
  try {
    // Get all blog posts
    const posts = await prisma.blogPost.findMany();
    
    console.log(`Found ${posts.length} blog posts in the database:`);
    
    // Display each post
    posts.forEach((post, index) => {
      console.log(`\n--- Post ${index + 1} ---`);
      console.log(`ID: ${post.id}`);
      console.log(`Slug: ${post.slug}`);
      console.log(`Title: ${post.title}`);
      console.log(`Status: ${post.status}`);
      console.log(`Date: ${post.date}`);
      console.log(`Published At: ${post.publishedAt}`);
      console.log(`Updated At: ${post.updatedAt}`);
      console.log(`Tags: ${post.tags.join(', ')}`);
    });
    
    // Add a test post if there are no posts or if requested
    const shouldAddTestPost = process.argv.includes('--add-test-post') || posts.length === 0;
    
    if (shouldAddTestPost) {
      console.log('\nAdding a test blog post...');
      
      const testPost = {
        slug: 'test-post-' + Date.now(),
        title: 'Test Blog Post',
        date: new Date(),
        publishedAt: new Date(),
        updatedAt: new Date(),
        author: 'Richard Wolff',
        excerpt: 'This is a test blog post to verify the database connection.',
        content: `
# Test Blog Post

This is a test blog post to verify that the database connection is working correctly.

## Features

- Confirms database connectivity
- Tests post creation
- Verifies display on the blog page

Thank you for testing!
        `,
        category: 'Test',
        status: 'published',
        image: '/images/blog-placeholder.jpg',
        tags: ['test', 'database']
      };
      
      const newPost = await prisma.blogPost.create({
        data: testPost
      });
      
      console.log('Test post added successfully!');
      console.log(`Slug: ${newPost.slug}`);
      console.log(`Title: ${newPost.title}`);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

main()
  .catch((e) => {
    console.error('Error running script:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 