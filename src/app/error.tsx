'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <div className="space-y-6 text-center">
        <h1 className="text-3xl font-bold">Something went wrong</h1>
        <p className="text-foreground/60">
          An error occurred while loading this page.
        </p>
        <button
          onClick={reset}
          className="bg-foreground text-background px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          Try again
        </button>
      </div>
    </div>
  );
} 