'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error for monitoring purposes
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-lg w-full text-center">
        {/* Error Graphic */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-red-600 mb-4">⚠️</h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Something Went Wrong
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            We're sorry for the inconvenience. An unexpected error occurred. Please try again or contact support if the problem persists.
          </p>
          
          {/* Error Details (Development Only) */}
          {process.env.NODE_ENV === 'development' && error.message && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 rounded text-left">
              <p className="text-sm font-mono text-red-800 break-words">
                {error.message}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={reset}
            className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
          >
            Try Again
          </button>
          
          <Link
            href="/"
            className="inline-block w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 px-6 rounded-lg transition"
          >
            Go Home
          </Link>

          <Link
            href="/contact"
            className="inline-block w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 px-6 rounded-lg transition"
          >
            Contact Support
          </Link>
        </div>

        {/* Help Text */}
        <div className="mt-12">
          <p className="text-gray-600 text-sm">
            {error.digest && `Error ID: ${error.digest}`}
          </p>
        </div>
      </div>
    </div>
  );
}
