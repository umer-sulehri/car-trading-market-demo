"use client";

import { useEffect, useState } from "react";
import { getFavoriteCars, removeFromFavorites } from "@/src/services/favorite.service";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin, Gauge, DollarSign, Trash2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface FavoriteCar {
  id: number;
  make?: { id: number; name: string };
  version?: { 
    id: number; 
    name: string; 
    model?: { id: number; name: string } 
  };
  city?: { id: number; name: string };
  mileage: number;
  price: number;
  seller_name: string;
  seller_phone: string;
  status: string;
  media?: Array<{ image: string; media_path: string }>;
}

const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e5e7eb' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' font-size='18' fill='%239ca3af' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E";

export default function MyFavoritesPage() {
  const router = useRouter();
  const [favoriteCars, setFavoriteCars] = useState<FavoriteCar[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<number | null>(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await getFavoriteCars();
      const cars = Array.isArray(response) ? response : (response as any)?.data || [];
      setFavoriteCars(cars);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      setFavoriteCars([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (carId: number) => {
    try {
      setRemoving(carId);
      await removeFromFavorites(carId);
      setFavoriteCars(prevCars => prevCars.filter(car => car.id !== carId));
    } catch (error) {
      console.error("Error removing favorite:", error);
    } finally {
      setRemoving(null);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
        <div className="max-w-7xl mx-auto mt-16">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                <Heart className="w-6 h-6 text-red-600 fill-red-600" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">My Favorite Cars</h1>
                <p className="text-gray-600 mt-1">
                  {favoriteCars.length === 0 
                    ? "You haven't saved any favorite cars yet" 
                    : `You have saved ${favoriteCars.length} car${favoriteCars.length !== 1 ? 's' : ''}`}
                </p>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading your favorite cars...</p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && favoriteCars.length === 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Favorites Yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Start exploring our listings and save your favorite cars to view them later. Each car you like will appear here.
              </p>
              <Link
                href="/all-cars"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Explore Cars
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* Cars Grid */}
          {!loading && favoriteCars.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteCars.map((car) => {
                const imageUrl = car.media?.[0]?.image || car.media?.[0]?.media_path || PLACEHOLDER_IMAGE;
                const makeName = car.make?.name || "Unknown Make";
                const versionName = car.version?.name || "Unknown Model";
                const modelName = car.version?.model?.name || "";
                const cityName = car.city?.name || "Unknown City";

                return (
                  <div
                    key={car.id}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all overflow-hidden group"
                  >
                    {/* Image Container */}
                    <div className="relative h-56 bg-gray-200 overflow-hidden">
                      <Image
                      src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/${car.media?.[0]?.image || car.media?.[0]?.media_path || PLACEHOLDER_IMAGE}`}

                        alt={`${makeName} ${versionName}`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
                        }}
                      />
                      
                      {/* Favorite Badge */}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-full p-2 shadow-md">
                        <Heart className="w-6 h-6 text-red-600 fill-red-600" />
                      </div>

                      {/* Status Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                          ✓ Approved
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      {/* Car Title */}
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {makeName} {versionName}
                      </h3>
                      <p className="text-sm text-gray-500 mb-4">
                        {modelName && `${modelName} • `}{new Date(car.id).getFullYear()}
                      </p>

                      {/* Specs */}
                      <div className="space-y-2 mb-5 pb-5 border-b border-gray-200">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Gauge className="w-4 h-4 text-blue-600" />
                          <span>{car.mileage?.toLocaleString()} km</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-blue-600" />
                          <span>{cityName}</span>
                        </div>
                      </div>

                      {/* Price & Actions */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-gray-900">
                            {car.price} rs
                          </span>
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="flex gap-2">
                        <Link
                          href={`/all-cars/${car.id}`}
                          className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-colors text-center"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => handleRemoveFavorite(car.id)}
                          disabled={removing === car.id}
                          className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {removing === car.id ? (
                            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      {/* Seller Info */}
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm">
                        <p className="text-gray-600 mb-1">Seller: <span className="font-medium text-gray-900">{car.seller_name}</span></p>
                        <p className="text-gray-600">
                          Phone: <a href={`tel:${car.seller_phone}`} className="font-medium text-blue-600 hover:underline">{car.seller_phone}</a>
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Back to Dashboard */}
          {!loading && favoriteCars.length > 0 && (
            <div className="mt-12 text-center">
              <Link
                href="/user/dashboard"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Back to Dashboard
              </Link>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
