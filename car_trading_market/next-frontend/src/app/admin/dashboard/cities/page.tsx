"use client";

import { useEffect, useState } from "react";
import {
  getCities,
  createCity,
  deleteCity,
  getProvinces,
} from "@/src/services/admin.lookup.service";

interface Province {
  id: number;
  name: string;
}

interface City {
  id: number;
  name: string;
  province: Province;
}

export default function CitiesPage() {
  const [cities, setCities] = useState<City[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [name, setName] = useState("");
  const [provinceId, setProvinceId] = useState<number | "">("");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [citiesRes, provincesRes] = await Promise.all([
        getCities(),
        getProvinces(),
      ]);
      setCities(citiesRes);
      setProvinces(provincesRes);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async () => {
    if (!name || !provinceId) return alert("Select province & city name");

    await createCity({
      name,
      province_id: Number(provinceId),
    });

    setName("");
    setProvinceId("");
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this city?")) return;
    await deleteCity(id);
    fetchData();
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Manage Cities</h2>

      {/* Create */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <select
          value={provinceId}
          onChange={(e) => setProvinceId(Number(e.target.value))}
          className="border p-2 rounded"
        >
          <option value="">Select Province</option>
          {provinces.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="City name"
          className="border p-2 rounded"
        />

        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white rounded"
        >
          Add
        </button>
      </div>

      {/* List */}
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        cities.map((city) => (
          <div
            key={city.id}
            className="flex justify-between py-2 border-b"
          >
            <span>
              <strong>{city.name}</strong>
              <span className="text-sm text-gray-500 ml-2">
                ({city.province?.name})
              </span>
            </span>

            <button
              onClick={() => handleDelete(city.id)}
              className="text-red-500 text-sm"
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}
