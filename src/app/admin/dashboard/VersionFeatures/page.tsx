"use client";

import { useEffect, useState } from "react";
import {
  getVersions,
  getFeatures,
  getVersionFeatures,
  updateVersionFeatures,
} from "@/src/services/admin.lookup.service";
import { Version, Feature, FeatureType } from "@/src/types/lookups";

export default function VersionFeaturesPage() {
  const [versions, setVersions] = useState<Version[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [selectedVersionId, setSelectedVersionId] = useState<number | null>(null);
  const [selectedFeatureIds, setSelectedFeatureIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const versionsRes = await getVersions();
    const featuresRes = await getFeatures();
    setVersions(versionsRes);
    setFeatures(featuresRes);
  };

  // Fetch features of selected version
  useEffect(() => {
    if (selectedVersionId) {
      setLoading(true);
      getVersionFeatures(selectedVersionId)
        .then((res) => {
          setSelectedFeatureIds(res.map(f => f.id));
        })
        .finally(() => setLoading(false));
    } else {
      setSelectedFeatureIds([]);
    }
  }, [selectedVersionId]);

  const handleToggleFeature = (featureId: number) => {
    setSelectedFeatureIds((prev) =>
      prev.includes(featureId)
        ? prev.filter((id) => id !== featureId)
        : [...prev, featureId]
    );
  };

  const handleSave = async () => {
    if (!selectedVersionId) return alert("Select a version");
    setLoading(true);
    try {
      await updateVersionFeatures(selectedVersionId, selectedFeatureIds);
      alert("Features updated");
    } finally {
      setLoading(false);
    }
  };

  // Group features by type
  const groupedFeatures: { type: FeatureType | null; features: Feature[] }[] = [];
  const typesMap: { [key: string]: Feature[] } = {};

  features.forEach((f) => {
    const typeName = f.type?.name || "Uncategorized";
    if (!typesMap[typeName]) typesMap[typeName] = [];
    typesMap[typeName].push(f);
  });

  for (const key in typesMap) {
    groupedFeatures.push({
      type: features.find(f => f.type?.name === key)?.type || { id: 0, name: key },
      features: typesMap[key],
    });
  }

  return (
    <div className="bg-white p-6 rounded shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Assign Features to Versions</h2>

      {/* Version selector */}
      <div className="mb-6">
        <select
          value={selectedVersionId ?? ""}
          onChange={(e) => setSelectedVersionId(Number(e.target.value))}
          className="border p-2 rounded w-full md:w-1/2"
        >
          <option value="">Select Version</option>
          {versions.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name} ({v.make?.name} - {v.model?.name})
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="mb-4 text-gray-500">Loading features...</p>}

      {/* Features grouped by type */}
      {groupedFeatures.map((group) => (
        <div key={group.type?.id || group.type?.name} className="mb-6">
          <h3 className="text-lg font-semibold mb-2 border-b pb-1">{group.type?.name}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {group.features.map((f) => (
              <label
                key={f.id}
                className={`flex items-center gap-2 p-2 border rounded cursor-pointer transition-colors ${
                  selectedFeatureIds.includes(f.id) ? "bg-blue-600 text-white border-blue-600" : "hover:bg-gray-100"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedFeatureIds.includes(f.id)}
                  onChange={() => handleToggleFeature(f.id)}
                  className="w-4 h-4"
                />
                <span>{f.name}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      {/* Save button */}
      <button
        onClick={handleSave}
        className="bg-green-600 text-white px-6 py-2 rounded mt-4 hover:bg-green-700 transition-colors disabled:opacity-50"
        disabled={loading}
      >
        Save Features
      </button>

      {/* Assigned features */}
      <div className="mt-6">
        <h3 className="text-md font-semibold mb-2">Currently Assigned Features:</h3>
        {selectedFeatureIds.length > 0 ? (
          <ul className="list-disc list-inside">
            {features
              .filter(f => selectedFeatureIds.includes(f.id))
              .map((f) => (
                <li key={f.id}>{f.name}</li>
              ))}
          </ul>
        ) : (
          <p className="text-gray-500">No features assigned yet.</p>
        )}
      </div>
    </div>
  );
}
