"use client";

import { useEffect, useState } from "react";
import {
  getSpecifications,
  createSpecification,
  deleteSpecification,
  getSpecificationTypes,
} from "@/src/services/admin.lookup.service";

interface SpecificationType {
  id: number;
  name: string;
}

interface Specification {
  id: number;
  name: string;
  type?: SpecificationType;
}

export default function SpecificationsPage() {
  const [specifications, setSpecifications] = useState<Specification[]>([]);
  const [name, setName] = useState("");
  const [typeId, setTypeId] = useState<number | null>(null);
  const [types, setTypes] = useState<SpecificationType[]>([]);

  /* ===================== FETCH SPECIFICATIONS ===================== */
  const fetchSpecifications = async () => {
    const res = await getSpecifications();
    setSpecifications(res);
  };

  /* ===================== FETCH SPECIFICATION TYPES ===================== */
  const fetchTypes = async () => {
    const res = await getSpecificationTypes();
    setTypes(res);
  };

  useEffect(() => {
    fetchSpecifications();
    fetchTypes();
  }, []);

  /* ===================== CREATE SPECIFICATION ===================== */
  const handleCreate = async () => {
    if (!name || !typeId) return alert("Enter specification name and select type");

    try {
      await createSpecification({ name, car_specification_type_id: typeId });
      setName("");
      setTypeId(null);
      fetchSpecifications();
    } catch (err) {
      console.error(err);
      alert("Failed to create specification");
    }
  };

  /* ===================== DELETE SPECIFICATION ===================== */
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this specification?")) return;
    await deleteSpecification(id);
    fetchSpecifications();
  };

  return (
    <div className="bg-white p-4 rounded">
      <h2 className="text-lg font-semibold mb-4">Manage Specifications</h2>

      <div className="flex gap-2 mb-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Specification name"
          className="border p-2 rounded"
        />
        <select
          value={typeId ?? ""}
          onChange={(e) => setTypeId(Number(e.target.value))}
          className="border p-2 rounded"
        >
          <option value="">Select Type</option>
          {types.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
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

      {specifications.length === 0 ? (
        <p className="text-gray-500">No specifications found.</p>
      ) : (
        specifications.map((s) => (
          <div key={s.id} className="flex justify-between py-2 border-b">
            <span>{s.name} ({s.type?.name ?? "No Type"})</span>
            <button
              onClick={() => handleDelete(s.id)}
              className="text-red-500"
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}
