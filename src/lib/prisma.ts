const { PrismaClient } = require('@prisma/client');

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

// Add prisma to the NodeJS global type
interface CustomNodeJsGlobal extends NodeJS.Global {
  prisma: any;
}

// Prevent multiple instances of Prisma Client in development
const globalWithPrisma = global as unknown as CustomNodeJsGlobal;

const prisma =
  globalWithPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalWithPrisma.prisma = prisma;

module.exports = { prisma }; 