"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCarById, Car } from "@/src/services/car.service";

export default function CarDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [car, setCar] = useState<Car | null>(null);

  useEffect(() => {
    getCarById(Number(id)).then(setCar);
  }, [id]);

  if (!car) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">
        {car.make} {car.model}
      </h2>

      <p><b>City:</b> {car.city}</p>
      <p><b>Price:</b> Rs {car.price}</p>
      <p><b>Mileage:</b> {car.make}</p>
      <p><b>Status:</b> {car.availability_status}</p>

      <p className="mt-4 text-gray-600">{car.model}</p>

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => router.push(`/user/dashboard/cars/${car.id}/edit`)}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Edit
        </button>

        <button
          onClick={() => router.back()}
          className="bg-gray-200 px-4 py-2 rounded"
        >
          Back
        </button>
      </div>
    </div>
  );
}
