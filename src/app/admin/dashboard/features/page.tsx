"use client";

import { useEffect, useState } from "react";
import {
  getFeatures,
  createFeature,
  deleteFeature,
  getFeatureTypes,
} from "@/src/services/admin.lookup.service";

interface FeatureType {
  id: number;
  name: string;
}

interface Feature {
  id: number;
  name: string;
  value?: string;
  is_visible: boolean;
  type?: FeatureType;
}

export default function FeaturesPage() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [name, setName] = useState("");
  const [typeId, setTypeId] = useState<number | null>(null);
  const [types, setTypes] = useState<FeatureType[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [value, setValue] = useState("");

  const fetchFeatures = async () => {
    const res = await getFeatures();
    setFeatures(res);
  };

  const fetchTypes = async () => {
    const res = await getFeatureTypes();
    setTypes(res);
  };

  useEffect(() => {
    fetchFeatures();
    fetchTypes();
  }, []);

  const handleCreate = async () => {
    if (!name || !typeId) return alert("Enter feature name and select type");

    await createFeature({
      name,
      car_feature_type_id: typeId,
      is_visible: isVisible,
      value,
    });

    setName("");
    setValue("");
    setIsVisible(true);
    setTypeId(null);
    fetchFeatures();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this feature?")) return;
    await deleteFeature(id);
    fetchFeatures();
  };

  return (
    <div className="space-y-6">
      {/* ================= CREATE FEATURE ================= */}
      <div className="bg-white rounded-lg shadow p-5">
        <h2 className="text-lg font-semibold mb-4">Add Feature</h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Feature name"
            className="border rounded px-3 py-2 w-full"
          />

          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Value (optional)"
            className="border rounded px-3 py-2 w-full"
          />

          <select
            value={typeId ?? ""}
            onChange={(e) => setTypeId(Number(e.target.value))}
            className="border rounded px-3 py-2 w-full"
          >
            <option value="">Select Type</option>
            {types.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isVisible}
              onChange={(e) => setIsVisible(e.target.checked)}
            />
            Visible
          </label>

          <button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2"
          >
            Add Feature
          </button>
        </div>
      </div>

      {/* ================= FEATURE LIST ================= */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b px-5 py-3 font-semibold">
          Features List
        </div>

        {features.length === 0 && (
          <p className="p-5 text-gray-500">No features found.</p>
        )}

        {features.map((f) => (
          <div
            key={f.id}
            className="flex items-center justify-between px-5 py-3 border-b hover:bg-gray-50"
          >
            <div>
              <div className="font-medium">
                {f.name}
                {f.value && (
                  <span className="text-gray-500"> — {f.value}</span>
                )}
              </div>

              <div className="flex gap-2 text-xs mt-1">
                {f.type && (
                  <span className="px-2 py-0.5 bg-gray-100 rounded">
                    {f.type.name}
                  </span>
                )}

                <span
                  className={`px-2 py-0.5 rounded ${
                    f.is_visible
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {f.is_visible ? "Visible" : "Hidden"}
                </span>
              </div>
            </div>

            <button
              onClick={() => handleDelete(f.id)}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
