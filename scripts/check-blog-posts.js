// Script to check blog posts in the database
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
  } catch (error) {
    console.error('Error fetching blog posts:', error);
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