"use client";

import { useEffect, useState } from "react";
import { getAdminSellCars, updateSellCarStatus } from "@/src/services/adminSellCar.service";
import { CheckCircle, XCircle, Clock } from "lucide-react";

interface SellCar {
  id: number;
  make_id: number;
  version_id: number;
  price: number;
  mileage: number;
  status: "pending" | "approved" | "rejected";
  seller_name: string;
  seller_phone: string;
  created_at: string;
  user_id?: number;
  user?: { name: string; email: string };
  make?: { name: string };
  version?: { name: string };
  media?: { media_path: string }[];
}

export default function AdminSellCarsPage() {
  const [sellCars, setSellCars] = useState<SellCar[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");

  useEffect(() => {
    fetchSellCars();
  }, []);

  const fetchSellCars = async () => {
    try {
      const data = await getAdminSellCars();
      setSellCars(data?.data || data || []);
    } catch (error) {
      console.error("Error fetching sell cars:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: number, status: "approved" | "rejected") => {
    try {
      await updateSellCarStatus(id, status);
      setSellCars(sellCars.map(car => 
        car.id === id ? { ...car, status } : car
      ));
      alert(`Listing ${status}!`);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  const filteredCars = filter === "all" ? sellCars : sellCars.filter(c => c.status === filter);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Sell Car Listings</h1>

      {/* Filter Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        {(["all", "pending", "approved", "rejected"] as const).map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 font-medium capitalize transition-colors ${
              filter === status
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-8">Loading listings...</div>
      ) : filteredCars.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No listings found</div>
      ) : (
        <div className="grid gap-4">
          {filteredCars.map((car) => (
            <div key={car.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
                {/* Image */}
                <div>
                  {car.media && car.media[0] ? (
                    <img
                      src={`/storage/${car.media[0].media_path}`}
                      alt={`${car.make?.name} ${car.version?.name}`}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-300 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500">No image</span>
                    </div>
                  )}
                </div>

                {/* Car Details */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(car.status)}
                    <span className="capitalize font-semibold text-sm">{car.status}</span>
                  </div>
                  <h3 className="font-bold text-lg">{car.make?.name} {car.version?.name}</h3>
                  <p className="text-gray-600 text-sm">{car.mileage} km</p>
                  <p className="text-green-600 font-semibold mt-2">Rs. {car.price?.toLocaleString()}</p>
                </div>

                {/* Seller Details */}
                <div>
                  <h4 className="font-semibold text-sm text-gray-700">Seller Info</h4>
                  <p className="text-sm">{car.seller_name}</p>
                  <p className="text-sm text-gray-600">{car.seller_phone}</p>
                  {car.user && (
                    <>
                      <p className="text-xs text-gray-500 mt-2">Account: {car.user.name}</p>
                      <p className="text-xs text-gray-500">{car.user.email}</p>
                    </>
                  )}
                  <p className="text-xs text-gray-400 mt-2">{new Date(car.created_at).toLocaleDateString()}</p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 justify-center">
                  {car.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(car.id, "approved")}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" /> Approve
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(car.id, "rejected")}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                    </>
                  )}
                  {car.status !== "pending" && (
                    <button
                      onClick={() => handleStatusUpdate(car.id, "pending")}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
                    >
                      Back to Pending
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
