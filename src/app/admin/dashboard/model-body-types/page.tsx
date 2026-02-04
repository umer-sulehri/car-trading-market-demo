"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, AlertCircle, X, CheckCircle, Save } from "lucide-react";
import { getModels, getBodyTypes, attachBodyTypesToModel } from "@/src/services/admin.lookup.service";

interface CarModel {
  id: number;
  name: string;
  make_id: number;
  make?: { id: number; name: string };
  bodyTypes?: BodyType[];
}

interface BodyType {
  id: number;
  name: string;
  description?: string;
}

export default function AdminModelBodyTypesPage() {
  const [models, setModels] = useState<CarModel[]>([]);
  const [bodyTypes, setBodyTypes] = useState<BodyType[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<CarModel | null>(null);
  const [selectedBodyTypeIds, setSelectedBodyTypeIds] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false);

  // Fetch models with their body types
  const fetchModels = async () => {
    try {
      setLoading(true);
      setError("");
      const modelsData = await getModels();
      setModels(modelsData as CarModel[]);
    } catch (error) {
      console.error("Failed to fetch models", error);
      setError("Failed to load models. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all body types
  const fetchBodyTypes = async () => {
    try {
      const bodyTypesData = await getBodyTypes();
      setBodyTypes(Array.isArray(bodyTypesData) ? bodyTypesData as BodyType[] : (bodyTypesData as any).data || []);
    } catch (error) {
      console.error("Failed to fetch body types", error);
    }
  };

  useEffect(() => {
    fetchModels();
    fetchBodyTypes();
  }, []);

  const handleEditModel = async (model: CarModel) => {
    setSelectedModel(model);
    // Use existing body type associations from model data
    if (model.bodyTypes && model.bodyTypes.length > 0) {
      setSelectedBodyTypeIds(model.bodyTypes.map((bt: BodyType) => bt.id));
    } else {
      setSelectedBodyTypeIds([]);
    }
    setShowModal(true);
  };

  const handleSaveAssociations = async () => {
    if (!selectedModel) return;

    try {
      setSubmitting(true);
      setError("");
      await attachBodyTypesToModel(selectedModel.id, selectedBodyTypeIds);

      setSuccess(`Body types updated for ${selectedModel.name}!`);
      fetchModels();
      setTimeout(() => {
        setSuccess("");
        setShowModal(false);
        setSelectedModel(null);
        setSelectedBodyTypeIds([]);
      }, 1500);
    } catch (error) {
      console.error("Error:", error);
      setError("Error updating body types. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleBodyType = (bodyTypeId: number) => {
    setSelectedBodyTypeIds((prev) =>
      prev.includes(bodyTypeId)
        ? prev.filter((id) => id !== bodyTypeId)
        : [...prev, bodyTypeId]
    );
  };

  const filteredModels = models.filter((model) =>
    model.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Model Body Type Associations</h1>
          <p className="text-lg text-gray-600">Assign body types to car models</p>
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

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search models..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Models Grid */}
        {loading ? (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
            <p className="text-gray-600 mt-4">Loading models...</p>
          </div>
        ) : filteredModels.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {searchQuery ? "No models match your search" : "No models found"}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModels.map((model) => (
              <div
                key={model.id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition p-6 border border-gray-100"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{model.name}</h3>
                    <p className="text-sm text-gray-500">Make: {model.make?.name || "Unknown"}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-700 mb-2">Body Types:</p>
                  <div className="flex flex-wrap gap-2">
                    {model.bodyTypes && model.bodyTypes.length > 0 ? (
                      model.bodyTypes.map((bt) => (
                        <span
                          key={bt.id}
                          className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium"
                        >
                          {bt.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm">No body types assigned</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleEditModel(model)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  <Edit2 className="w-4 h-4" />
                  Manage Body Types
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedModel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{selectedModel.name}</h2>
                <p className="text-blue-100 text-sm">Manage body types for this model</p>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedModel(null);
                  setSelectedBodyTypeIds([]);
                }}
                className="text-white hover:bg-blue-500 p-2 rounded-lg transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">Select the body types available for {selectedModel.name}:</p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                {bodyTypes.map((bodyType) => (
                  <label
                    key={bodyType.id}
                    className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition hover:bg-gray-50"
                    style={{
                      borderColor: selectedBodyTypeIds.includes(bodyType.id) ? "#3b82f6" : "#e5e7eb",
                      backgroundColor: selectedBodyTypeIds.includes(bodyType.id) ? "#eff6ff" : "",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedBodyTypeIds.includes(bodyType.id)}
                      onChange={() => toggleBodyType(bodyType.id)}
                      className="w-5 h-5 text-blue-600 rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{bodyType.name}</p>
                      {bodyType.description && (
                        <p className="text-sm text-gray-600">{bodyType.description}</p>
                      )}
                    </div>
                  </label>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSaveAssociations}
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  <Save className="w-5 h-5" />
                  {submitting ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedModel(null);
                    setSelectedBodyTypeIds([]);
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
