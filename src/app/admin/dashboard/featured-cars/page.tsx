"use client";

import React, { useEffect, useState } from "react";
import { Eye, EyeOff, TrendingUp, Calendar, DollarSign } from "lucide-react";
import { featuredCarsAPI } from "@/src/services/featuredCarsAPI";

interface FeaturedCar {
  id: number;
  car_id: number;
  plan_id: number;
  user_id: number;
  status: "active" | "expired" | "cancelled";
  starts_at: string;
  expires_at: string;
  amount_paid: number;
  car: {
    id: number;
    title: string;
    price: number;
  };
  user: {
    id: number;
    name: string;
    email: string;
  };
  plan: {
    id: number;
    name: string;
    price: number;
    border_color: string;
  };
}

export default function FeaturedCarsPage() {
  const [featuredCars, setFeaturedCars] = useState<FeaturedCar[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    expired: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    // HTTP-only cookies are automatically sent with fetch requests
    fetchFeaturedCars();
  }, []);

  const fetchFeaturedCars = async () => {
    try {
      setLoading(true);
      const response = await featuredCarsAPI.adminGetFeaturedListings();

      if (response.success) {
        // Handle paginated data - response.data is the paginator object
        let data = [];
        if (response.data && Array.isArray(response.data.data)) {
          data = response.data.data;
        } else if (Array.isArray(response.data)) {
          data = response.data;
        } else if (response.data && response.data.items && Array.isArray(response.data.items)) {
          // Fallback for some common pagination formats
          data = response.data.items;
        }

        setFeaturedCars(data);
      }
    } catch (error) {
      console.error("Error fetching featured cars:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const active = featuredCars.filter((car) => car.status === "active").length;
    const expired = featuredCars.filter((car) => car.status === "expired").length;
    const revenue = featuredCars.reduce(
      (sum, car) => sum + (car.amount_paid || 0),
      0
    );

    setStats({
      total: featuredCars.length,
      active,
      expired,
      totalRevenue: revenue,
    });
  };

  useEffect(() => {
    calculateStats();
  }, [featuredCars]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Featured Cars</h1>
          <p className="text-gray-600 mt-1">Monitor all featured car listings</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Featured</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <TrendingUp className="text-blue-500" size={32} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active</p>
                <p className="text-3xl font-bold text-green-600">{stats.active}</p>
              </div>
              <Eye className="text-green-500" size={32} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Expired</p>
                <p className="text-3xl font-bold text-red-600">{stats.expired}</p>
              </div>
              <EyeOff className="text-red-500" size={32} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Revenue</p>
                <p className="text-3xl font-bold text-purple-600">
                  Rs {stats.totalRevenue.toLocaleString()}
                </p>
              </div>
              <DollarSign className="text-purple-500" size={32} />
            </div>
          </div>
        </div>

        {/* Featured Cars Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">Loading featured cars...</p>
            </div>
          ) : featuredCars.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No featured cars yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Car
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Plan
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Duration
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {featuredCars.map((featured) => (
                    <tr key={featured.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {featured.car?.title || "Unknown Car"}
                          </p>
                          <p className="text-sm text-gray-600">
                            Car ID: {featured.car_id}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {featured.user?.name || "Unknown User"}
                          </p>
                          <p className="text-sm text-gray-600">
                            {featured.user?.email || "No email"}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className="inline-block px-3 py-1 rounded text-white font-semibold text-sm"
                          style={{
                            backgroundColor: featured.plan?.border_color || "#cbd5e1",
                          }}
                        >
                          {featured.plan?.name || "No Plan"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${featured.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                            }`}
                        >
                          {(featured.status || "UNKNOWN").toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-gray-400" />
                          {featured.starts_at ? new Date(featured.starts_at).toLocaleDateString() : "N/A"} -{" "}
                          {featured.expires_at ? new Date(featured.expires_at).toLocaleDateString() : "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        Rs {featured.amount_paid?.toLocaleString() || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
