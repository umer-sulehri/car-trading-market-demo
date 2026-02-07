"use client";

import { useEffect, useState } from "react";
import { getMySellCars } from "@/src/services/adminSellCar.service";
import { getSellerQueries } from "@/src/services/buyer.service";
import { getUserProfile, AppUser } from "@/src/services/user.service";
import { getFavoriteCars, removeFromFavorites } from "@/src/services/favorite.service";
import { isUserAuthenticated } from "@/src/lib/auth/cookie.utils";
import StatsCard from "./components/StatsCard";
import Image from "next/image";
import { 
  CheckCircle, Clock, XCircle, Plus, TrendingUp, Eye, AlertCircle,
  DollarSign, Car, FileText, Settings, MessageSquare, Heart, Trash2, MapPin, Gauge
} from "lucide-react";
import Link from "next/link";

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
  media?: { image: string; media_path: string }[];
}

interface BuyerQuery {
  id: number;
  sell_car_id: number;
  buyer_name: string;
  buyer_phone: string;
  status: 'pending' | 'viewed' | 'responded' | 'closed';
  created_at: string;
  sellCar?: { make?: { name: string }; version?: { name: string } };
}

const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect fill='%23e5e7eb' width='300' height='200'/%3E%3Ctext x='50%25' y='50%25' font-size='16' fill='%239ca3af' text-anchor='middle' dominant-baseline='middle'%3ENo Image Available%3C/text%3E%3C/svg%3E";

export default function DashboardPage() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [sellCars, setSellCars] = useState<SellCar[]>([]);
  const [buyerQueries, setBuyerQueries] = useState<BuyerQuery[]>([]);
  const [favoriteCars, setFavoriteCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [userData, carsData, queriesData, favsData] = await Promise.all([
        getUserProfile(),
        getMySellCars(),
        getSellerQueries(),
        getFavoriteCars().catch(() => [])
      ]);
      setUser(userData);
      setSellCars(carsData?.data || carsData || []);
      setBuyerQueries(queriesData?.data || queriesData || []);
      setFavoriteCars(Array.isArray(favsData) ? favsData : (favsData as any)?.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (carId: number) => {
    try {
      await removeFromFavorites(carId);
      setFavoriteCars(prevCars => prevCars.filter(car => car.id !== carId));
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  const pendingCount = sellCars.filter(c => c.status === "pending").length;
  const approvedCount = sellCars.filter(c => c.status === "approved").length;
  const rejectedCount = sellCars.filter(c => c.status === "rejected").length;
  const totalPrice = sellCars.reduce((sum, car) => sum + (car.price || 0), 0);

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

  const recentCars = sellCars.slice(0, 3);

  return (
    <div className="space-y-6 pb-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name || "User"}! 👋</h1>
          <p className="text-gray-600 mt-1">Manage your car listings and profile</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Link
            href="/sell-car"
            className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <Plus className="w-4 h-4" />
            List New Car
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatsCard 
          title="Total Listings" 
          value={sellCars.length.toString()}
          icon={<Car className="w-6 h-6" />}
          bgColor="bg-blue-50"
          textColor="text-blue-600"
        />
        <StatsCard 
          title="Pending Review" 
          value={pendingCount.toString()}
          icon={<Clock className="w-6 h-6" />}
          bgColor="bg-yellow-50"
          textColor="text-yellow-600"
        />
        <StatsCard 
          title="Approved" 
          value={approvedCount.toString()}
          icon={<CheckCircle className="w-6 h-6" />}
          bgColor="bg-green-50"
          textColor="text-green-600"
        />
        <StatsCard 
          title="Buyer Queries" 
          value={buyerQueries.length.toString()}
          icon={<MessageSquare className="w-6 h-6" />}
          bgColor="bg-purple-50"
          textColor="text-purple-600"
        />
        <StatsCard 
          title="Favorite Cars" 
          value={favoriteCars.length.toString()}
          icon={<Heart className="w-6 h-6" />}
          bgColor="bg-red-50"
          textColor="text-red-600"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link
            href="/sell-car"
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all text-center"
          >
            <Plus className="w-6 h-6 mx-auto mb-2 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Add New Car</span>
          </Link>
          <Link
            href="/user/dashboard/cars/all"
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all text-center"
          >
            <Eye className="w-6 h-6 mx-auto mb-2 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">View All Cars</span>
          </Link>
          <Link
            href="/user/dashboard/profile"
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all text-center"
          >
            <Settings className="w-6 h-6 mx-auto mb-2 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Edit Profile</span>
          </Link>
          <Link
            href="/user/dashboard/buyer-queries"
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all text-center"
          >
            <MessageSquare className="w-6 h-6 mx-auto mb-2 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Buyer Queries</span>
          </Link>
        </div>
      </div>

      {/* Alert for Rejected Cars */}
      {rejectedCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-red-800">Attention Required</h3>
            <p className="text-red-700 text-sm">You have {rejectedCount} car listing(s) that were rejected. Please review and resubmit.</p>
          </div>
        </div>
      )}

      {/* Recent Listings Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Recent Listings</h2>
          {sellCars.length > 3 && (
            <Link
              href="/user/dashboard/cars/all"
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              View all
              <span className="text-xl">→</span>
            </Link>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-4">Loading your listings...</p>
          </div>
        ) : sellCars.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4 text-lg">No listings yet</p>
            <Link
              href="/sell-car"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your First Listing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentCars.map((car) => (
              <div key={car.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
                {/* Image */}
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                  {car.media && car.media[0] ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/${car.media[0].image || car.media[0].media_path}`}
                      alt={`${car.make?.name} ${car.version?.name}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-500">No image</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    {getStatusBadge(car.status)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {car.make?.name} {car.version?.name}
                    </h3>
                    <p className="text-sm text-gray-600">{car.mileage?.toLocaleString()} km</p>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-green-600">
                      Rs. {car.price?.toLocaleString()}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500">
                    Listed on {new Date(car.created_at).toLocaleDateString()}
                  </p>

                  <div className="flex gap-2 pt-2">
                    <Link
                      href={`/user/dashboard/cars/${car.id}/edit`}
                      className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors text-sm font-medium text-center"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/user/dashboard/cars/${car.id}`}
                      className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm font-medium text-center"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Profile Completion Suggestion */}
      {user && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900">Complete Your Profile</h3>
              <p className="text-blue-800 text-sm">A complete profile helps buyers trust your listings more.</p>
              <Link
                href="/user/dashboard/profile"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm mt-2 inline-block"
              >
                Go to Profile Settings →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Recent Buyer Queries Section */}
      {buyerQueries.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-blue-600" />
              Recent Buyer Queries
            </h2>
            <Link
              href="/user/dashboard/buyer-queries"
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              View all
              <span className="text-xl">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {buyerQueries.slice(0, 3).map((query) => (
              <div
                key={query.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-4 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{query.buyer_name}</h3>
                    <p className="text-sm text-gray-600">{query.buyer_phone}</p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      query.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : query.status === "viewed"
                        ? "bg-blue-100 text-blue-700"
                        : query.status === "responded"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {query.status}
                  </span>
                </div>

                <div className="bg-gray-50 rounded p-3">
                  <p className="text-xs font-semibold text-gray-600 uppercase mb-1">
                    Interested in
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {query.sellCar?.make?.name} {query.sellCar?.version?.name}
                  </p>
                </div>

                <p className="text-xs text-gray-500">
                  {new Date(query.created_at).toLocaleDateString()}
                </p>

                <Link
                  href="/user/dashboard/buyer-queries"
                  className="w-full px-3 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors text-sm font-medium text-center block"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Favorite Cars Section */}
      {favoriteCars.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-600" />
              Your Favorite Cars
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteCars.map((car) => (
              <Link
                key={car.id}
                href={`/all-cars/${car.id}`}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden group"
              >
                {/* Image */}
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                  {car.images && car.images.length > 0 ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/${car.images[0]}`}
                      alt={`${car.make?.name}`}
                      fill
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-500">No image</span>
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemoveFavorite(car.id);
                    }}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg hover:bg-red-50 transition-all"
                  >
                    <Heart size={18} className="fill-red-500 text-red-500" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {car.make?.name} {car.version?.model?.name}
                    </h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <MapPin size={14} /> {car.city?.name || "City"}
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-blue-600">
                      PKR {car.price?.toLocaleString()}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Gauge size={14} /> {car.mileage?.toLocaleString()} km
                  </p>

                  <div className="pt-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemoveFavorite(car.id);
                      }}
                      className="w-full px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <Trash2 size={16} />
                      Remove from Favorites
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
