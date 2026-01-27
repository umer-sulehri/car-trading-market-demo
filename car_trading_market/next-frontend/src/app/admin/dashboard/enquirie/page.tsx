"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import { getAllCars, updateCarStatus } from "@/src/services/admin.car.service";

interface AdminCar {
  id: number;
  make: string;
  model: string;
  price: number;
  car_approval: "Pending" | "Accepted" | "Rejected";
  user: { id: number; name: string; email: string };
}

const EnquiriePage: React.FC = () => {
  const [cars, setCars] = useState<AdminCar[]>([]);
  const [loading, setLoading] = useState(true);

  const [expandedUsers, setExpandedUsers] = useState<Record<number, boolean>>({});
  const [carsPerPage] = useState(5);
  const [visibleCars, setVisibleCars] = useState<Record<number, number>>({});
  const [showAll, setShowAll] = useState<Record<number, boolean>>({});

  // Fetch all cars for admin
  useEffect(() => {
    getAllCars()
      .then((res) => setCars(res))
      .catch((err) => console.error("Failed to fetch cars", err))
      .finally(() => setLoading(false));
  }, []);

  const handleCarStatus = async (
    carId: number,
    status: "Accepted" | "Rejected"
  ) => {
    try {
      await updateCarStatus(carId, status);

      setCars((prev) =>
        prev.map((car) =>
          car.id === carId ? { ...car, car_approval: status } : car
        )
      );
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update status. Try again.");
    }
  };

  if (loading) return <p>Loading...</p>;

  // Group cars by user
  const carsByUser = cars.reduce<Record<number, AdminCar[]>>((acc, car) => {
    if (!acc[car.user.id]) acc[car.user.id] = [];
    acc[car.user.id].push(car);
    return acc;
  }, {});

  const toggleUser = (userId: number) => {
    setExpandedUsers((prev) => ({ ...prev, [userId]: !prev[userId] }));
  };

  const handleNext = (userId: number) => {
    setVisibleCars((prev) => ({
      ...prev,
      [userId]: (prev[userId] || carsPerPage) + carsPerPage,
    }));
  };

  const handleShowAll = (userId: number) => {
    setShowAll((prev) => ({ ...prev, [userId]: true }));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold mb-4">User Car Listings</h1>

      {Object.entries(carsByUser).map(([userId, userCars]) => {
        const user = userCars[0].user;
        const expanded = expandedUsers[user.id] ?? false; // collapsed by default
        const maxCars = showAll[user.id] ? userCars.length : visibleCars[user.id] || carsPerPage;

        // Count Pending cars for this user
        const pendingCount = userCars.filter((car) => car.car_approval === "Pending").length;

        return (
          <div key={userId} className="border rounded-lg bg-white shadow-sm">
            {/* User Header */}
            <div
              className="flex justify-between items-center p-4 cursor-pointer"
              onClick={() => toggleUser(user.id)}
            >
              <div>
                <p className="font-semibold text-lg">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>

              <div className="flex items-center gap-4">
                {pendingCount > 0 && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-600 rounded text-sm">
                    Pending: {pendingCount}
                  </span>
                )}
                {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </div>

            {/* Cars Table */}
            {expanded && (
              <div className="overflow-x-auto p-4 border-t border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Car</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Model</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Price</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Status</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {userCars.slice(0, maxCars).map((car) => (
                      <tr key={car.id}>
                        <td className="px-4 py-2">{car.make}</td>
                        <td className="px-4 py-2">{car.model}</td>
                        <td className="px-4 py-2">PKR {car.price.toLocaleString()}</td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-2 py-1 rounded text-sm ${
                              car.car_approval === "Pending"
                                ? "bg-yellow-100 text-yellow-600"
                                : car.car_approval === "Accepted"
                                ? "bg-green-100 text-green-600"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {car.car_approval}
                          </span>
                        </td>
                        <td className="px-4 py-2 flex gap-2">
                          {car.car_approval === "Pending" && (
                            <>
                              <button
                                className="bg-green-100 text-green-600 px-2 py-1 rounded flex items-center gap-1 text-sm"
                                onClick={() => handleCarStatus(car.id, "Accepted")}
                              >
                                <CheckCircle size={14} /> Accept
                              </button>

                              <button
                                className="bg-red-100 text-red-600 px-2 py-1 rounded flex items-center gap-1 text-sm"
                                onClick={() => handleCarStatus(car.id, "Rejected")}
                              >
                                <XCircle size={14} /> Reject
                              </button>
                            </>
                          )}

                          {car.car_approval === "Accepted" && (
                            <button
                              className="bg-red-100 text-red-600 px-2 py-1 rounded flex items-center gap-1 text-sm"
                              onClick={() => handleCarStatus(car.id, "Rejected")}
                            >
                              <XCircle size={14} /> Reject
                            </button>
                          )}

                          {car.car_approval === "Rejected" && (
                            <button
                              className="bg-green-100 text-green-600 px-2 py-1 rounded flex items-center gap-1 text-sm"
                              onClick={() => handleCarStatus(car.id, "Accepted")}
                            >
                              <CheckCircle size={14} /> Accept
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination / Show All */}
                {userCars.length > carsPerPage && !showAll[user.id] && (
                  <div className="mt-2 flex gap-2">
                    {maxCars < userCars.length && (
                      <button
                        className="bg-gray-200 px-3 py-1 rounded text-sm"
                        onClick={() => handleNext(user.id)}
                      >
                        Next
                      </button>
                    )}
                    <button
                      className="bg-gray-200 px-3 py-1 rounded text-sm"
                      onClick={() => handleShowAll(user.id)}
                    >
                      Show All
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default EnquiriePage;
