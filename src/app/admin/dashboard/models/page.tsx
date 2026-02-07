"use client";

import { useEffect, useState } from "react";
import {
  getModels,
  createModel,
  deleteModel,
  getMakes,
  getVersionColors,
  getVersionFeatures,
} from "@/src/services/admin.lookup.service";
import {
  getByModel as getModelMedia,
  createNewCarMedia,
  deleteNewCarMedia,
} from "@/src/services/newCarMedia.service";

interface Make {
  id: number;
  name: string;
}

interface CarModel {
  id: number;
  name: string;
  make_id: number;
  make?: Make;
}

interface Media {
  id: number;
  url: string;
}

export default function ModelsPage() {
  const [models, setModels] = useState<CarModel[]>([]);
  const [makes, setMakes] = useState<Make[]>([]);
  const [name, setName] = useState("");
  const [makeId, setMakeId] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Media modal states
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState<number | null>(null);
  const [selectedModelName, setSelectedModelName] = useState<string>("");
  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [uploading, setUploading] = useState(false);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const modelsData = await getModels();
      setModels(modelsData);
      const makesData = await getMakes();
      setMakes(makesData);
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : "Failed to load models data";
      setError(errorMsg);
      console.error("Failed to load models data", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess(null);
    }, 3000);
    return () => clearTimeout(timer);
  }, [success]);

  const handleCreate = async () => {
    if (!name.trim()) {
      setError("Model name is required");
      return;
    }
    if (!makeId) {
      setError("Make is required");
      return;
    }
    
    try {
      setError(null);
      await createModel({ name: name.trim(), make_id: Number(makeId) });
      setSuccess("Model created successfully");
      setName("");
      setMakeId("");
      fetchData();
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : "Failed to create model";
      setError(errorMsg);
      console.error("Failed to create model", e);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this model?")) return;
    try {
      setError(null);
      await deleteModel(id);
      setSuccess("Model deleted successfully");
      fetchData();
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : "Failed to delete model";
      setError(errorMsg);
      console.error("Failed to delete model", e);
    }
  };

  // Media Functions
  const openMediaModal = async (modelId: number, modelName: string) => {
    setSelectedModelId(modelId);
    setSelectedModelName(modelName);
    setMediaModalOpen(true);
    await loadMedia(modelId);
  };

  const loadMedia = async (modelId: number) => {
    try {
      setMediaLoading(true);
      setMediaError(null);
      const media = await getModelMedia(modelId);
      setMediaList(media);
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : "Failed to load media";
      setMediaError(errorMsg);
      console.error("Failed to load media", e);
    } finally {
      setMediaLoading(false);
    }
  };

  const handleUploadMedia = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !selectedModelId) return;
    const file = e.target.files[0];
    
    // Validate file
    if (!file) {
      setMediaError("Please select a file");
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      setMediaError("File size must be less than 2MB");
      e.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("model_id", selectedModelId.toString());
    formData.append("image", file);
    
    try {
      setUploading(true);
      setMediaError(null);
      await createNewCarMedia(formData);
      setSuccess("Image uploaded successfully");
      await loadMedia(selectedModelId);
      e.target.value = "";
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : "Upload failed";
      setMediaError(errorMsg);
      console.error("Upload failed", e);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteMedia = async (id: number) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    if (!selectedModelId) return;
    
    try {
      setMediaError(null);
      await deleteNewCarMedia(id);
      setSuccess("Image deleted successfully");
      await loadMedia(selectedModelId);
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : "Failed to delete image";
      setMediaError(errorMsg);
      console.error("Failed to delete image", e);
    }
  };

  const closeModal = () => {
    setMediaModalOpen(false);
    setSelectedModelId(null);
    setSelectedModelName("");
    setMediaList([]);
    setMediaError(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Manage Models</h1>
          <p className="text-gray-600 mt-2">Create, update, and manage car models with media</p>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex justify-between items-center">
            <span className="text-red-800">{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800 font-semibold"
            >
              ✕
            </button>
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex justify-between items-center">
            <span className="text-green-800">{success}</span>
            <button
              onClick={() => setSuccess(null)}
              className="text-green-600 hover:text-green-800 font-semibold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Add Model Form */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Model</h2>
          <div className="flex gap-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Model name (e.g., Civic, Accord)"
              className="border border-gray-300 p-3 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <select
              value={makeId}
              onChange={(e) => setMakeId(e.target.value ? Number(e.target.value) : "")}
              className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px]"
              disabled={loading}
            >
              <option value="">Select Make</option>
              {makes.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleCreate}
              disabled={loading || !name.trim() || !makeId}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded font-semibold transition"
            >
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
        </div>

        {/* Models Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-gray-100 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Models List</h2>
          </div>
          {loading ? (
            <div className="p-6 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-500 mt-2">Loading models...</p>
            </div>
          ) : models.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No models found. Create your first model above.</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Model Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Make</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {models.map((m) => (
                  <tr key={m.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{m.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{m.make?.name}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => openMediaModal(m.id, m.name)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm font-semibold transition"
                      >
                        📁 Media
                      </button>
                      <button
                        onClick={() => handleDelete(m.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm font-semibold transition"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Media Modal */}
      {mediaModalOpen && selectedModelId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gray-100 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Manage Media</h3>
                <p className="text-sm text-gray-600 mt-1">{selectedModelName}</p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 font-bold text-xl"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Error Alert */}
              {mediaError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex justify-between items-center">
                  <span className="text-red-800 text-sm">{mediaError}</span>
                  <button
                    onClick={() => setMediaError(null)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Upload Section */}
              <div className="mb-6 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition">
                <label className="flex flex-col items-center cursor-pointer">
                  <div className="text-3xl mb-2">📷</div>
                  <span className="text-sm font-semibold text-gray-700">Click to upload images</span>
                  <span className="text-xs text-gray-500 mt-1">JPEG, PNG, GIF, WebP (Max 2MB)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUploadMedia}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
                {uploading && (
                  <div className="mt-3 text-center">
                    <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    <p className="text-sm text-gray-600 mt-2">Uploading...</p>
                  </div>
                )}
              </div>

              {/* Gallery Section */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Image Gallery</h4>
                {mediaLoading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="text-gray-500 mt-2">Loading images...</p>
                  </div>
                ) : mediaList.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No images uploaded yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {mediaList.map((m) => (
                      <div key={m.id} className="relative group">
                        <img
                          src={m.url}
                          alt="model media"
                          className="w-full h-32 object-cover rounded-lg shadow"
                        />
                        <button
                          onClick={() => handleDeleteMedia(m.id)}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg"
                          title="Delete image"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
