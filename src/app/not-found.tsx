'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-lg w-full text-center">
        {/* 404 Graphic */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-blue-600 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
          >
            Go Home
          </Link>
          
          <Link
            href="/all-cars"
            className="inline-block w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 px-6 rounded-lg transition"
          >
            Browse Cars
          </Link>
        </div>

        {/* Help */}
        <div className="mt-12">
          <p className="text-gray-600">
            Need help?{' '}
            <Link href="/contact" className="text-blue-600 hover:underline font-semibold">
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
