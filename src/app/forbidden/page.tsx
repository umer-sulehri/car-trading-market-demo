'use client';

import Link from 'next/link';

export default function Forbidden() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-lg w-full text-center">
        {/* 403 Graphic */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-red-600 mb-4">403</h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Access Forbidden
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            You don't have permission to access this resource. If you believe this is a mistake, please contact support.
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
            Error Code: 403 Forbidden
          </p>
        </div>
      </div>
    </div>
  );
}
