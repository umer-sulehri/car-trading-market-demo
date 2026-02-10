'use client';

import Link from 'next/link';

export default function ServerError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-lg w-full text-center">
        {/* 500 Graphic */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-red-600 mb-4">500</h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Server Error
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            We're experiencing technical difficulties. Our team has been notified and is working to fix the issue. Please try again later.
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
            href="/contact"
            className="inline-block w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 px-6 rounded-lg transition"
          >
            Contact Support
          </Link>
        </div>

        {/* Help */}
        <div className="mt-12">
          <p className="text-gray-600 text-sm">
            Error Code: 500 Internal Server Error
          </p>
        </div>
      </div>
    </div>
  );
}
