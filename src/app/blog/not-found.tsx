import Link from 'next/link';

export default function BlogNotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <div className="space-y-6 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold">Blog Post Not Found</h1>
        <p className="text-foreground/60">
          The blog post you're looking for doesn't exist or may have been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/blog"
            className="inline-block bg-foreground text-background px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            Browse all posts
          </Link>
          <Link
            href="/blog/search"
            className="inline-block border border-foreground text-foreground px-4 py-2 rounded-lg hover:bg-foreground/10 transition-colors"
          >
            Search for posts
          </Link>
        </div>
      </div>
    </div>
  );
} 