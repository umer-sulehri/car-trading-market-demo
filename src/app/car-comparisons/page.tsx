'use client';

import { useState, useEffect } from 'react';
import { carComparisonService } from '@/src/services/carComparison.service';
import Link from 'next/link';

interface ComparisonVersion {
  id: number;
  name: string;
  make?: string;
  model?: string;
  year?: number;
  engine_type?: string;
  cc?: number;
  transmission?: string;
  body_type?: string;
  features: Record<number, string>;
  specifications: Record<string, any>;
  colors: Record<number, string>;
}

interface Comparison {
  id: number;
  title: string;
  description?: string;
  versions: ComparisonVersion[];
}

export default function CarComparisonsViewPage() {
  const [comparisons, setComparisons] = useState<Comparison[]>([]);
  const [selectedComparison, setSelectedComparison] = useState<Comparison | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComparisons();
  }, []);

  const fetchComparisons = async () => {
    try {
      setLoading(true);
      const response = await carComparisonService.getPublicComparisons();
      // Handle response - could be direct array or wrapped in data
      const data = Array.isArray(response) ? response : response?.data || [];
      setComparisons(data);
      if (data.length > 0) {
        setSelectedComparison(data[0]);
      }
    } catch (err) {
      console.error('Failed to fetch comparisons', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800 mb-2">Loading Comparisons...</div>
        </div>
      </div>
    );
  }

  if (comparisons.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Car Comparisons</h1>
          <p className="text-xl text-gray-600 mb-8">No comparisons available at this time.</p>
          <Link href="/" className="text-blue-600 hover:text-blue-800 font-semibold">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const comparison = selectedComparison;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Car Comparisons</h1>
          <p className="text-lg text-gray-600">Compare vehicle specifications side by side</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar - Comparison List */}
          <div className="bg-white rounded-lg shadow-lg p-4 h-fit sticky top-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Available Comparisons</h2>
            <div className="space-y-2">
              {comparisons.map(comp => (
                <button
                  key={comp.id}
                  onClick={() => setSelectedComparison(comp)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition ${
                    selectedComparison?.id === comp.id
                      ? 'bg-blue-100 border-2 border-blue-500 text-blue-900 font-semibold'
                      : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <p className="font-semibold text-sm">{comp.title}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {comp.versions.length} versions
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content - Comparison Table */}
          {comparison && (
            <div className="md:col-span-3 bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Title */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                <h2 className="text-3xl font-bold mb-2">{comparison.title}</h2>
                {comparison.description && (
                  <p className="text-blue-100">{comparison.description}</p>
                )}
              </div>

              {/* Comparison Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <tbody>
                    {/* Vehicle Header */}
                    <tr className="bg-gray-50 border-b">
                      <td className="w-1/4 px-4 py-4 font-semibold text-gray-700">Vehicle</td>
                      {comparison.versions.map((version, idx) => (
                        <td key={idx} className="flex-1 px-4 py-4 border-l">
                          <div className="text-center">
                            <p className="text-lg font-bold text-blue-600">{version.name}</p>
                            <p className="text-sm text-gray-600">
                              {version.make} {version.model} {version.year}
                            </p>
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Body Type */}
                    <tr className="border-b">
                      <td className="px-4 py-4 font-semibold text-gray-700 bg-gray-50">Body Type</td>
                      {comparison.versions.map((version, idx) => (
                        <td key={idx} className="flex-1 px-4 py-4 border-l">
                          <p className="text-gray-700">{version.body_type || 'N/A'}</p>
                        </td>
                      ))}
                    </tr>

                    {/* Engine Type */}
                    <tr className="border-b">
                      <td className="px-4 py-4 font-semibold text-gray-700 bg-gray-50">Engine Type</td>
                      {comparison.versions.map((version, idx) => (
                        <td key={idx} className="flex-1 px-4 py-4 border-l">
                          <p className="text-gray-700">{version.engine_type || 'N/A'}</p>
                        </td>
                      ))}
                    </tr>

                    {/* Engine Capacity */}
                    <tr className="border-b">
                      <td className="px-4 py-4 font-semibold text-gray-700 bg-gray-50">Engine CC</td>
                      {comparison.versions.map((version, idx) => (
                        <td key={idx} className="flex-1 px-4 py-4 border-l">
                          <p className="text-gray-700">{version.cc ? `${version.cc} cc` : 'N/A'}</p>
                        </td>
                      ))}
                    </tr>

                    {/* Transmission */}
                    <tr className="border-b">
                      <td className="px-4 py-4 font-semibold text-gray-700 bg-gray-50">Transmission</td>
                      {comparison.versions.map((version, idx) => (
                        <td key={idx} className="flex-1 px-4 py-4 border-l">
                          <p className="text-gray-700">{version.transmission || 'N/A'}</p>
                        </td>
                      ))}
                    </tr>

                    {/* Available Colors */}
                    <tr className="border-b">
                      <td className="px-4 py-4 font-semibold text-gray-700 bg-gray-50">Colors</td>
                      {comparison.versions.map((version, idx) => (
                        <td key={idx} className="flex-1 px-4 py-4 border-l">
                          {Object.values(version.colors).length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {Object.values(version.colors).map((color, colorIdx) => (
                                <span key={colorIdx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                                  {color}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500 text-sm">No colors available</p>
                          )}
                        </td>
                      ))}
                    </tr>

                    {/* Features */}
                    <tr className="border-b">
                      <td className="px-4 py-4 font-semibold text-gray-700 bg-gray-50">Features</td>
                      {comparison.versions.map((version, idx) => (
                        <td key={idx} className="flex-1 px-4 py-4 border-l">
                          {Object.values(version.features).length > 0 ? (
                            <ul className="space-y-1">
                              {Object.values(version.features).map((feature, featureIdx) => (
                                <li key={featureIdx} className="text-gray-700 text-sm flex items-start">
                                  <span className="text-green-600 mr-2 mt-1">✓</span>
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-500 text-sm">No specific features</p>
                          )}
                        </td>
                      ))}
                    </tr>

                    {/* Specifications */}
                    {comparison.versions[0]?.specifications &&
                      Object.keys(comparison.versions[0].specifications).map(specType => (
                        <tr key={specType} className="border-b">
                          <td className="px-4 py-4 font-semibold text-gray-700 bg-gray-50">{specType}</td>
                          {comparison.versions.map((version, idx) => (
                            <td key={idx} className="flex-1 px-4 py-4 border-l">
                              {version.specifications[specType] ? (
                                <ul className="space-y-1">
                                  {Array.isArray(version.specifications[specType])
                                    ? version.specifications[specType].map((spec: any, i: number) => (
                                        <li key={i} className="text-gray-700 text-sm">
                                          {spec}
                                        </li>
                                      ))
                                    : <li className="text-gray-700 text-sm">{version.specifications[specType]}</li>}
                                </ul>
                              ) : (
                                <p className="text-gray-500 text-sm">N/A</p>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
