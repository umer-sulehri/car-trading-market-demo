"use client";

import { useState } from 'react';

export default function BackendTestPage() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const testBackendConnection = async () => {
    setLoading(true);
    setResult("Testing connection to backend...");
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      console.log(`Testing: ${apiUrl}/feature-plans`);
      
      const response = await fetch(`${apiUrl}/feature-plans`, {
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        setResult(`❌ Connection failed! Status: ${response.status} ${response.statusText}`);
        return;
      }
      
      const data = await response.json();
      setResult(`✅ Connected! Response: ${JSON.stringify(data, null, 2)}`);
    } catch (error: any) {
      setResult(`❌ Error: ${error.message}\n\nMake sure:\n1. Laravel is running on http://127.0.0.1:8000\n2. Database migrations are done\n3. CORS is enabled\n\nRun: php artisan serve`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Backend Connection Test</h1>
        
        <div className="space-y-4">
          <div className="bg-gray-100 p-4 rounded">
            <p className="text-sm text-gray-600 mb-2">API URL:</p>
            <p className="font-mono text-sm">{process.env.NEXT_PUBLIC_API_BASE_URL}/feature-plans</p>
          </div>

          <button
            onClick={testBackendConnection}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
          >
            {loading ? "Testing..." : "Test Connection"}
          </button>

          {result && (
            <div className="bg-gray-50 p-4 rounded border border-gray-200">
              <pre className="whitespace-pre-wrap text-sm font-mono">{result}</pre>
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t">
          <h2 className="font-bold mb-3">🚀 Quick Setup</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Terminal 1 (Laravel):</strong></p>
            <code className="block bg-gray-800 text-white p-2 rounded mb-3">
              cd laravel-backend<br/>
              php artisan serve
            </code>
            
            <p><strong>Terminal 2 (Next.js):</strong></p>
            <code className="block bg-gray-800 text-white p-2 rounded">
              cd next-frontend<br/>
              npm run dev
            </code>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t text-sm text-gray-600">
          <h3 className="font-bold mb-2">Troubleshooting</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Check Laravel is running on port 8000</li>
            <li>Run migrations: <code className="bg-gray-100 px-2 py-1 rounded">php artisan migrate</code></li>
            <li>Check .env file has correct DB credentials</li>
            <li>Verify CORS enabled in Laravel config</li>
            <li>Clear Next.js cache: <code className="bg-gray-100 px-2 py-1 rounded">rm -rf .next</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
