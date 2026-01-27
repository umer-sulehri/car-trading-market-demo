"use client";

import React, { useState } from "react";
import DashboardLayout from "@/src/app/admin/dashboard/layout";
import { CheckCircle, XCircle } from "lucide-react";

interface Booking {
  id: number;
  user: string;
  car: string;
  date: string;
  price: string;
  status: "Pending" | "Completed" | "Cancelled";
}

const mockBookings: Booking[] = [
  { id: 1, user: "Ali Khan", car: "Toyota Corolla", date: "2025-01-04", price: "PKR 500k", status: "Pending" },
  { id: 2, user: "Sara Ahmed", car: "Honda Civic", date: "2025-01-03", price: "PKR 450k", status: "Completed" },
  { id: 3, user: "Ahmed Ali", car: "KIA Sportage", date: "2025-01-05", price: "PKR 900k", status: "Pending" },
];

const BookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState(mockBookings);

  const handleBookingStatus = (bookingId: number, status: "Completed" | "Cancelled") => {
    setBookings(
      bookings.map((b) => (b.id === bookingId ? { ...b, status } : b))
    );
  };

  return (
    <>
      <h1 className="text-lg font-bold mb-4">Manage Bookings</h1>

      <div className="overflow-x-auto bg-white p-4 rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">User</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Car</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Date</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Price</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Status</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {bookings.map((b) => (
              <tr key={b.id}>
                <td className="px-4 py-2">{b.user}</td>
                <td className="px-4 py-2">{b.car}</td>
                <td className="px-4 py-2">{b.date}</td>
                <td className="px-4 py-2">{b.price}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      b.status === "Pending"
                        ? "bg-yellow-100 text-yellow-600"
                        : b.status === "Completed"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {b.status}
                  </span>
                </td>
                <td className="px-4 py-2 flex gap-2">
                  {b.status === "Pending" && (
                    <>
                      <button
                        className="bg-green-100 text-green-600 px-2 py-1 rounded flex items-center gap-1 text-sm"
                        onClick={() => handleBookingStatus(b.id, "Completed")}
                      >
                        <CheckCircle size={14} /> Complete
                      </button>
                      <button
                        className="bg-red-100 text-red-600 px-2 py-1 rounded flex items-center gap-1 text-sm"
                        onClick={() => handleBookingStatus(b.id, "Cancelled")}
                      >
                        <XCircle size={14} /> Cancel
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default BookingsPage;
