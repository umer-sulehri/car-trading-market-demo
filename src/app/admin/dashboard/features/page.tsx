"use client";

import { useEffect, useState } from "react";
import {
  getFeatures,
  createFeature,
  deleteFeature,
} from "@/src/services/admin.lookup.service";

interface Feature {
  id: number;
  name: string;
}

export default function FeaturesPage() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [name, setName] = useState("");

  /* ===================== FETCH FEATURES ===================== */
  const fetchData = async () => {
    const res = await getFeatures();
    setFeatures(res);
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ===================== CREATE FEATURE ===================== */
  const handleCreate = async () => {
  if (!name) return alert("Enter feature name");

  try {
    await createFeature({ name }); // TS is happy
    setName("");
    fetchData();
  } catch (err) {
    console.error(err);
    alert("Failed to create feature");
  }
};


  /* ===================== DELETE FEATURE ===================== */
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this feature?")) return;
    await deleteFeature(id);
    fetchData();
  };

  return (
    <div className="bg-white p-4 rounded">
      <h2 className="text-lg font-semibold mb-4">Manage Features</h2>

      <div className="flex gap-2 mb-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Feature name"
          className="border p-2 rounded"
        />
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Add
        </button>
      </div>

      {features.map((f) => (
        <div key={f.id} className="flex justify-between py-2 border-b">
          {f.name}
          <button
            onClick={() => handleDelete(f.id)}
            className="text-red-500"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
