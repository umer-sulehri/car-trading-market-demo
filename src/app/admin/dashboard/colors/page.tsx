"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, AlertCircle, X, CheckCircle, Save } from "lucide-react";
import { getColors, createColor, updateColor, deleteColor } from "@/src/services/admin.lookup.service";

interface Color {
  id: number;
  name: string;
  hex_code: string;
  created_at: string;
  updated_at?: string;
}

interface FormState {
  name: string;
  hex_code: string;
}

export default function AdminColorsPage() {
  const [colors, setColors] = useState<Color[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormState>({ name: "", hex_code: "#000000" });
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // Fetch colors
  const fetchColors = async () => {
    try {
      setLoading(true);
      setError("");
      const colorsData = await getColors();
      setColors(colorsData as Color[]);
    } catch (error) {
      console.error("Failed to fetch colors", error);
      setError("Failed to load colors. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Color name is required");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      if (editingId) {
        await updateColor(editingId, formData);
      } else {
        await createColor(formData);
      }

      setSuccess(editingId ? "Color updated successfully!" : "Color created successfully!");
      setFormData({ name: "", hex_code: "#000000" });
      setEditingId(null);
      setShowForm(false);
      fetchColors();
      setTimeout(() => setSuccess(""), 2000);
    } catch (error) {
      console.error("Error:", error);
      setError("Error saving color. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (color: Color) => {
    setFormData({ name: color.name, hex_code: color.hex_code });
    setEditingId(color.id);
    setShowForm(true);
    setError("");
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      setSubmitting(true);
      setError("");
      await deleteColor(id);

      setSuccess(`"${name}" deleted successfully!`);
      fetchColors();
      setTimeout(() => setSuccess(""), 2000);
    } catch (error) {
      console.error("Error:", error);
      setError("Error deleting color. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({ name: "", hex_code: "#000000" });
    setEditingId(null);
    setShowForm(false);
    setError("");
  };

  const filteredColors = colors.filter((color) =>
    color.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Car Colors</h1>
          <p className="text-lg text-gray-600">Manage and organize car colors</p>
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
              <h2 className="text-lg font-bold text-gray-900 mb-6">
                {editingId ? "Edit Color" : "Add New Color"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Red, Black, Silver"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hex Code *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.hex_code}
                      onChange={(e) => setFormData({ ...formData, hex_code: e.target.value })}
                      className="w-16 h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.hex_code}
                      onChange={(e) => setFormData({ ...formData, hex_code: e.target.value })}
                      placeholder="#000000"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium"
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
              <input
                type="text"
                placeholder="Search colors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => {
                  setFormData({ name: "", hex_code: "#000000" });
                  setEditingId(null);
                  setShowForm(true);
                }}
                className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-medium"
              >
                <Plus className="w-5 h-5" />
                Add Color
              </button>
            </div>

            {/* Colors Grid */}
            {loading ? (
              <div className="bg-white rounded-xl shadow p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
                <p className="text-gray-600 mt-4">Loading colors...</p>
              </div>
            ) : filteredColors.length === 0 ? (
              <div className="bg-white rounded-xl shadow p-12 text-center">
                <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  {searchQuery ? "No colors match your search" : "No colors found"}
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredColors.map((color) => (
                  <div key={color.id} className="bg-white rounded-xl shadow hover:shadow-lg transition p-6 border border-gray-100">
                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className="w-20 h-20 rounded-lg shadow-md border-2 border-gray-200"
                        style={{ backgroundColor: color.hex_code }}
                      />
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900">{color.name}</h3>
                        <p className="text-sm text-gray-500 font-mono">{color.hex_code}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(color.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(color)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition font-medium"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(color.id, color.name)}
                        disabled={submitting}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-medium disabled:opacity-50"
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
                <p className="text-gray-500 text-sm font-medium">Total Colors</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{colors.length}</p>
              </div>
              <div className="bg-white rounded-xl shadow p-6 text-center">
                <p className="text-gray-500 text-sm font-medium">Search Results</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{filteredColors.length}</p>
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
