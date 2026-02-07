"use client";

import { useEffect, useState } from "react";
import {
  getVersions,
  getSpecificationTypes,
  getSpecifications,
  getVersionSpecifications,
  updateVersionSpecifications,
} from "@/src/services/admin.lookup.service";

interface Version {
  id: number;
  name: string;
  make?: { name: string };
  model?: { name: string };
}

interface SpecificationType {
  id: number;
  name: string;
}

interface Specification {
  id: number;
  name: string;
  car_specification_type_id?: number;
  type?: SpecificationType;
  is_visible?: boolean; // new field
}

interface VersionSpecificationValue {
  specification_id: number;
  value: string;
  is_visible?: boolean; // new field
}

export default function VersionSpecificationsPage() {
  const [versions, setVersions] = useState<Version[]>([]);
  const [types, setTypes] = useState<SpecificationType[]>([]);
  const [specifications, setSpecifications] = useState<Specification[]>([]);
  const [selectedVersionId, setSelectedVersionId] = useState<number | null>(null);
  const [specValues, setSpecValues] = useState<VersionSpecificationValue[]>([]);
  const [loading, setLoading] = useState(false);

  /* ===================== FETCH DATA ===================== */
  const fetchData = async () => {
    const [versionsRes, typesRes, specsRes] = await Promise.all([
      getVersions(),
      getSpecificationTypes(),
      getSpecifications(),
    ]);

    setVersions(versionsRes);
    setTypes(typesRes);
    setSpecifications(specsRes);
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ===================== FETCH SPECIFICATIONS FOR VERSION ===================== */
  useEffect(() => {
    if (!selectedVersionId) {
      setSpecValues([]);
      return;
    }

    setLoading(true);
    getVersionSpecifications(selectedVersionId)
      .then((res: VersionSpecificationValue[]) => {
        setSpecValues(res);
      })
      .finally(() => setLoading(false));
  }, [selectedVersionId]);

  /* ===================== HANDLE VALUE CHANGE ===================== */
  const handleValueChange = (specId: number, value: string) => {
    setSpecValues((prev) => {
      const exists = prev.find((v) => v.specification_id === specId);
      if (exists) {
        return prev.map((v) =>
          v.specification_id === specId ? { ...v, value } : v
        );
      } else {
        return [...prev, { specification_id: specId, value, is_visible: true }];
      }
    });
  };

  /* ===================== HANDLE VISIBILITY TOGGLE ===================== */
  const handleVisibilityToggle = (specId: number, visible: boolean) => {
    setSpecValues((prev) => {
      const exists = prev.find((v) => v.specification_id === specId);
      if (exists) {
        return prev.map((v) =>
          v.specification_id === specId ? { ...v, is_visible: visible } : v
        );
      } else {
        return [...prev, { specification_id: specId, value: "", is_visible: visible }];
      }
    });
  };

  /* ===================== SAVE SPECIFICATION VALUES ===================== */
  const handleSave = async () => {
    if (!selectedVersionId) return alert("Select a version");
    setLoading(true);
    try {
      await updateVersionSpecifications(selectedVersionId, specValues);
      alert("Specifications updated");
    } finally {
      setLoading(false);
    }
  };

  /* ===================== FILTER SPECIFICATIONS BY TYPE ===================== */
  const groupedSpecs = types.map((t) => ({
    type: t,
    specs: specifications.filter((s) => s.car_specification_type_id === t.id),
  }));

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Assign Specifications to Versions</h2>

      <div className="mb-4">
        <select
          value={selectedVersionId ?? ""}
          onChange={(e) => setSelectedVersionId(Number(e.target.value))}
          className="border p-2 rounded w-full max-w-sm"
        >
          <option value="">Select Version</option>
          {versions.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name} ({v.make?.name} - {v.model?.name})
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="mb-2 text-gray-500">Loading specifications...</p>}

      {groupedSpecs.map((g) => (
        <div key={g.type.id} className="mb-6">
          <h3 className="font-semibold mb-2 text-gray-700">{g.type.name}</h3>
          <div className="flex flex-col gap-2">
            {g.specs.map((s) => {
              const specValue = specValues.find(v => v.specification_id === s.id)?.value || "";
              const specVisible = specValues.find(v => v.specification_id === s.id)?.is_visible ?? true;

              return (
                <div key={s.id} className="flex items-center gap-3">
                  <span className="w-40">{s.name}:</span>
                  <input
                    type="text"
                    value={specValue}
                    onChange={(e) => handleValueChange(s.id, e.target.value)}
                    className="border p-1 rounded flex-1"
                    placeholder="Enter value"
                  />
                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={specVisible}
                      onChange={(e) => handleVisibilityToggle(s.id, e.target.checked)}
                    />
                    Visible
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <button
        onClick={handleSave}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mt-4"
        disabled={loading}
      >
        Save Specifications
      </button>
    </div>
  );
}
