"use client";

import { useEffect, useState } from "react";
import { getMyCars, deleteCar, Car } from "@/src/services/car.service";
import { useRouter } from "next/navigation";

export default function MyCarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(10);
  const router = useRouter();

  const fetchCars = async () => {
    try {
      const res = await getMyCars();
      setCars(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this car?")) return;

    await deleteCar(id);
    setCars((prev) => prev.filter((c) => c.id !== id));
  };

  const handleNext = () => {
    setVisibleCount((prev) => prev + 5);
  };

  const handleShowAll = () => {
    setVisibleCount(cars.length);
  };

  useEffect(() => {
    fetchCars();
  }, []);

  if (loading) return <p>Loading...</p>;

  const displayedCars = cars.slice(0, visibleCount);

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold mb-4">My Listed Cars</h2>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="p-3">Car</th>
              <th className="p-3">City</th>
              <th className="p-3">Price</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {displayedCars.map((car) => (
              <tr key={car.id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  {car.make} {car.model}
                </td>
                <td className="p-3">{car.city}</td>
                <td className="p-3">Rs {car.price}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      car.availability_status === "available"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {car.availability_status}
                  </span>
                </td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => router.push(`/user/dashboard/cars/${car.id}`)}
                    className="text-blue-600"
                  >
                    View
                  </button>

                  <button
                    onClick={() => router.push(`/user/dashboard/cars/${car.id}/edit`)}
                    className="text-green-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(car.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {cars.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No cars listed yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {cars.length > 10 && visibleCount < cars.length && (
        <div className="mt-4 flex gap-2">
          {visibleCount < cars.length && (
            <button
              className="bg-gray-200 px-3 py-1 rounded text-sm"
              onClick={handleNext}
            >
              Next
            </button>
          )}
          <button
            className="bg-gray-200 px-3 py-1 rounded text-sm"
            onClick={handleShowAll}
          >
            Show All
          </button>
        </div>
      )}
    </div>
  );
}
