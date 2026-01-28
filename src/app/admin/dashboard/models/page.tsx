"use client";

import { useEffect, useState } from "react";
import {
  getModels,
  createModel,
  deleteModel,
  getMakes,
} from "@/src/services/admin.lookup.service";

interface Make {
  id: number;
  name: string;
}

interface CarModel {
  id: number;
  name: string;
  make_id: number;
  make: Make;
}

export default function ModelsPage() {
  const [models, setModels] = useState<CarModel[]>([]);
  const [makes, setMakes] = useState<Make[]>([]);
  const [name, setName] = useState("");
  const [makeId, setMakeId] = useState<number | "">("");
  const [loading, setLoading] = useState(false);


const fetchData = async () => {
  try {
    setLoading(true);

    const modelsData = await getModels();
    setModels(modelsData);

    const makesData = await getMakes();
    setMakes(makesData);

  } catch (e) {
    console.error("Failed to load models data", e);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async () => {
    if (!name || !makeId) return;

    await createModel({
      name,
      make_id: Number(makeId),
    });

    setName("");
    setMakeId("");
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this model?")) return;
    await deleteModel(id);
    fetchData();
  };

  return (
    <div className="bg-white p-4 rounded">
      <h2 className="text-lg font-semibold mb-4">Manage Models</h2>

      <div className="flex gap-2 mb-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Model name"
          className="border p-2 rounded"
        />

        <select
          value={makeId}
          onChange={(e) => setMakeId(Number(e.target.value))}
          className="border p-2 rounded"
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
          className="bg-blue-600 text-white px-4 rounded"
        >
          Add
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Model</th>
              <th className="p-2">Make</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {models.map((m) => (
              <tr key={m.id} className="border-t">
                <td className="p-2">{m.name}</td>
                <td className="p-2">{m.make?.name}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
