"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCarById, updateCar, Car } from "@/src/services/car.service";

export default function EditCarPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState<Partial<Car>>({});
  const [images, setImages] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

  // Load car data
  useEffect(() => {
    getCarById(Number(id)).then((data) => setForm(data));
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setImages(e.target.files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fd = new FormData();

      // Append all form fields
      Object.entries(form).forEach(([key, value]) => {
        if (value !== undefined && value !== null) fd.append(key, String(value));
      });

      // Append new images if uploaded
      if (images) {
        Array.from(images).forEach((file) => fd.append("images[]", file));
      }

      await updateCar(Number(id), fd);

      alert("Car updated successfully!");
      router.push("/user/dashboard/cars");
    } catch (err) {
      console.error(err);
      alert("Failed to update car");
    } finally {
      setLoading(false);
    }
  };

  if (!form) return <p>Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Edit Car Details</h2>

      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 space-y-6">
        <table className="w-full table-auto border-collapse">
          <tbody className="divide-y divide-gray-200">
            {[
              ["Make", "make"],
              ["Model", "model"],
              ["Version", "version"],
              ["City", "city"],
              ["Address", "address"],
              ["Registration Status", "registration_status"],
              ["Registration City", "registration_city"],
              ["Exterior Color", "exterior_color"],
              ["Mileage", "mileage"],
              ["Price", "price"],
              ["Seller Name", "seller_name"],
              ["Phone", "phone"],
              ["Secondary Phone", "secondary_phone"],
              ["Email", "email"],
            ].map(([label, field]) => (
              <tr key={field} className="hover:bg-gray-50">
                <td className="py-3 px-4 font-semibold text-gray-700">{label}</td>
                <td className="py-3 px-4">
                  <input
                    name={field}
                    value={form[field as keyof Car] ?? ""}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </td>
              </tr>
            ))}

            {/* Availability */}
            <tr className="hover:bg-gray-50">
              <td className="py-3 px-4 font-semibold text-gray-700">Availability</td>
              <td className="py-3 px-4">
                <select
                  name="availability_status"
                  value={form.availability_status ?? "Available"}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="Available">Available</option>
                  <option value="Sold">Sold</option>
                </select>
              </td>
            </tr>

            {/* Description */}
            <tr className="hover:bg-gray-50">
              <td className="py-3 px-4 font-semibold text-gray-700">Description</td>
              <td className="py-3 px-4">
                <textarea
                  name="description"
                  value={form.description ?? ""}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  rows={3}
                />
              </td>
            </tr>

            {/* Images */}
            <tr className="hover:bg-gray-50">
              <td className="py-3 px-4 font-semibold text-gray-700">Images</td>
              <td className="py-3 px-4">
                <input type="file" multiple onChange={handleFileChange} className="w-full mb-3" />
                <div className="flex gap-2 flex-wrap">
                  {form.images?.map((img, idx) => (
                    <img
                      key={idx}
                      src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/${img}`}
                      alt="car"
                      className="w-24 h-24 object-cover rounded"
                    />
                  ))}
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            {loading ? "Updating..." : "Update Car"}
          </button>
        </div>
      </form>
    </div>
  );
}
