// This is a test script to check the search functionality
// You can run it with: npx ts-node src/app/api/posts/search/test.ts

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testSearch(query: string): Promise<void> {
  console.log(`Searching for: "${query}"`);
  
  try {
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
      take: 10,
    });

    console.log(`Found ${posts.length} results:`);
    posts.forEach((post: any) => {
      console.log(`- ${post.title} (${post.slug})`);
      console.log(`  Tags: ${post.tags.join(', ')}`);
    });
  } catch (error) {
    console.error('Error searching posts:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Test with the query "machine"
testSearch('machine'); 