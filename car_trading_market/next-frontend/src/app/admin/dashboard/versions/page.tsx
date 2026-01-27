"use client";

import { useEffect, useState } from "react";
import { GET } from "@/src/lib/api/get.service";
import { POST } from "@/src/lib/api/post.service";
import { API } from "@/src/lib/api/endpoints";
import { Make, CarModel, Version } from "@/src/types/lookups";
import { getMakes, getModels, getVersions, getEngineTypes, getTransmissions } 
  from "@/src/services/admin.lookup.service";


export default function VersionsPage() {
  const [versions, setVersions] = useState<Version[]>([]);
  const [makes, setMakes] = useState<Make[]>([]);
  const [models, setModels] = useState<CarModel[]>([]);
  const [engineTypes, setEngineTypes] = useState<{ id: number; name: string }[]>([]);
  const [transmissions, setTransmissions] = useState<{ id: number; name: string }[]>([]);

  const [name, setName] = useState("");
  const [makeId, setMakeId] = useState<number | null>(null);
  const [modelId, setModelId] = useState<number | null>(null);
  const [engineTypeId, setEngineTypeId] = useState<number | null>(null);
  const [transmissionId, setTransmissionId] = useState<number | null>(null);
  const [year, setYear] = useState<number | null>(null);
  const [cc, setCc] = useState<number | null>(null);

  /* ===================== FETCH DATA ===================== */
const fetchData = async () => {
  const [versionsRes, makesRes, modelsRes,engineTypesRes, transmissionsRes] = await Promise.all([

    getVersions(),
    getMakes(),
    getModels(),
    getEngineTypes(),
      getTransmissions(),
  ]);
console.log({ versionsRes, makesRes, modelsRes });
  setVersions(Array.isArray(versionsRes) ? versionsRes : []);
  setMakes(Array.isArray(makesRes) ? makesRes : []);
  setModels(Array.isArray(modelsRes) ? modelsRes : []);
  setEngineTypes(Array.isArray(engineTypesRes) ? engineTypesRes : []);
  setTransmissions(Array.isArray(transmissionsRes) ? transmissionsRes : []);
};


  useEffect(() => {
    fetchData();
  }, []);

  /* Reset model when make changes */
  useEffect(() => {
    setModelId(null);
  }, [makeId]);

  /* ===================== CREATE ===================== */
  const handleCreate = async () => {
    if (
      !name ||
      !makeId ||
      !modelId ||
      !year ||
      !engineTypeId ||
      !transmissionId
    ) {
      return alert("Fill all required fields");
    }

    await POST(API.admin.versions, {
      name,
      make_id: makeId,
      model_id: modelId,
      
      year,
      engine_type_id: engineTypeId,
      transmission_id: transmissionId,
      cc: cc || null,
    });

    setName("");
    setMakeId(null);
    setModelId(null);
    setYear(null);
    setEngineTypeId(null);
    setTransmissionId(null);
    setCc(null);

    fetchData();
  };

  /* ===================== DELETE ===================== */
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this version?")) return;
    await fetch(`${API.admin.versions}/${id}`, { method: "DELETE" });
    fetchData();
  };

  /* ===================== UI ===================== */
  return (
    <div className="bg-white p-4 rounded">
      <h2 className="text-lg font-semibold mb-4">Manage Versions</h2>

      <div className="flex flex-wrap gap-2 mb-4">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Version Name"
          className="border p-2 rounded"
        />

        <input
          value={year ?? ""}
          onChange={e => setYear(e.target.value ? Number(e.target.value) : null)}
          placeholder="Year"
          className="border p-2 rounded w-24"
        />

        <input
          value={cc ?? ""}
          onChange={e => setCc(e.target.value ? Number(e.target.value) : null)}
          placeholder="CC"
          className="border p-2 rounded w-24"
        />

        {/* MAKE */}
        <select
          value={makeId ?? ""}
          onChange={e =>
            setMakeId(e.target.value ? Number(e.target.value) : null)
          }
          className="border p-2 rounded"
        >
          <option value="">Select Make</option>
          {makes.map(m => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>

        {/* MODEL */}
        <select
          value={modelId ?? ""}
          onChange={e =>
            setModelId(e.target.value ? Number(e.target.value) : null)
          }
          disabled={!makeId}
          className="border p-2 rounded disabled:opacity-50"
        >
          <option value="">Select Model</option>
          {models
  .filter(m => makeId !== null && m.make_id === makeId)
  .map(m => (
    <option key={m.id} value={m.id}>
      {m.name}
    </option>
  ))}

        </select>

        {/* ENGINE TYPE */}
<select
  value={engineTypeId ?? ""}
  onChange={e => setEngineTypeId(e.target.value ? Number(e.target.value) : null)}
  className="border p-2 rounded"
>
  <option value="">Select Engine Type</option>
  {engineTypes.map(et => (
    <option key={et.id} value={et.id}>
      {et.name}
    </option>
  ))}
</select>

{/* TRANSMISSION */}
<select
  value={transmissionId ?? ""}
  onChange={e => setTransmissionId(e.target.value ? Number(e.target.value) : null)}
  className="border p-2 rounded"
>
  <option value="">Select Transmission</option>
  {transmissions.map(t => (
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

      <ul>
        {versions.map(v => (
          <li key={v.id} className="flex justify-between border-b py-2">
            {v.name} ({v.make?.name} - {v.model?.name})
            {v.cc ? ` - ${v.cc}cc` : ""} - {v.year}
            <button
              onClick={() => handleDelete(v.id)}
              className="text-red-500 ml-4"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
