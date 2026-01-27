"use client";

import { useEffect, useState } from "react";
import {
  getMakes,
  createMake,
  deleteMake,
} from "@/src/services/admin.lookup.service";

interface Make {
  id: number;
  name: string;
  logo?: string;
}

export default function MakesPage() {
  const [makes, setMakes] = useState<Make[]>([]);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  /* ---------------- Fetch Makes ---------------- */
  const fetchMakes = async () => {
    try {
      setLoading(true);
      const data = await getMakes();
      setMakes(data);
    } catch (error) {
      console.error("Failed to fetch makes", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMakes();
  }, []);

  /* ---------------- Create Make ---------------- */
  const handleCreate = async () => {
    if (!name.trim()) return;

    const formData = new FormData();
    formData.append("name", name);

    if (icon) {
      formData.append("logo", icon); // ✅ backend expects "logo"
    }

    try {
      setCreating(true);
      await createMake(formData);
      setName("");
      setIcon(null);
      await fetchMakes();
    } catch (error) {
      console.error("Failed to create make", error);
    } finally {
      setCreating(false);
    }
  };

  /* ---------------- Delete Make ---------------- */
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this make?")) return;

    try {
      await deleteMake(id);
      await fetchMakes();
    } catch (error) {
      console.error("Failed to delete make", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Manage Makes</h2>

      {/* Create Make */}
      <div className="flex gap-2 mb-4 items-center">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter make name"
          className="border px-3 py-2 rounded w-64"
          disabled={creating}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setIcon(e.target.files?.[0] || null)}
          className="border px-3 py-2 rounded"
        />

        <button
          onClick={handleCreate}
          disabled={creating}
          className={`px-4 py-2 rounded text-white ${
            creating ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {creating ? "Adding..." : "Add"}
        </button>
      </div>

      {/* List Makes */}
      {loading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : makes.length === 0 ? (
        <p className="text-sm text-gray-500">No makes found</p>
      ) : (
        <ul className="divide-y border rounded">
          {makes.map((make) => (
            <li
              key={make.id}
              className="flex justify-between items-center p-3"
            >
              <div className="flex items-center gap-3">
                {make.logo && (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL?.replace(
                      "/api",
                      ""
                    )}/storage/${make.logo}`}
                    alt={make.name}
                    className="w-8 h-8 object-contain"
                  />
                )}
                <span className="font-medium">{make.name}</span>
              </div>

              <button
                onClick={() => handleDelete(make.id)}
                className="text-red-500 hover:underline text-sm"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
