"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, AlertCircle, X, CheckCircle, Save } from "lucide-react";
import { getBodyTypes, createBodyType, updateBodyType, deleteBodyType } from "@/src/services/admin.lookup.service";

interface BodyType {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at?: string;
}

interface FormState {
  name: string;
  description: string;
}

export default function AdminBodyTypesPage() {
  const [bodyTypes, setBodyTypes] = useState<BodyType[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormState>({ name: "", description: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // Fetch body types
  const fetchBodyTypes = async () => {
    try {
      setLoading(true);
      setError("");
      const bodyTypesData = await getBodyTypes();
      setBodyTypes(Array.isArray(bodyTypesData) ? bodyTypesData : (bodyTypesData as any).data || []);
    } catch (error) {
      console.error("Failed to fetch body types", error);
      setError("Failed to load body types. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBodyTypes();
  }, []);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name.trim()) {
      setError("Please enter a body type name");
      return;
    }

    try {
      setSubmitting(true);
      if (editingId) {
        await updateBodyType(editingId, formData);
      } else {
        await createBodyType(formData);
      }

      setSuccess(editingId ? "Body type updated successfully!" : "Body type created successfully!");
      setFormData({ name: "", description: "" });
      setEditingId(null);
      setShowForm(false);
      setTimeout(() => {
        fetchBodyTypes();
        setSuccess("");
      }, 1500);
    } catch (error) {
      console.error("Error:", error);
      setError("Error saving body type. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle edit
  const handleEdit = (bodyType: BodyType) => {
    setFormData({ name: bodyType.name, description: bodyType.description || "" });
    setEditingId(bodyType.id);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  // Handle delete
  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) return;

    try {
      setSubmitting(true);
      await deleteBodyType(id);

      setSuccess("Body type deleted successfully!");
      setTimeout(() => {
        fetchBodyTypes();
        setSuccess("");
      }, 1500);
    } catch (error) {
      console.error("Error:", error);
      setError("Error deleting body type. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setFormData({ name: "", description: "" });
    setEditingId(null);
    setShowForm(false);
    setError("");
  };

  const filteredBodyTypes = bodyTypes.filter((type) =>
    type.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Car Body Types</h1>
          <p className="text-lg text-gray-600">Manage and organize car body types for your platform</p>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => setError("")}
              className="ml-auto text-red-600 hover:text-red-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-green-700">{success}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar - Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <div className="flex items-center gap-3 mb-6">
                {editingId ? (
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Edit2 className="w-5 h-5 text-blue-600" />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Plus className="w-5 h-5 text-green-600" />
                  </div>
                )}
                <h2 className="text-lg font-bold text-gray-900">
                  {editingId ? "Edit Body Type" : "Add New Body Type"}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Body Type Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., SUV"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe this body type..."
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    <Save className="w-4 h-4" />
                    {submitting ? "Saving..." : editingId ? "Update" : "Create"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Main Content - List */}
          <div className="lg:col-span-3">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search body types by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <button
                onClick={() => {
                  setFormData({ name: "", description: "" });
                  setEditingId(null);
                  setShowForm(true);
                  setError("");
                }}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition font-medium whitespace-nowrap"
              >
                <Plus className="w-5 h-5" />
                Add New
              </button>
            </div>

            {/* Body Types Grid */}
            {loading && !showForm ? (
              <div className="bg-white rounded-xl shadow p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
                <p className="text-gray-600 mt-4">Loading body types...</p>
              </div>
            ) : filteredBodyTypes.length === 0 ? (
              <div className="bg-white rounded-xl shadow p-12 text-center">
                <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  {searchQuery ? "No body types match your search" : "No body types created yet"}
                </p>
                {!searchQuery && (
                  <p className="text-gray-400 mt-2">Create your first body type to get started</p>
                )}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredBodyTypes.map((bodyType) => (
                  <div
                    key={bodyType.id}
                    className="bg-white rounded-xl shadow hover:shadow-lg transition p-6 border border-gray-100"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{bodyType.name}</h3>
                        <p className="text-sm text-gray-500">
                          Created {new Date(bodyType.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <div className="w-6 h-6 rounded-full border-2 border-blue-600"></div>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-6 text-sm min-h-[3rem]">
                      {bodyType.description || "No description provided"}
                    </p>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(bodyType)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition font-medium"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(bodyType.id, bodyType.name)}
                        disabled={submitting}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Stats */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow p-6 text-center">
                <p className="text-gray-500 text-sm font-medium">Total Body Types</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{bodyTypes.length}</p>
              </div>
              <div className="bg-white rounded-xl shadow p-6 text-center">
                <p className="text-gray-500 text-sm font-medium">Search Results</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{filteredBodyTypes.length}</p>
              </div>
              <div className="bg-white rounded-xl shadow p-6 text-center">
                <p className="text-gray-500 text-sm font-medium">Status</p>
                <p className="text-lg font-bold text-gray-900 mt-2">Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
