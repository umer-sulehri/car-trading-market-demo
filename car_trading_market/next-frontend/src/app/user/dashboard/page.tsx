"use client";

import { useEffect, useState } from "react";
import { getMySellCars } from "@/src/services/adminSellCar.service";
import StatsCard from "./components/StatsCard";
import { CheckCircle, Clock, XCircle } from "lucide-react";

interface SellCar {
  id: number;
  make_id: number;
  version_id: number;
  price: number;
  mileage: number;
  status: "pending" | "approved" | "rejected";
  seller_name: string;
  created_at: string;
  make?: { name: string };
  version?: { name: string };
  media?: { media_path: string }[];
}

export default function DashboardPage() {
  const [sellCars, setSellCars] = useState<SellCar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSellCars();
  }, []);

  const fetchSellCars = async () => {
    try {
      const data = await getMySellCars();
      setSellCars(data?.data || data || []);
    } catch (error) {
      console.error("Error fetching sell cars:", error);
    } finally {
      setLoading(false);
    }
  };

  const pendingCount = sellCars.filter(c => c.status === "pending").length;
  const approvedCount = sellCars.filter(c => c.status === "approved").length;
  const rejectedCount = sellCars.filter(c => c.status === "rejected").length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium"><CheckCircle className="w-4 h-4" /> Approved</span>;
      case "pending":
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium"><Clock className="w-4 h-4" /> Pending</span>;
      case "rejected":
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-medium"><XCircle className="w-4 h-4" /> Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">My Listings</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard title="Total Listings" value={sellCars.length.toString()} />
        <StatsCard title="Pending Approval" value={pendingCount.toString()} />
        <StatsCard title="Approved" value={approvedCount.toString()} />
      </div>

      {loading ? (
        <div className="text-center py-8">Loading your listings...</div>
      ) : sellCars.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No listings yet. <a href="/sell-car" className="text-blue-600 hover:underline">Create one</a></p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sellCars.map((car) => (
            <div key={car.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {car.media && car.media[0] ? (
                <div className="w-full h-48 bg-gray-200 overflow-hidden">
                  <img
                    src={`/storage/${car.media[0].media_path}`}
                    alt={`${car.make?.name} ${car.version?.name}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-48 bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-500">No image</span>
                </div>
              )}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{car.make?.name} {car.version?.name}</h3>
                    <p className="text-sm text-gray-500">{car.mileage} km</p>
                  </div>
                  {getStatusBadge(car.status)}
                </div>
                <div className="text-lg font-bold text-green-600 mb-2">Rs. {car.price?.toLocaleString()}</div>
                <p className="text-sm text-gray-600">Listed by {car.seller_name}</p>
                <p className="text-xs text-gray-400 mt-2">{new Date(car.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
