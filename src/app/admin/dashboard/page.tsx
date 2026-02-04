"use client";

import { useEffect, useState } from "react";
import {
  Car,
  ClipboardList,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Users,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { StatsCard } from "@/src/app/admin/dashboard/components/StatsCard";
import BookingItem from "@/src/app/admin/dashboard/components/BookingItem";
import { getAllCars, getAllVersions } from "@/src/services/admin.car.service";
import { getAllUsers } from "@/src/services/admin.user.service";
import { getAdminSellCars } from "@/src/services/adminSellCar.service";
import { getSellerQueries } from "@/src/services/buyer.service";

interface DashboardStats {
  totalCars: number;
  totalVersions: number;
  totalSellCars: number;
  totalUsers: number;
  totalBuyerQueries: number;
  recentListings: any[];
  recentQueries: any[];
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalCars: 0,
    totalVersions: 0,
    totalSellCars: 0,
    totalUsers: 0,
    totalBuyerQueries: 0,
    recentListings: [],
    recentQueries: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [carsRes, versionsRes, sellCarsRes, usersRes, queriesRes] = await Promise.all([
        getAllCars(),
        getAllVersions(),
        getAdminSellCars(),
        getAllUsers(),
        getSellerQueries(),
      ]);

      setStats({
        totalCars: Array.isArray(carsRes) ? carsRes.length : (carsRes?.data?.length || 0),
        totalVersions: Array.isArray(versionsRes) ? versionsRes.length : (versionsRes?.data?.length || 0),
        totalSellCars: Array.isArray(sellCarsRes) ? sellCarsRes.length : (sellCarsRes?.data?.length || 0),
        totalUsers: Array.isArray(usersRes) ? usersRes.length : (usersRes?.data?.length || 0),
        totalBuyerQueries: Array.isArray(queriesRes) ? queriesRes.length : (queriesRes?.data?.length || 0),
        recentListings: Array.isArray(sellCarsRes) ? sellCarsRes.slice(0, 5) : (Array.isArray(sellCarsRes?.data) ? sellCarsRes.data.slice(0, 5) : []),
        recentQueries: Array.isArray(queriesRes) ? queriesRes.slice(0, 5) : (Array.isArray(queriesRes?.data) ? queriesRes.data.slice(0, 5) : []),
      });
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
      setStats({
        totalCars: 0,
        totalVersions: 0,
        totalSellCars: 0,
        totalUsers: 0,
        totalBuyerQueries: 0,
        recentListings: [],
        recentQueries: [],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome to your admin dashboard. Monitor your platform performance.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard 
          title="Total Cars" 
          value={stats.totalCars} 
          icon={<Car className="w-6 h-6" />}
          color="blue"
        />
        <StatsCard
          title="Total Versions"
          value={stats.totalVersions}
          icon={<TrendingUp className="w-6 h-6" />}
          color="green"
        />
        <StatsCard
          title="Sell Cars"
          value={stats.totalSellCars}
          icon={<ClipboardList className="w-6 h-6" />}
          color="purple"
        />
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users className="w-6 h-6" />}
          color="orange"
        />
        <StatsCard
          title="Buyer Queries"
          value={stats.totalBuyerQueries}
          icon={<AlertTriangle className="w-6 h-6" />}
          color="red"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Listings */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Car Listings</h2>
            <a
              href="/admin/dashboard/sell-cars"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View All →
            </a>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : stats.recentListings.length > 0 ? (
            <div className="space-y-3">
              {stats.recentListings.map((listing: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div>
                    <p className="font-medium text-gray-900">{listing.version?.name || "Car"}</p>
                    <p className="text-sm text-gray-600">
                      {listing.seller_name} • {new Date(listing.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">Rs. {listing.price?.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">{listing.mileage} km</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No listings yet</p>
          )}
        </div>

        {/* Quick Stats */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg shadow text-white p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Quick Stats</h2>
            <DollarSign className="w-6 h-6" />
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-blue-100 text-sm mb-1">Platform Status</p>
              <p className="text-3xl font-bold">Active</p>
            </div>
            <div className="h-px bg-blue-500 opacity-30"></div>
            <div>
              <p className="text-blue-100 text-sm mb-1">Total Lookups</p>
              <p className="text-2xl font-bold">
                {stats.totalCars + stats.totalVersions + stats.totalSellCars}
              </p>
            </div>
            <div className="h-px bg-blue-500 opacity-30"></div>
            <div>
              <p className="text-blue-100 text-sm mb-1">Active Users</p>
              <p className="text-2xl font-bold">{stats.totalUsers}</p>
            </div>
          </div>

          <button className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium transition">
            Generate Report
          </button>
        </div>
      </div>

      {/* Recent Buyer Queries */}
      {stats.recentQueries.length > 0 && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Buyer Queries</h2>
            <a
              href="/admin/dashboard/enquirie"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View All →
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Buyer</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Phone</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentQueries.map((query: any, idx: number) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900">{query.name || "Anonymous"}</td>
                    <td className="py-3 px-4 text-gray-600 text-sm">{query.email || "-"}</td>
                    <td className="py-3 px-4 text-gray-600 text-sm">{query.phone || "-"}</td>
                    <td className="py-3 px-4 text-gray-600 text-sm">
                      {new Date(query.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
