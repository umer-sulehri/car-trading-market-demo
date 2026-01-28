"use client";

import { useEffect, useState } from "react";
import {
  getVersions,
  getFeatures,
  getVersionFeatures,
  updateVersionFeatures,
} from "@/src/services/admin.lookup.service";
import { Version, Feature } from "@/src/types/lookups";

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

  const assignedFeatures = features.filter(f => selectedFeatureIds.includes(f.id));

  return (
    <div className="bg-white p-4 rounded">
      <h2 className="text-lg font-semibold mb-4">Assign Features to Versions</h2>

      <div className="mb-4">
        <select
          value={selectedVersionId ?? ""}
          onChange={(e) => setSelectedVersionId(Number(e.target.value))}
          className="border p-2 rounded"
        >
          <option value="">Select Version</option>
          {versions.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name} ({v.make?.name} - {v.model?.name})
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="mb-2 text-gray-500">Loading features...</p>}

      <div className="flex flex-wrap gap-2 mb-4">
        {features.map((f) => (
          <label
            key={f.id}
            className={`border p-2 rounded cursor-pointer ${
              selectedFeatureIds.includes(f.id) ? "bg-blue-600 text-white" : ""
            }`}
          >
            <input
              type="checkbox"
              checked={selectedFeatureIds.includes(f.id)}
              onChange={() => handleToggleFeature(f.id)}
              className="mr-2"
            />
            {f.name}
          </label>
        ))}
      </div>

      <button
        onClick={handleSave}
        className="bg-green-600 text-white px-4 py-2 rounded mb-4"
        disabled={loading}
      >
        Save Features
      </button>

      <div className="mt-4">
        <h3 className="text-md font-semibold mb-2">Currently Assigned Features:</h3>
        {assignedFeatures.length > 0 ? (
          <ul className="list-disc list-inside">
            {assignedFeatures.map((f) => (
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
