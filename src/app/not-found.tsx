import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <div className="space-y-6 text-center">
        <h1 className="text-3xl font-bold">Page not found</h1>
        <p className="text-foreground/60">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block bg-foreground text-background px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          Return home
        </Link>
      </div>
    </div>
  );
} 