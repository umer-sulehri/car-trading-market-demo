"use client";

import { useEffect, useState } from "react";
import {
  getVersions,
  getColors,
  getVersionColors,
  updateVersionColors,
} from "@/src/services/admin.lookup.service";
import { Version } from "@/src/types/lookups";

interface Color {
  id: number;
  name: string;
  hex_code: string;
}

export default function VersionColorsPage() {
  const [versions, setVersions] = useState<Version[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [selectedVersionId, setSelectedVersionId] = useState<number | null>(null);
  const [selectedColorIds, setSelectedColorIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const versionsRes = await getVersions();
    const colorsRes = await getColors();
    setVersions(versionsRes);
    setColors(colorsRes);
  };

  // Fetch colors of selected version
  useEffect(() => {
    if (selectedVersionId) {
      setLoading(true);
      getVersionColors(selectedVersionId)
        .then((res) => {
          setSelectedColorIds(res.map((c) => c.id));
        })
        .catch((error) => {
          console.error("Error fetching version colors:", error);
          setSelectedColorIds([]);
        })
        .finally(() => setLoading(false));
    } else {
      setSelectedColorIds([]);
    }
  }, [selectedVersionId]);

  const handleToggleColor = (colorId: number) => {
    setSelectedColorIds((prev) =>
      prev.includes(colorId)
        ? prev.filter((id) => id !== colorId)
        : [...prev, colorId]
    );
  };

  const handleSave = async () => {
    if (!selectedVersionId) return alert("Select a version");
    setLoading(true);
    try {
      await updateVersionColors(selectedVersionId, selectedColorIds);
      setSuccessMessage("Colors updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error updating colors:", error);
      alert("Failed to update colors");
    } finally {
      setLoading(false);
    }
  };

  const assignedColors = colors.filter((c) =>
    selectedColorIds.includes(c.id)
  );

  const selectedVersion = versions.find((v) => v.id === selectedVersionId);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Assign Colors to Versions
          </h1>
          <p className="text-gray-600">
            Select a car version and assign available colors to it
          </p>
        </div>

        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {successMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Version Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">
                Select Version
              </h2>

              <select
                value={selectedVersionId ?? ""}
                onChange={(e) =>
                  setSelectedVersionId(
                    e.target.value ? Number(e.target.value) : null
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choose a version...</option>
                {versions.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.make?.name} - {v.model?.name})
                  </option>
                ))}
              </select>

              {selectedVersion && (
                <div className="mt-4 p-4 bg-blue-50 rounded border border-blue-200">
                  <h3 className="font-semibold text-sm text-gray-900 mb-2">
                    Selected Version Details
                  </h3>
                  <div className="space-y-1 text-sm text-gray-700">
                    <p>
                      <span className="font-medium">Name:</span> {selectedVersion.name}
                    </p>
                    <p>
                      <span className="font-medium">Make:</span>{" "}
                      {selectedVersion.make?.name}
                    </p>
                    <p>
                      <span className="font-medium">Model:</span>{" "}
                      {selectedVersion.model?.name}
                    </p>
                    <p>
                      <span className="font-medium">Year:</span> {selectedVersion.year}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Color Selection */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">
                Available Colors
              </h2>

              {loading && selectedVersionId && (
                <p className="mb-4 text-gray-500 text-sm">Loading colors...</p>
              )}

              {colors.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
                  {colors.map((color) => (
                    <label
                      key={color.id}
                      className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedColorIds.includes(color.id)
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedColorIds.includes(color.id)}
                        onChange={() => handleToggleColor(color.id)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex items-center gap-2">
                          {color.hex_code && (
                            <div
                              className="w-5 h-5 rounded border border-gray-300"
                              style={{ backgroundColor: color.hex_code }}
                              title={color.hex_code}
                            />
                          )}
                          <span className="text-sm font-medium text-gray-900">
                            {color.name}
                          </span>
                        </div>
                        {color.hex_code && (
                          <span className="text-xs text-gray-500">
                            {color.hex_code}
                          </span>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No colors available
                </p>
              )}

              <button
                onClick={handleSave}
                disabled={loading || !selectedVersionId}
                className={`w-full py-2 px-4 rounded-lg font-semibold transition-all ${
                  loading || !selectedVersionId
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
                }`}
              >
                {loading ? "Saving..." : "Save Colors"}
              </button>
            </div>

            {/* Currently Assigned Colors */}
            {selectedVersionId && (
              <div className="mt-6 bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">
                  Currently Assigned Colors
                </h3>

                {assignedColors.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {assignedColors.map((color) => (
                      <div
                        key={color.id}
                        className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-green-200"
                      >
                        {color.hex_code && (
                          <div
                            className="w-6 h-6 rounded border border-gray-300"
                            style={{ backgroundColor: color.hex_code }}
                            title={color.hex_code}
                          />
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {color.name}
                          </p>
                          {color.hex_code && (
                            <p className="text-xs text-gray-500">
                              {color.hex_code}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No colors assigned yet.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
