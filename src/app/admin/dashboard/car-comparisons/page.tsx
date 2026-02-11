'use client';

import { useState, useEffect } from 'react';
import { carComparisonService } from '@/src/services/carComparison.service';
import { getVersions } from '@/src/services/admin.lookup.service';
import { Version } from '@/src/types/lookups';
import Link from 'next/link';

interface CarComparison {
  id: number;
  title: string;
  description?: string;
  version_ids: number[];
  is_active: boolean;
  created_by?: string;
  created_at?: string;
}

export default function CarComparisonsPage() {
  const [comparisons, setComparisons] = useState<CarComparison[]>([]);
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<boolean | null>(null);

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    version_ids: [] as number[],
    is_active: true,
  });

  useEffect(() => {
    fetchComparisons();
    fetchVersions();
  }, [searchTerm, filterActive]);

  const fetchComparisons = async () => {
    try {
      setLoading(true);
      const response = await carComparisonService.getAllComparisons({
        search: searchTerm || undefined,
        is_active: filterActive ?? undefined,
      });
      // Handle response - could be direct array or wrapped in data/items
      const data = Array.isArray(response) ? response : response?.data || response?.items || [];
      setComparisons(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch car comparisons');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVersions = async () => {
    try {
      const response = await getVersions();
      setVersions(response);
    } catch (err) {
      console.error('Failed to fetch versions', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.version_ids.length < 2 || formData.version_ids.length > 3) {
      setError('Please select 2 or 3 versions to compare');
      return;
    }

    try {
      if (editingId) {
        await carComparisonService.updateComparison(editingId, formData);
      } else {
        await carComparisonService.createComparison(formData);
      }
      
      resetForm();
      fetchComparisons();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save comparison');
    }
  };

  const handleEdit = (comparison: CarComparison) => {
    setFormData({
      title: comparison.title,
      description: comparison.description || '',
      version_ids: comparison.version_ids,
      is_active: comparison.is_active,
    });
    setEditingId(comparison.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this comparison?')) {
      try {
        await carComparisonService.deleteComparison(id);
        fetchComparisons();
      } catch (err) {
        setError('Failed to delete comparison');
      }
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      await carComparisonService.toggleStatus(id);
      fetchComparisons();
    } catch (err) {
      setError('Failed to update status');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      version_ids: [],
      is_active: true,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const toggleVersionSelection = (versionId: number) => {
    setFormData(prev => ({
      ...prev,
      version_ids: prev.version_ids.includes(versionId)
        ? prev.version_ids.filter(id => id !== versionId)
        : prev.version_ids.length < 3
        ? [...prev.version_ids, versionId]
        : prev.version_ids
    }));
  };

  const getVersionDisplay = (versionId: number) => {
    const version = versions.find(v => v.id === versionId);
    if (!version) return `Version #${versionId}`;
    return `${version.make?.name} ${version.model?.name} ${version.year} - ${version.name}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Car Comparisons</h1>
          <p className="text-gray-600">Manage vehicle comparison sets for your catalog</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
            <button onClick={() => setError(null)} className="float-right font-bold">×</button>
          </div>
        )}

        {/* Controls */}
        <div className="mb-6 flex gap-4 flex-wrap">
          <button
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {showForm ? 'Cancel' : '+ New Comparison'}
          </button>

          <input
            type="text"
            placeholder="Search comparisons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg flex-1 min-w-48"
          />

          <select
            value={filterActive === null ? 'all' : filterActive ? 'active' : 'inactive'}
            onChange={(e) => {
              if (e.target.value === 'all') setFilterActive(null);
              else setFilterActive(e.target.value === 'active');
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Form */}
        {showForm && (
          <div className="mb-8 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? 'Edit Comparison' : 'Create New Comparison'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comparison Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g., Honda Civic vs Toyota Corolla"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Optional description for this comparison..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Version Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Versions to Compare (2-3) *
                </label>
                <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {versions.map(version => (
                      <label key={version.id} className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.version_ids.includes(version.id)}
                          onChange={() => toggleVersionSelection(version.id)}
                          disabled={formData.version_ids.length >= 3 && !formData.version_ids.includes(version.id)}
                          className="mr-2"
                        />
                        <span className="text-sm">
                          {version.make?.name} {version.model?.name} {version.year} - {version.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Selected: {formData.version_ids.length} / 3
                </p>
              </div>

              {/* Selected Versions Display */}
              {formData.version_ids.length > 0 && (
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-900 mb-2">Selected Versions:</p>
                  <ul className="space-y-1">
                    {formData.version_ids.map(versionId => (
                      <li key={versionId} className="text-sm text-blue-800 flex justify-between">
                        <span>{getVersionDisplay(versionId)}</span>
                        <button
                          type="button"
                          onClick={() => toggleVersionSelection(versionId)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Active Status */}
              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Active</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingId ? 'Update' : 'Create'} Comparison
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="text-gray-500">Loading comparisons...</div>
          </div>
        )}

        {/* Comparisons List */}
        {!loading && comparisons.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500">No comparisons found. Create one to get started!</p>
          </div>
        )}

        {!loading && comparisons.length > 0 && (
          <div className="grid gap-4">
            {comparisons.map(comparison => (
              <div key={comparison.id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{comparison.title}</h3>
                    {comparison.description && (
                      <p className="text-sm text-gray-600 mt-1">{comparison.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      comparison.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {comparison.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                {/* Versions Display */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Comparing ({comparison.version_ids.length}) versions:</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {comparison.version_ids.map((versionId, index) => (
                      <div key={versionId} className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-blue-50 text-blue-800 rounded text-sm">
                          {getVersionDisplay(versionId)}
                        </span>
                        {index < comparison.version_ids.length - 1 && (
                          <span className="text-gray-400">vs</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Meta Info */}
                <div className="text-xs text-gray-500 mb-4">
                  {comparison.created_by && (
  <p>Created by: {comparison.created_by.name}</p>
)}

                  {comparison.created_at && (
                    <p>Created: {new Date(comparison.created_at).toLocaleDateString()}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => handleToggleStatus(comparison.id)}
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      comparison.is_active
                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    {comparison.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleEdit(comparison)}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium hover:bg-blue-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(comparison.id)}
                    className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm font-medium hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
